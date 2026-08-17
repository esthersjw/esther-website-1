import React from 'react';

// 卡片模板系统：从旧版 infinite-canvas 的手绘卡片类型移植而来。
// 每种模板 = 元数据（名称/图标/默认尺寸）+ 渲染组件。

export const TEMPLATES = [
  { id: 'washi', name: '胶带卡', icon: '📦', w: 340, h: 200, editField: 'body' },
  { id: 'quote', name: '引用卡', icon: '❝', w: 340, h: 190, editField: 'text' },
  { id: 'dark', name: '深色卡', icon: '🌙', w: 320, h: 200, editField: 'body' },
  { id: 'sticky', name: '便利贴', icon: '🗒️', w: 220, h: 170, editField: 'text' },
  { id: 'narrative', name: '叙事卡', icon: '📖', w: 400, h: 230, editField: 'text' },
  { id: 'profile', name: '个人卡', icon: '👤', w: 380, h: 320, editField: null },
  { id: 'timeline', name: '时间线', icon: '📍', w: 420, h: 320, editField: null },
  { id: 'skills', name: '技能卡', icon: '🛠️', w: 480, h: 220, editField: null },
  { id: 'opinions', name: '观点卡', icon: '✍️', w: 360, h: 270, editField: null },
  { id: 'work', name: '作品卡', icon: '🚀', w: 320, h: 250, editField: null },
  { id: 'ai', name: 'AI 伙伴', icon: '🤖', w: 280, h: 190, editField: 'desc' },
  { id: 'link', name: '链接卡', icon: '🔗', w: 240, h: 160, editField: 'title' },
];

export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}

// 双击编辑时，各模板可编辑的主文本字段
export function editableText(tpl, data) {
  const f = getTemplate(tpl).editField;
  if (!f) return null;
  const v = data?.[f];
  return typeof v === 'string' ? v : '';
}

export function withEditedText(tpl, data, text) {
  const f = getTemplate(tpl).editField;
  if (!f) return data;
  return { ...data, [f]: text };
}

// ---------- 模板渲染 ----------
export default function TemplateBody({ tpl, data }) {
  switch (tpl) {
    case 'profile':
      return <ProfileCard data={data} />;
    case 'timeline':
      return <TimelineCard data={data} />;
    case 'skills':
      return <SkillsCard data={data} />;
    case 'opinions':
      return <OpinionsCard data={data} />;
    case 'work':
      return <WorkCard data={data} />;
    case 'ai':
      return <AiCard data={data} />;
    case 'link':
      return <LinkCard data={data} />;
    case 'dark':
      return <DarkCard data={data} />;
    case 'washi':
      return <WashiCard data={data} />;
    case 'sticky':
      return <StickyCard data={data} />;
    case 'narrative':
      return <NarrativeCard data={data} />;
    case 'quote':
    default:
      return <QuoteCard data={data} />;
  }
}

function QuoteCard({ data }) {
  return (
    <>
      <div className="tpl-quote-mark">"</div>
      <div className="tpl-quote-text">{data?.text}</div>
      {data?.source && <div className="tpl-quote-source">— {data.source}</div>}
    </>
  );
}

function DarkCard({ data }) {
  return (
    <>
      {data?.title && <div className="tpl-dark-title">{data.title}</div>}
      {data?.body && <div className="tpl-dark-body">{data.body}</div>}
    </>
  );
}

function WashiCard({ data }) {
  return (
    <>
      {data?.title && <div className="washi-title">{data.title}</div>}
      {data?.body && <div className="washi-body">{data.body}</div>}
    </>
  );
}

function StickyCard({ data }) {
  return <div className="tpl-sticky-text">{data?.text}</div>;
}

function NarrativeCard({ data }) {
  return (
    <>
      <div className="narrative-text">{data?.text}</div>
      {data?.author && <div className="narrative-author">— {data.author}</div>}
    </>
  );
}

function AiCard({ data }) {
  return (
    <>
      {data?.bubble && <div className="ai-bubble">{data.bubble}</div>}
      <div className="ai-name">{data?.name}</div>
      <div className="ai-desc">{data?.desc}</div>
    </>
  );
}

function LinkCard({ data }) {
  return (
    <>
      <div className="tpl-link-icon">{data?.icon || '🔗'}</div>
      <div className="tpl-link-title">{data?.title}</div>
      {data?.url && (
        <a
          className="tpl-link-go"
          href={data.url}
          target="_blank"
          rel="noreferrer"
          onPointerDown={(e) => e.stopPropagation()}
        >
          去看看 →
        </a>
      )}
    </>
  );
}

function ProfileCard({ data }) {
  return (
    <>
      <div className="card-profile-header">
        <div className="profile-avatar">{data?.avatar || '👩‍💻'}</div>
        <div className="profile-name">{data?.name}</div>
        {data?.sub && <div className="profile-sub">{data.sub}</div>}
        {data?.tag && <span className="profile-tag">{data.tag}</span>}
      </div>
      <div className="card-profile-body">
        {data?.slogan && <div className="profile-slogan">{data.slogan}</div>}
        {data?.belief && <div className="profile-belief">{data.belief}</div>}
        {data?.quote && <div className="profile-quote">{data.quote}</div>}
        {data?.links && data.links.length > 0 && (
          <div className="profile-links">
            {data.links.map((l, i) => (
              <a key={i} className="profile-link" href={l.href} target="_blank" rel="noreferrer" onPointerDown={(e) => e.stopPropagation()}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function TimelineCard({ data }) {
  return (
    <>
      <div className="card-title">
        <span className="card-title-icon">{data?.icon || '📍'}</span>
        {data?.title}
      </div>
      <div className="timeline">
        {(data?.items || []).map((it, i) => (
          <div className="tl-item" key={i}>
            <div className="tl-dot" />
            <div className="tl-year">{it.year}</div>
            <div className="tl-title">{it.title}</div>
            {it.desc && <div className="tl-desc">{it.desc}</div>}
          </div>
        ))}
      </div>
    </>
  );
}

function SkillsCard({ data }) {
  return (
    <>
      <div className="card-title">
        <span className="card-title-icon">{data?.icon || '🛠️'}</span>
        {data?.title}
      </div>
      <div className="skill-cloud">
        {(data?.tags || []).map((t, i) => (
          <span key={i} className={`skill-tag ${t.cls || ''}`}>
            {t.text}
          </span>
        ))}
      </div>
    </>
  );
}

function OpinionsCard({ data }) {
  return (
    <>
      <div className="card-title">
        <span className="card-title-icon">{data?.icon || '✍️'}</span>
        {data?.title}
      </div>
      {(data?.items || []).map((it, i) => (
        <div className="opinion-item" key={i}>
          <div className="opinion-title">{it.title}</div>
          {it.source && <div className="opinion-source">{it.source}</div>}
        </div>
      ))}
    </>
  );
}

function WorkCard({ data }) {
  return (
    <>
      <div className={`work-banner ${data?.bannerCls || ''}`}>
        <div className="work-banner-text">{data?.bannerText}</div>
      </div>
      <div className="work-body">
        <div className="work-name">{data?.name}</div>
        <div className="work-desc">{data?.desc}</div>
        <div>
          {(data?.tags || []).map((t, i) => (
            <span className="work-tag" key={i}>
              {t}
            </span>
          ))}
        </div>
        {data?.linkHref && (
          <a className="work-link" href={data.linkHref} target="_blank" rel="noreferrer" onPointerDown={(e) => e.stopPropagation()}>
            {data?.linkLabel || '了解更多'} →
          </a>
        )}
      </div>
    </>
  );
}
