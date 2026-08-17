import React from 'react';
import CardView from './CardView.jsx';
import MessageModal from './MessageModal.jsx';
import {
  seedCards,
  messageColors,
} from './seedCards.js';
import {
  getMyToken,
  isAdmin,
  loadLocalCards,
  saveLocalCards,
  deleteRemoteCard,
  postRemoteCard,
  updateRemoteCard,
  supabaseReady,
  WB_CONFIG,
} from './data.js';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function WhiteboardApp() {
  const myToken = React.useMemo(getMyToken, []);
  const admin = isAdmin(myToken);

  const [cards, setCards] = React.useState(() => [...seedCards, ...loadLocalCards()]);
  const [scale, setScale] = React.useState(0.85);
  const [pan, setPan] = React.useState({ x: 60, y: 20 });
  const [editing, setEditing] = React.useState(null); // { id, text }
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalStatus, setModalStatus] = React.useState('');
  const [statusMsg, setStatusMsg] = React.useState('');

  const canvasRef = React.useRef(null);
  const dragRef = React.useRef(null);
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
        return next;
      });
      if (syncRemote && supabaseReady()) {
        // RLS 保证只能改自己的
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
      if (card.kind === 'message' && supabaseReady()) {
        deleteRemoteCard(card.id).catch(() => {});
      }
    },
    [persist]
  );

  // ---------- add message ----------
  const addMessage = React.useCallback(
    (name, text, color) => {
      const pos = randomPos(cardsRef.current, scale, pan);
      const card = {
        id: `msg-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        kind: 'message',
        owner: myToken,
        name: name || '匿名',
        text,
        color,
        x: pos.x,
        y: pos.y,
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
    [myToken, persist, pan, scale]
  );

  // ---------- add blank note ----------
  const addNote = React.useCallback(() => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const cx = rect ? (rect.width / 2 - pan.x) / scale : 400;
    const cy = rect ? (rect.height / 2 - pan.y) / scale : 300;
    const card = {
      id: `note-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
      kind: 'message',
      owner: myToken,
      name: '',
      text: '双击编辑内容…',
      color: '#ffd166',
      x: Math.round(cx - 120),
      y: Math.round(cy - 60),
      w: 240,
      h: 120,
      createdAt: Date.now(),
    };
    setCards((prev) => {
      const next = [...prev, card];
      persist(next);
      return next;
    });
    if (supabaseReady()) {
      postRemoteCard(card).catch(() => {});
    }
    flashStatus('新建了一张卡片，双击编辑 ✏️');
  }, [myToken, persist, pan.x, pan.y, scale]);

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

  // ---------- canvas: pan & card drag via pointer events ----------
  const startDrag = React.useCallback((e, card) => {
    if (e.button !== 0) return;
    if (card) {
      dragRef.current = {
        type: 'card',
        id: card.id,
        startX: e.clientX,
        startY: e.clientY,
        cardX: card.x,
        cardY: card.y,
      };
      // bring to front
      setCards((prev) => {
        const next = prev.map((c) =>
          c.id === card.id ? { ...c, z: ++zRef.current } : c
        );
        return next;
      });
    } else {
      dragRef.current = {
        type: 'pan',
        startX: e.clientX,
        startY: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    }
  }, [pan.x, pan.y]);

  React.useEffect(() => {
    const onMove = (e) => {
      const d = dragRef.current;
      if (!d) return;
      if (d.type === 'pan') {
        setPan({ x: d.panX + (e.clientX - d.startX), y: d.panY + (e.clientY - d.startY) });
      } else if (d.type === 'card') {
        const dx = (e.clientX - d.startX) / scale;
        const dy = (e.clientY - d.startY) / scale;
        updateCard(d.id, { x: Math.round(d.cardX + dx), y: Math.round(d.cardY + dy) });
      }
    };
    const onUp = () => {
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
    setEditing({ id: card.id, text: card.text });
  }, []);
  const saveEdit = React.useCallback(() => {
    if (!editing) return;
    updateCard(editing.id, { text: editing.text }, true);
    setEditing(null);
  }, [editing, updateCard]);
  const cancelEdit = React.useCallback(() => setEditing(null), []);

  // ---------- view helpers ----------
  const focusCard = React.useCallback(
    (card) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      setScale(1);
      setPan({
        x: rect.width / 2 - (card.x + card.w / 2),
        y: rect.height / 2 - (card.y + card.h / 2),
      });
    },
    []
  );

  const fitAll = React.useCallback(() => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cs = cardsRef.current;
    if (!cs.length) return;
    const minX = Math.min(...cs.map((c) => c.x));
    const minY = Math.min(...cs.map((c) => c.y));
    const maxX = Math.max(...cs.map((c) => c.x + c.w));
    const maxY = Math.max(...cs.map((c) => c.y + c.h));
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
        <button className="wb-tb-btn" onClick={addNote} title="新建一张自己的卡片">
          ＋ 新建
        </button>
        <div className="wb-tb-spacer" />
        <button className="wb-tb-btn" onClick={() => setScale((s) => clamp(s * 0.9, 0.2, 3))} title="缩小">
          −
        </button>
        <span className="wb-zoom-pct">{Math.round(scale * 100)}%</span>
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
                <span className="wb-layer-dot" style={{ background: c.color }} />
                <span className="wb-layer-name">
                  {c.kind === 'seed' ? c.name : `💬 ${c.name || '匿名'}`}
                </span>
                <span className="wb-layer-owner">
                  {c.owner === myToken ? '我' : c.kind === 'seed' ? 'Esther' : '访客'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="wb-canvas"
          ref={canvasRef}
          onPointerDown={(e) => startDrag(e, null)}
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
                onBringFront={() => {
                  if (card.z < zRef.current - 1) {
                    setCards((prev) =>
                      prev.map((x) => (x.id === card.id ? { ...x, z: ++zRef.current } : x))
                    );
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <MessageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addMessage}
        status={modalStatus}
      />

      {statusMsg && <div className="wb-toast">{statusMsg}</div>}
    </div>
  );
}

function randomPos(cards, scale, pan) {
  // 视口中心附近随机，尽量避开已有卡片
  const baseX = 400;
  const baseY = 300;
  let x = baseX + (Math.random() * 500 - 250);
  let y = baseY + (Math.random() * 320 - 160);
  for (let i = 0; i < 10; i++) {
    const clash = cards.some(
      (c) => Math.abs(c.x - x) < 300 && Math.abs(c.y - y) < 180
    );
    if (!clash) break;
    x += Math.random() * 320 - 160;
    y += Math.random() * 200 - 100;
  }
  return { x: Math.round(x), y: Math.round(y) };
}
