import React from 'react';

// 一张卡：种子卡（esther 只读给访客）或留言卡（owner 可编辑/删除）
export default function CardView({
  card,
  myToken,
  canEdit,
  editing,
  editText,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onPointerDown,
  onStartEdit,
  onBringFront,
}) {
  const isMessage = card.kind === 'message';
  const isMine = card.owner === myToken;

  const style = {
    left: card.x,
    top: card.y,
    width: card.w,
    minHeight: card.h,
    background: card.color,
  };

  return (
    <div
      className={`wb-card${isMessage ? ' wb-card-message' : ''}${editing ? ' editing' : ''}`}
      id={card.id}
      style={style}
      onPointerDown={(e) => onPointerDown(e, card)}
      onMouseEnter={onBringFront}
    >
      {canEdit && (
        <div className="wb-card-actions">
          {!editing && (
            <button
              className="wb-card-act"
              title="编辑"
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit(card);
              }}
            >
              ✎
            </button>
          )}
          <button
            className="wb-card-act wb-card-del"
            title="删除"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card);
            }}
          >
            ×
          </button>
        </div>
      )}

      {isMessage && (
        <div className="wb-card-head">
          <span className="wb-card-avatar" style={{ background: avatarColor(card.owner) }}>
            {(card.name || '匿').charAt(0)}
          </span>
          <span className="wb-card-name">
            {card.name || '匿名'}
            {isMine && <em className="wb-card-mine">我</em>}
          </span>
          <span className="wb-card-time">{formatTime(card.createdAt)}</span>
        </div>
      )}

      {editing ? (
        <textarea
          className="wb-card-edit"
          value={editText}
          autoFocus
          onChange={(e) => onEditChange(e.target.value)}
          onBlur={onSaveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              onCancelEdit();
            } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              onSaveEdit();
            }
          }}
        />
      ) : (
        <div
          className="wb-card-body"
          onDoubleClick={(e) => {
            e.stopPropagation();
            onStartEdit(card);
          }}
        >
          {card.name && isMessage ? null : null}
          <pre className="wb-card-text">{card.text}</pre>
        </div>
      )}
    </div>
  );
}

function avatarColor(token) {
  let h = 0;
  for (let i = 0; i < token.length; i++) h = (h * 31 + token.charCodeAt(i)) % 360;
  return `hsl(${h}, 60%, 55%)`;
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`;
}
