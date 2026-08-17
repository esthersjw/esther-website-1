import React from 'react';
import CardView from './CardView.jsx';
import MessageModal from './MessageModal.jsx';
import TemplatePicker from './TemplatePicker.jsx';
import CardModal from './CardModal.jsx';
import DoodleLayer from './DoodleLayer.jsx';
import { getTemplate, editableText, withEditedText } from './templates.jsx';
import { seedCards } from './seedCards.js';
import {
  getMyToken,
  isAdmin,
  loadLocalCards,
  saveLocalCards,
  loadLocalStrokes,
  saveLocalStrokes,
  deleteRemoteCard,
  postRemoteCard,
  updateRemoteCard,
  postRemoteStroke,
  deleteRemoteStroke,
  supabaseReady,
} from './data.js';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const PEN_COLORS = ['#2b2b2b', '#e84a5f', '#4a7cc9', '#3aa655', '#f5a623', '#9b59b6'];
const PEN_WIDTHS = [3, 6, 11];
const SEED_VOTES_KEY = 'wb.seedVotes.v1';
const SEED_OVERRIDES_KEY = 'wb.seedOverrides.v1';

function loadSeedVotes() {
  try {
    return JSON.parse(localStorage.getItem(SEED_VOTES_KEY)) || {};
  } catch {
    return {};
  }
}

// 管理员对种子卡的本地调整：位置 / 内容 / 删除
function loadSeedOverrides() {
  try {
    return JSON.parse(localStorage.getItem(SEED_OVERRIDES_KEY)) || {};
  } catch {
    return {};
  }
}

function saveSeedOverride(id, patch) {
  try {
    const ov = loadSeedOverrides();
    ov[id] = { ...ov[id], ...patch };
    localStorage.setItem(SEED_OVERRIDES_KEY, JSON.stringify(ov));
  } catch {
    /* ignore */
  }
}

export default function WhiteboardApp() {
  const myToken = React.useMemo(getMyToken, []);
  const admin = isAdmin(myToken);

  const [cards, setCards] = React.useState(() => {
    const sv = loadSeedVotes();
    const ov = loadSeedOverrides();
    const seeds = seedCards
      .filter((s) => !ov[s.id]?.deleted)
      .map((s) => {
        const o = ov[s.id];
        let merged = o
          ? { ...s, x: o.x ?? s.x, y: o.y ?? s.y, data: o.data ? { ...s.data, ...o.data } : s.data }
          : s;
        if (sv[s.id]) merged = { ...merged, data: { ...merged.data, options: sv[s.id] } };
        return merged;
      });
    return [...seeds, ...loadLocalCards()];
  });
  const [strokes, setStrokes] = React.useState(loadLocalStrokes);
  const [scale, setScale] = React.useState(0.8);
  const [pan, setPan] = React.useState({ x: 40, y: 10 });
  const [editing, setEditing] = React.useState(null); // { id, text }
  const [modalOpen, setModalOpen] = React.useState(false); // 留言
  const [modalStatus, setModalStatus] = React.useState('');
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [cardModal, setCardModal] = React.useState(null); // { mode, tpl, card }
  const [statusMsg, setStatusMsg] = React.useState('');

  // 涂鸦
  const [drawMode, setDrawMode] = React.useState(false);
  const [pen, setPen] = React.useState({ color: PEN_COLORS[0], width: PEN_WIDTHS[1], eraser: false });
  const [curStroke, setCurStroke] = React.useState(null);

  const canvasRef = React.useRef(null);
  const dragRef = React.useRef(null);
  const strokeRef = React.useRef(null);
  const erasingRef = React.useRef(false);
  const movedRef = React.useRef(false); // 拖动后抑制点击（投票等）
  const zRef = React.useRef(10);
  const cardsRef = React.useRef(cards);
  cardsRef.current = cards;
  const statusTimer = React.useRef(null);

  // ---------- persistence ----------
  const persist = React.useCallback((nextCards) => {
    saveLocalCards(nextCards.filter((c) => c.kind === 'message'));
  }, []);

  const updateCard = React.useCallback(
    (id, patch, syncRemote = false) => {
      setCards((prev) => {
        const next = prev.map((c) => (c.id === id ? { ...c, ...patch } : c));
        persist(next);
        const target = next.find((c) => c.id === id);
        if (target?.kind === 'seed') {
          saveSeedOverride(id, { x: target.x, y: target.y, data: target.data });
        }
        return next;
      });
      if (syncRemote && supabaseReady()) {
        updateRemoteCard(id, patch).catch(() => {});
      }
    },
    [persist]
  );

  const deleteCard = React.useCallback(
    (card) => {
      if (!window.confirm('确定删除这张卡片？')) return;
      setCards((prev) => {
        const next = prev.filter((c) => c.id !== card.id);
        persist(next);
        return next;
      });
      if (card.kind === 'seed') {
        saveSeedOverride(card.id, { deleted: true });
      } else if (card.kind === 'message' && supabaseReady()) {
        deleteRemoteCard(card.id).catch(() => {});
      }
    },
    [persist]
  );

  // ---------- add message ----------
  const addMessage = React.useCallback(
    (name, text, color) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      const cx = rect ? (rect.width / 2 - pan.x) / scale : 400;
      const cy = rect ? (rect.height / 2 - pan.y) / scale : 300;
      const spot = findSpot(cardsRef.current, 240, 96, cx, cy);
      const card = {
        id: `msg-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        kind: 'message',
        owner: myToken,
        name: name || '匿名',
        text,
        color,
        x: spot.x,
        y: spot.y,
        w: 240,
        h: 96,
        createdAt: Date.now(),
      };
      setCards((prev) => {
        const next = [...prev, card];
        persist(next);
        return next;
      });
      setModalOpen(false);
      if (supabaseReady()) {
        postRemoteCard(card).catch(() => setModalStatus('发送失败，请稍后再试 🙏'));
      }
      flashStatus('留言已贴到白板 ✨');
    },
    [myToken, persist, pan.x, pan.y, scale]
  );

  // ---------- templated cards (intro / sticker / polaroid / vote) ----------
  const openCreateModal = React.useCallback((tplId) => {
    setPickerOpen(false);
    setCardModal({ mode: 'create', tpl: tplId, card: null });
  }, []);

  const submitCardModal = React.useCallback(
    (data) => {
      if (!cardModal) return;
      if (cardModal.mode === 'edit') {
        updateCard(cardModal.card.id, { data }, true);
        setCardModal(null);
        flashStatus('已保存 ✨');
        return;
      }
      const tpl = getTemplate(cardModal.tpl);
      const rect = canvasRef.current?.getBoundingClientRect();
      const cx = rect ? (rect.width / 2 - pan.x) / scale : 400;
      const cy = rect ? (rect.height / 2 - pan.y) / scale : 300;
      const spot = findSpot(cardsRef.current, tpl.w || 240, tpl.h || 160, cx, cy);
      const card = {
        id: `note-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        kind: 'message',
        owner: myToken,
        tpl: tpl.id,
        name: '',
        data,
        x: spot.x,
        y: spot.y,
        w: tpl.w,
        h: tpl.h,
        createdAt: Date.now(),
      };
      setCards((prev) => {
        const next = [...prev, card];
        persist(next);
        return next;
      });
      setCardModal(null);
      if (supabaseReady()) {
        postRemoteCard(card).catch(() => {});
      }
      flashStatus(`${tpl.icon} ${tpl.name}已贴到白板 ✨`);
    },
    [cardModal, myToken, persist, pan.x, pan.y, scale, updateCard]
  );

  // ---------- vote ----------
  const onVote = React.useCallback(
    (card, idx) => {
      const options = (card.data?.options || []).map((op, i) => {
        const had = (op.votes || []).includes(myToken);
        const votes = (op.votes || []).filter((t) => t !== myToken);
        if (i === idx && !had) votes.push(myToken);
        return { ...op, votes };
      });
      if (card.kind === 'seed') {
        // 种子投票卡：票数单独存本地（不进入卡片存储）
        setCards((prev) =>
          prev.map((c) => (c.id === card.id ? { ...c, data: { ...c.data, options } } : c))
        );
        try {
          const sv = loadSeedVotes();
          sv[card.id] = options;
          localStorage.setItem(SEED_VOTES_KEY, JSON.stringify(sv));
        } catch {
          /* ignore */
        }
      } else {
        updateCard(card.id, { data: { ...card.data, options } }, true);
      }
    },
    [myToken, updateCard]
  );

  // ---------- status toast ----------
  const flashStatus = React.useCallback((msg) => {
    setStatusMsg(msg);
    clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatusMsg(''), 2600);
  }, []);

  // ---------- canvas: wheel zoom (non-passive) ----------
  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setScale((s) => {
        const ns = clamp(s * (e.deltaY < 0 ? 1.1 : 0.9), 0.2, 3);
        setPan((p) => {
          const wx = (mx - p.x) / s;
          const wy = (my - p.y) / s;
          return { x: mx - wx * ns, y: my - wy * ns };
        });
        return ns;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const toWorld = React.useCallback(
    (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left - pan.x) / scale,
        y: (e.clientY - rect.top - pan.y) / scale,
      };
    },
    [pan.x, pan.y, scale]
  );

  // ---------- doodle: strokes ----------
  const eraseAt = React.useCallback(
    (wx, wy) => {
      const r = 26 / scale; // 约 26 屏幕像素的擦除半径
      setStrokes((prev) => {
        const removed = [];
        const next = prev.filter((s) => {
          const hit =
            (admin || s.owner === myToken) &&
            s.points.some(
              (v, i) => i % 2 === 0 && Math.hypot(v - wx, s.points[i + 1] - wy) < r + s.width / 2
            );
          if (hit) removed.push(s.id);
          return !hit;
        });
        if (removed.length) {
          saveLocalStrokes(next);
          if (supabaseReady()) removed.forEach((id) => deleteRemoteStroke(id).catch(() => {}));
        }
        return next;
      });
    },
    [scale, admin, myToken]
  );

  const strokeStart = React.useCallback(
    (e) => {
      if (e.button !== 0) return;
      const { x, y } = toWorld(e);
      if (pen.eraser) {
        erasingRef.current = true;
        eraseAt(x, y);
        return;
      }
      strokeRef.current = {
        id: `stk-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        owner: myToken,
        color: pen.color,
        width: pen.width,
        points: [x, y],
        createdAt: Date.now(),
      };
      setCurStroke({ ...strokeRef.current });
    },
    [toWorld, pen, myToken, eraseAt]
  );

  React.useEffect(() => {
    if (!drawMode) return;
    const onMove = (e) => {
      if (erasingRef.current) {
        const { x, y } = toWorld(e);
        eraseAt(x, y);
        return;
      }
      const s = strokeRef.current;
      if (!s) return;
      const { x, y } = toWorld(e);
      const n = s.points.length;
      if (Math.hypot(x - s.points[n - 2], y - s.points[n - 1]) > 1.5) {
        s.points.push(x, y);
        setCurStroke({ ...s, points: [...s.points] });
      }
    };
    const onUp = () => {
      erasingRef.current = false;
      const s = strokeRef.current;
      if (!s) return;
      strokeRef.current = null;
      setCurStroke(null);
      if (s.points.length < 4) s.points.push(s.points[0] + 0.01, s.points[1] + 0.01); // 点
      setStrokes((prev) => {
        const next = [...prev, s];
        saveLocalStrokes(next);
        return next;
      });
      if (supabaseReady()) postRemoteStroke(s).catch(() => {});
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [drawMode, toWorld, eraseAt]);

  const undoStroke = React.useCallback(() => {
    setStrokes((prev) => {
      const idxRev = [...prev].reverse().findIndex((s) => s.owner === myToken);
      if (idxRev === -1) return prev;
      const idx = prev.length - 1 - idxRev;
      const removed = prev[idx];
      const next = prev.filter((_, i) => i !== idx);
      saveLocalStrokes(next);
      if (supabaseReady()) deleteRemoteStroke(removed.id).catch(() => {});
      return next;
    });
  }, [myToken]);

  // ---------- canvas: pan & card drag via pointer events ----------
  const startDrag = React.useCallback(
    (e, card) => {
      if (e.button !== 0) return;
      movedRef.current = false;
      if (card) {
        // 只有创建者（或管理员）能拖动卡片
        if (!admin && card.owner !== myToken) return;
        dragRef.current = {
          type: 'card',
          id: card.id,
          startX: e.clientX,
          startY: e.clientY,
          cardX: card.x,
          cardY: card.y,
          moved: false,
        };
        setCards((prev) =>
          prev.map((c) => (c.id === card.id ? { ...c, z: ++zRef.current } : c))
        );
      } else {
        dragRef.current = {
          type: 'pan',
          startX: e.clientX,
          startY: e.clientY,
          panX: pan.x,
          panY: pan.y,
          moved: false,
        };
      }
    },
    [pan.x, pan.y, admin, myToken]
  );

  React.useEffect(() => {
    const onMove = (e) => {
      const d = dragRef.current;
      if (!d) return;
      if (Math.abs(e.clientX - d.startX) + Math.abs(e.clientY - d.startY) > 4) d.moved = true;
      if (d.type === 'pan') {
        setPan({ x: d.panX + (e.clientX - d.startX), y: d.panY + (e.clientY - d.startY) });
      } else if (d.type === 'card') {
        const dx = (e.clientX - d.startX) / scale;
        const dy = (e.clientY - d.startY) / scale;
        updateCard(d.id, { x: Math.round(d.cardX + dx), y: Math.round(d.cardY + dy) });
      }
    };
    const onUp = () => {
      if (dragRef.current?.moved) {
        movedRef.current = true;
        setTimeout(() => {
          movedRef.current = false;
        }, 120);
      }
      dragRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [scale, updateCard]);

  // ---------- edit ----------
  const startEdit = React.useCallback((card) => {
    if (card.tpl) {
      const t = getTemplate(card.tpl);
      if (t.editModal) {
        setCardModal({ mode: 'edit', tpl: card.tpl, card });
        return;
      }
      if (!t.editField) return;
      setEditing({ id: card.id, text: editableText(card.tpl, card.data) || '' });
    } else {
      setEditing({ id: card.id, text: card.text || '' });
    }
  }, []);
  const saveEdit = React.useCallback(() => {
    if (!editing) return;
    const card = cardsRef.current.find((c) => c.id === editing.id);
    if (card) {
      if (card.tpl) {
        updateCard(editing.id, { data: withEditedText(card.tpl, card.data, editing.text) }, true);
      } else {
        updateCard(editing.id, { text: editing.text }, true);
      }
    }
    setEditing(null);
  }, [editing, updateCard]);
  const cancelEdit = React.useCallback(() => setEditing(null), []);

  // ---------- view helpers ----------
  const focusCard = React.useCallback((card) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setScale(1);
    setPan({
      x: rect.width / 2 - (card.x + (card.w || 300) / 2),
      y: rect.height / 2 - (card.y + (card.h || 200) / 2),
    });
  }, []);

  const fitAll = React.useCallback(() => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cs = cardsRef.current;
    if (!cs.length) return;
    const minX = Math.min(...cs.map((c) => c.x));
    const minY = Math.min(...cs.map((c) => c.y));
    const maxX = Math.max(...cs.map((c) => c.x + (c.w || 300)));
    const maxY = Math.max(...cs.map((c) => c.y + (c.h || 200)));
    const w = maxX - minX + 80;
    const h = maxY - minY + 80;
    const s = clamp(Math.min(rect.width / w, rect.height / h), 0.2, 1.4);
    setScale(s);
    setPan({
      x: (rect.width - w * s) / 2 - minX * s,
      y: (rect.height - h * s) / 2 - minY * s,
    });
  }, []);

  // ---------- render ----------
  const canEditCard = (card) => admin || card.owner === myToken;

  return (
    <div className="wb-app">
      <div className="wb-toolbar">
        <div className="wb-logo">
          <div className="wb-logo-icon">E</div>
          <span>共享白板</span>
        </div>
        <button className="wb-tb-btn wb-tb-primary" onClick={() => setModalOpen(true)}>
          ✍️ 留言
        </button>
        <button className="wb-tb-btn" onClick={() => setPickerOpen(true)} title="名片 / 贴纸 / 拍立得 / 投票">
          ＋ 贴一张
        </button>
        <button
          className={`wb-tb-btn wb-tb-doodle${drawMode ? ' active' : ''}`}
          onClick={() => {
            setDrawMode((d) => !d);
            setPen((p) => ({ ...p, eraser: false }));
          }}
          title="在白板任意角落画画"
        >
          🖌️ 涂鸦
        </button>
        <div className="wb-tb-spacer" />
        <span className="wb-zoom-pct">{Math.round(scale * 100)}%</span>
        <button className="wb-tb-btn" onClick={() => setScale((s) => clamp(s * 0.9, 0.2, 3))} title="缩小">
          −
        </button>
        <button className="wb-tb-btn" onClick={() => setScale((s) => clamp(s * 1.1, 0.2, 3))} title="放大">
          +
        </button>
        <button className="wb-tb-btn" onClick={fitAll} title="适应画布">
          ⊞
        </button>
      </div>

      <div className="wb-body">
        <div className="wb-left">
          <div className="wb-left-title">✦ 卡片列表</div>
          <div className="wb-layer-list">
            {cards.map((c) => (
              <div key={c.id} className="wb-layer-item" onClick={() => focusCard(c)}>
                <span className="wb-layer-dot" style={{ background: c.color || c.data?.color || '#ffd166' }} />
                <span className="wb-layer-name">{layerLabel(c)}</span>
                <span className="wb-layer-owner">
                  {c.owner === myToken ? '我' : c.kind === 'seed' ? 'Esther' : '访客'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`wb-canvas${drawMode ? ' drawing' : ''}`}
          ref={canvasRef}
          onPointerDown={(e) => (drawMode ? strokeStart(e) : startDrag(e, null))}
        >
          <div
            className="wb-transform"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
          >
            {cards.map((card) => (
              <CardView
                key={card.id}
                card={card}
                myToken={myToken}
                canEdit={canEditCard(card)}
                editing={editing && editing.id === card.id}
                editText={editing && editing.id === card.id ? editing.text : ''}
                onEditChange={(t) => setEditing((ed) => (ed ? { ...ed, text: t } : ed))}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onDelete={deleteCard}
                onPointerDown={(e, c) => startDrag(e, c)}
                onStartEdit={startEdit}
                onVote={onVote}
                movedRef={movedRef}
                onBringFront={() => {
                  if (card.z < zRef.current - 1) {
                    setCards((prev) =>
                      prev.map((x) => (x.id === card.id ? { ...x, z: ++zRef.current } : x))
                    );
                  }
                }}
              />
            ))}
            <DoodleLayer strokes={strokes} current={curStroke} />
          </div>
        </div>
      </div>

      {drawMode && (
        <div className="wb-pen-bar">
          <span className="wb-pen-label">🖌️</span>
          {PEN_COLORS.map((c) => (
            <button
              key={c}
              className={`wb-color${pen.color === c && !pen.eraser ? ' active' : ''}`}
              style={{ background: c }}
              onClick={() => setPen((p) => ({ ...p, color: c, eraser: false }))}
              aria-label="画笔颜色"
            />
          ))}
          <span className="wb-pen-sep" />
          {PEN_WIDTHS.map((w) => (
            <button
              key={w}
              className={`wb-pen-width${pen.width === w && !pen.eraser ? ' active' : ''}`}
              onClick={() => setPen((p) => ({ ...p, width: w, eraser: false }))}
              aria-label="笔画粗细"
            >
              <span style={{ width: w + 2, height: w + 2 }} />
            </button>
          ))}
          <span className="wb-pen-sep" />
          <button
            className={`wb-pen-tool${pen.eraser ? ' active' : ''}`}
            onClick={() => setPen((p) => ({ ...p, eraser: !p.eraser }))}
            title="橡皮擦（只能擦自己的笔迹）"
          >
            🧽
          </button>
          <button className="wb-pen-tool" onClick={undoStroke} title="撤销我上一笔">
            ↩
          </button>
          <button className="wb-pen-done" onClick={() => setDrawMode(false)}>
            完成 ✓
          </button>
        </div>
      )}

      <MessageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addMessage}
        status={modalStatus}
      />
      <TemplatePicker
        open={pickerOpen}
        admin={admin}
        onClose={() => setPickerOpen(false)}
        onPick={openCreateModal}
      />
      <CardModal
        open={!!cardModal}
        mode={cardModal?.mode}
        tpl={cardModal?.tpl}
        card={cardModal?.card}
        onClose={() => setCardModal(null)}
        onSubmit={submitCardModal}
      />

      {statusMsg && <div className="wb-toast">{statusMsg}</div>}
    </div>
  );
}

function layerLabel(c) {
  if (c.tpl === 'intro') return `🪪 ${c.data?.name || '名片'}`;
  if (c.tpl === 'sticker') return `${c.data?.emoji || '😆'} 贴纸`;
  if (c.tpl === 'polaroid') return `📸 ${c.data?.caption || '拍立得'}`;
  if (c.tpl === 'vote') return `🗳️ ${c.data?.question || '投票'}`;
  if (c.kind === 'seed') return c.data?.title || c.data?.name || '卡片';
  return c.name ? `💬 ${c.name}` : '💬 匿名';
}

// 从 (cx, cy) 附近向外环形搜索一个不覆盖任何现有卡片的空位
function findSpot(cards, w, h, cx, cy) {
  const gap = 24;
  const hits = (x, y) =>
    cards.some(
      (c) =>
        !(
          x + w + gap <= c.x ||
          c.x + (c.w || 300) + gap <= x ||
          y + h + gap <= c.y ||
          c.y + (c.h || 200) + gap <= y
        )
    );
  if (!hits(cx - w / 2, cy - h / 2)) return { x: Math.round(cx - w / 2), y: Math.round(cy - h / 2) };
  const step = 70;
  for (let ring = 1; ring < 40; ring++) {
    const n = ring * 8;
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      const x = cx - w / 2 + Math.cos(angle) * ring * step * 1.5; // 横向扩散更快
      const y = cy - h / 2 + Math.sin(angle) * ring * step;
      if (!hits(x, y)) return { x: Math.round(x), y: Math.round(y) };
    }
  }
  return { x: Math.round(cx - w / 2), y: Math.round(cy - h / 2) };
}
