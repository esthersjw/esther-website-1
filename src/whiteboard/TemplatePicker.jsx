import React from 'react';
import { TEMPLATES } from './templates.jsx';

// 模板选择器：访客只能选可编辑模板（editField != null），管理员可选全部
export default function TemplatePicker({ open, admin, onClose, onPick }) {
  if (!open) return null;
  const list = admin ? TEMPLATES : TEMPLATES.filter((t) => t.editField != null);

  return (
    <div className="wb-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="wb-modal wb-picker">
        <div className="wb-modal-title">✦ 选择卡片模板</div>
        <div className="wb-template-grid">
          {list.map((t) => (
            <button key={t.id} className="wb-template-item" onClick={() => onPick(t.id)}>
              <div className="wb-template-icon">{t.icon}</div>
              <div className="wb-template-name">{t.name}</div>
            </button>
          ))}
        </div>
        {!admin && (
          <div className="wb-picker-note">访客可选择这些模板；创建后只有你能编辑它 ✏️</div>
        )}
        <div className="wb-modal-actions">
          <button className="wb-modal-cancel" onClick={onClose}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
