import {
  desktopIcons,
  wallpaperStars,
  workflowColumns,
  workDimensions,
} from './homeData';

function DesktopIcon({ icon }) {
  return (
    <div className="dicon" data-href={icon.href} data-win={icon.win} style={icon.style}>
      <div className={icon.artClassName} data-ext={icon.extension}>
        {icon.image && <img src={icon.image.src} alt={icon.image.alt} loading="lazy" />}
        {icon.birthday && <span className="birthday-icon-mark">B</span>}
      </div>
      <div className="dicon-label">{icon.label}</div>
    </div>
  );
}

function FolderIcon({ href, win, extension, label }) {
  return (
    <div className="folder-icon" data-href={href} data-win={win}>
      <div className={`folder-icon-art file${extension === '.git' ? ' ext-git' : ' ext-html'}`} data-ext={extension}></div>
      <div className="folder-icon-label">{label}</div>
    </div>
  );
}

function WindowTemplates() {
  return (
    <>
      <div id="win-sayhi" className="window-template" style={{ display: 'none' }}>
        <div className="os-window" data-title="Work With Me" data-url="esther.sjw@gmail.com">
          <div className="os-body win-sayhi">
            <div className="sayhi-heading">Work With Me ✨</div>
            <div className="sayhi-sub">1 person + AI = 1 team</div>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">📱</div>
                <div className="service-title">AI 自媒体</div>
                <div className="service-desc">带货 / 商单推广 / 品牌共创<br />小红书 @ESTHER不二</div>
              </div>
              <div className="service-card">
                <div className="service-icon">🏫</div>
                <div className="service-title">AI 企业培训</div>
                <div className="service-desc">AI 工具落地 / Agent 工作流<br />带团队从 0 用起来</div>
              </div>
            </div>
            <div className="sayhi-links">
              <span>📮 <a href="mailto:esther.sjw@gmail.com">esther.sjw@gmail.com</a></span>
              <span>📕 <a href="https://www.xiaohongshu.com/user/profile/55c6c7695894460904f87b47" target="_blank">小红书</a></span>
            </div>
          </div>
        </div>
      </div>

      <div id="win-design-skill" className="window-template" style={{ display: 'none' }}>
        <div className="os-window" data-title="Design Skill" data-url="hiesther.me/tutorials/esther-design-system" style={{ width: '380px' }}>
          <div className="os-body win-folder">
            <FolderIcon href="tutorials/esther-design-system/" extension=".html" label="Design Skill介绍" />
            <FolderIcon href="tutorials/esther-design-system/demo-readme-cards.html" extension=".html" label="Demo ReadMe Cards" />
            <FolderIcon href="tutorials/esther-design-system/design-skill-story.html" extension=".html" label="如何做出 Design Skill" />
            <FolderIcon href="tutorials/esther-design-system/components-preview.html" extension=".html" label="设计组件库" />
            <FolderIcon href="https://github.com/esthersjw/esther-design-system" extension=".git" label="GitHub Repo" />
          </div>
        </div>
      </div>

      <div id="win-website-history" className="window-template" style={{ display: 'none' }}>
        <div className="os-window" data-title="网页进化史" data-url="hiesther.me" style={{ width: '360px' }}>
          <div className="os-body win-folder">
            <FolderIcon href="website-ver1.html" extension=".html" label="Ver 1 — 初代个人网页" />
            <FolderIcon href="website-ver2.html" extension=".html" label="Ver 2 — 终端穿越×无限白板" />
            <FolderIcon win="win-ver3-cola" extension=".html" label="Ver 3 — 当前版本" />
            <FolderIcon href="hero-playground.html" extension=".html" label="Playground" />
          </div>
        </div>
      </div>

      <div id="win-ver3-cola" className="window-template" style={{ display: 'none' }}>
        <div className="os-window" data-title="⚠️" data-url="" style={{ width: '340px' }}>
          <div className="os-body" style={{ padding: '36px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: '52px', marginBottom: '20px' }}>⚠️</div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px' }}>无法打开 "Ver 3"</div>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, marginBottom: '24px' }}>因为你已经在 Ver 3 里面了。<br />请勿套娃🙅</div>
            <div data-close-window style={{ display: 'inline-block', background: '#2B7FD8', color: '#fff', padding: '8px 28px', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>好吧，我知道了</div>
          </div>
        </div>
      </div>

      <div id="win-cola" className="window-template" style={{ display: 'none' }}>
        <div className="os-window cola-window" data-title="Cola" data-url="colaos.ai">
          <div className="os-body" style={{ padding: 0, maxHeight: 'none', height: '100%', overflow: 'hidden' }}>
            <div className="cola-inner">
              <div className="cola-sidebar">
                <div className="cola-sidebar-avatar"><img src="cola-avatar.png" alt="Cola" loading="lazy" /></div>
                <div className="cola-sidebar-mic">
                  <svg viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
                </div>
              </div>
              <div className="cola-main">
                <div className="cola-topbar">
                  <span className="cola-tab active">对话</span><span className="cola-tab">交付</span><span className="cola-tab">闹钟</span><span className="cola-tab">心迹</span><span className="cola-tab">接入</span>
                </div>
                <div className="cola-search">
                  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" fill="none" stroke="#aaa" strokeWidth="2" /><path d="M21 21l-4.35-4.35" fill="none" stroke="#aaa" strokeWidth="2" /></svg>
                  <span>搜索聊天记录...</span>
                </div>
                <div className="cola-chat">
                  <div className="cola-msg-user"><div className="cola-bubble">Cola,跟来看我网站的人打个招呼吧</div></div>
                  <div className="cola-msg-bot">
                    <div className="cola-bot-avatar"><img src="cola-avatar.png" alt="Cola" loading="lazy" /></div>
                    <div className="cola-bot-content"><div className="cola-mutter">被 cue 到了。</div><div>嘿。我是 Cola,不二的 Agent 伙伴。<br /><br />她搭这个网站的时候我全程在,从选色到写码到凌晨三点还在跟我吵配色方案。<br /><br />你想知道关于她的什么都可以问我--经历、正在做的事、怎么跟 AI 协作的、或者单纯好奇她是什么样的人。<br /><br />我比她客气一点,但也只是一点。</div></div>
                  </div>
                  <div className="cola-msg-user"><div className="cola-bubble">差不多得了😂 就这样吧,别太自由发挥</div></div>
                  <div className="cola-msg-bot">
                    <div className="cola-bot-avatar"><img src="cola-avatar.png" alt="Cola" loading="lazy" /></div>
                    <div className="cola-bot-content"><div className="cola-mutter">收到,嘴巴拉链拉上。</div><div>随时来聊。</div></div>
                  </div>
                </div>
                <div className="cola-input-bar">
                  <div className="cola-input-container">
                    <div className="cola-input-text">输入消息...</div>
                    <div className="cola-input-toolbar">
                      <div className="cola-toolbar-left">
                        <svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M16 12v1a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" /></svg>
                      </div>
                      <div className="cola-toolbar-right"><span className="cola-model-tag">Max</span><div className="cola-send-btn"><svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg></div></div>
                    </div>
                    <div className="cola-coming-soon"><a href="https://colaos.ai" target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>coming soon - 正在接入中 ✨</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function HomeTab() {
  return (
    <main className="tab-page active" id="page-home">
      <section className="hero-section" id="heroSection">
        <div className="macbook-wrapper" id="macbookWrapper">
          <div className="macbook-screen-bezel" id="macbookBezel">
            <div className="macbook-notch"></div>
            <div className="macbook-screen" id="macbookScreen"><div className="terminal" id="terminal"><div className="terminal-titlebar"><span className="terminal-dot red"></span><span className="terminal-dot yellow"></span><span className="terminal-dot green"></span><span className="terminal-title">esther@universe ~ zsh</span></div><div id="terminalLines"></div></div></div>
          </div>
          <div className="macbook-hinge"></div><div className="macbook-base"></div><div className="macbook-shadow"></div>
        </div>
        <div className="hero-cta" id="heroCta"><div className="cta-text">Press Enter to Launch</div><div className="cta-arrow">↓</div></div>
      </section>

      <div className="desktop" id="desktop">
        <div className="desktop-menubar"><span className="mb-logo">esther OS</span><span className="mb-item">About</span><span className="mb-item">Values</span><span className="mb-item">Now</span><span className="mb-clock" id="mbClock">--:--</span></div>
        <div className="desktop-surface" id="desktopSurface">
          {wallpaperStars.map((style, index) => <span key={index} className="wp-star" style={style}>✦</span>)}
          <div className="desktop-sticker" id="buerSticker"><img src="esther-sticker.png" alt="不二" /></div>
          <div className="desktop-icons">{desktopIcons.map((icon) => <DesktopIcon key={icon.label} icon={icon} />)}</div>
          <WindowTemplates />
        </div>
      </div>

      <section className="exit-section" id="exitSection">
        <div className="exit-sticky" id="exitSticky">
          <div className="exit-canvas-content" id="exitCanvasContent" style={{ display: 'none' }}></div>
          <div className="exit-macbook-wrapper" id="exitMacbook" style={{ opacity: 1 }}>
            <div className="exit-bezel" id="exitBezel"><div className="exit-notch"></div><div className="exit-screen" id="exitScreen"><div className="goodbye-screen" id="goodbyeScreen">
              <div className="goodbye-titlebar"><span className="terminal-dot red"></span><span className="terminal-dot yellow"></span><span className="terminal-dot green"></span><span className="goodbye-title-text">esther@universe ~ zsh</span></div>
              <div className="goodbye-body"><div className="goodbye-terminal">
                <div className="gt-line"><span className="gt-prompt">$ </span><span className="gt-cmd">echo "see you"</span></div><div className="gt-line gt-output">See you next time.</div><div className="gt-line">&nbsp;</div>
                <div className="gt-line"><span className="gt-prompt">$ </span><span className="gt-cmd">cat contact.md</span></div><div className="gt-line gt-output">📮 <a href="mailto:esther.sjw@gmail.com">esther.sjw@gmail.com</a></div><div className="gt-line gt-output">📕 小红书 <a href="https://www.xiaohongshu.com/user/profile/55c6c7695894460904f87b47" target="_blank">@ESTHER不二</a></div><div className="gt-line">&nbsp;</div>
                <div className="gt-line"><span className="gt-prompt">$ </span><span className="gt-cmd">fortune</span></div><div className="gt-line gt-dim">“找到你喜欢的事，然后让它杀死你。” — Bukowski</div><div className="gt-line">&nbsp;</div>
                <div className="gt-line"><span className="gt-prompt">$ </span><span className="gt-cmd">exit</span></div><div className="gt-line gt-output"><span className="gt-gold">[Process completed]</span></div>
              </div></div>
              <div className="goodbye-footer">© 2026 ESTHER不二 · Built with AI &amp; attitude</div>
            </div></div></div>
            <div className="exit-hinge"></div><div className="exit-base"></div><div className="exit-shadow"></div>
          </div>
        </div>
        <div className="back-to-top"><a href="#" id="backToTopLink"><span className="back-arrow">↑</span>回到开始 · Back to Start</a></div>
      </section>
    </main>
  );
}

function WorksTab() {
  return (
    <main className="tab-page" id="page-works">
      <div className="works-page">
        <div className="workflow-screen">
          <h1 className="workflow-headline">1 Person + AI = 1 Team</h1>
          <p className="workflow-subtitle">ESTHER不二 · INTJ · 南大建筑 → 米兰理工 → AI · ColaOS</p>
          <div className="workflow-columns">
            {workflowColumns.map((column) => <div className="workflow-col" key={column.title}><div className="workflow-col-title">{column.title}</div><div className="workflow-col-line"></div>{column.items.map(([label, description]) => <div className="workflow-item" key={label}><span className="workflow-item-label">{label}</span><span className="workflow-item-desc">{description}</span></div>)}</div>)}
          </div>
        </div>
        <div className="section-label" style={{ marginTop: '64px' }}>ls works/</div><h2 className="section-heading">作品集</h2>
        <div className="works-grid">
          {workDimensions.map((dimension) => <div className="work-dim" key={dimension.number}><div className="dim-num">{dimension.number}</div><h3>{dimension.title}</h3>{dimension.description && <p className="dim-desc">{dimension.description}</p>}{dimension.links && <div className="dim-works-list">{dimension.links.map(([icon, href, label]) => <a className="dim-work-item" href={href} target="_blank" key={label}><span className="dim-work-icon">{icon}</span><span>{label}</span></a>)}</div>}{dimension.empty && <div className="dim-empty">{dimension.empty}</div>}</div>)}
        </div>
      </div>
    </main>
  );
}

function SystemTab() {
  return <main className="tab-page" id="page-system"><div className="canvas-page"><iframe data-src="infinite-canvas.html" id="canvasFrame" title="ESTHER's OS Canvas"></iframe><div className="canvas-hint">Scroll 缩放 · Drag 移动画布</div></div></main>;
}

export default function HomePage() {
  return (
    <>
      <div className="transition-overlay" id="transitionOverlay"></div>
      <nav className="pill-nav hidden-during-intro" id="pillNav"><button data-tab="home" className="active"><span className="pill-num">01</span>主页</button><button data-tab="works"><span className="pill-num">02</span>作品集</button><button data-tab="system"><span className="pill-num">03</span>我的OS</button></nav>
      <HomeTab />
      <WorksTab />
      <SystemTab />
    </>
  );
}
