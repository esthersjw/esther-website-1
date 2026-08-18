// 预制种子卡：owner 固定为 esther（管理员），访客只读。
// 布局与文案已由 Esther 亲手排版（2026-08-18），如需调整：
// 管理员拖拽/双击后，把 localStorage['wb.seedOverrides.v1'] 发回来重新固化。

export const seedCards = [
  {
    id: 'seed-vote-who',
    kind: 'seed',
    owner: 'esther',
    tpl: 'vote',
    data: {
      question: '🕵️ 你是谁派来的？',
      options: [
        { text: '📕 小红书观光团', votes: [] },
        { text: '🫂 朋友按头安利', votes: [] },
        { text: '🌀 互联网迷路误入', votes: [] },
        { text: '🤖 我是 AI，来视察的', votes: [] },
      ],
    },
    x: 631,
    y: 140,
    w: 300,
    h: 320,
    createdAt: 0,
  },
  {
    id: 'seed-welcome',
    kind: 'seed',
    owner: 'esther',
    tpl: 'washi',
    data: {
      title: '👋 欢迎来到共享白板',
      body: '这里不是展示板，是游乐场：\n🪪 留一张你的名片（自我介绍卡）\n📸 贴一张拍立得，😆 扔个贴纸\n🗳️ 发起或参与一个投票\n🖌️ 点工具栏「涂鸦」，在白板任意角落乱画\n\n只能改/删自己创建的东西，别人的碰不得哦。',
    },
    x: 951,
    y: 325,
    w: 380,
    h: 280,
    createdAt: 0,
  },
  {
    id: 'seed-about',
    kind: 'seed',
    owner: 'esther',
    tpl: 'profile',
    data: {
      avatarImg: '/wb-avatar.jpg',
      name: 'ESTHER不二',
      sub: '在AI时代认真生活的女生',
      slogan: '欢迎来不二的小站',
      belief: '来我的QQ空间踩一踩吧。',
      links: [{ label: '📮 联系我', qr: '/wb-wechat-qr.jpg' }],
    },
    x: 303,
    y: 478,
    w: 380,
    h: 360,
    createdAt: 0,
  },

  // ---------- 拍立得照片墙 ----------
  {
    id: 'seed-polaroid-buer',
    kind: 'seed',
    owner: 'esther',
    tpl: 'polaroid',
    data: { image: '/wb-photo-buer.jpg', caption: 'Hello！我是不二！' },
    x: 701,
    y: 479,
    w: 230,
    h: 340,
    createdAt: 0,
  },
  {
    id: 'seed-polaroid-portrait',
    kind: 'seed',
    owner: 'esther',
    tpl: 'polaroid',
    data: { image: '/wb-photo-portrait.jpg', caption: '平时一本正经长这样～' },
    x: 943,
    y: 629,
    w: 230,
    h: 380,
    createdAt: 0,
  },
  {
    id: 'seed-polaroid-birthday',
    kind: 'seed',
    owner: 'esther',
    tpl: 'polaroid',
    data: { image: '/wb-photo-birthday.jpg', caption: '来自@粥粥 的不二29岁拼贴版～' },
    x: 699,
    y: 840,
    w: 230,
    h: 430,
    createdAt: 0,
  },

  // ---------- 手绘卡 ----------
  {
    id: 'seed-sticky-intj',
    kind: 'seed',
    owner: 'esther',
    tpl: 'sticky',
    data: { text: 'INTJ 🧠\n安静地建造帝国' },
    x: 1183,
    y: 633,
    w: 220,
    h: 170,
    createdAt: 0,
  },
  {
    id: 'seed-darkquote',
    kind: 'seed',
    owner: 'esther',
    tpl: 'darkquote',
    data: { text: '"找到你喜欢的事，然后让它杀死你。"', author: 'Charles Bukowski' },
    x: 337,
    y: 925,
    w: 340,
    h: 190,
    createdAt: 0,
  },
];

// 留言卡可选颜色
export const messageColors = ['#ffd166', '#ff9f9f', '#a8d8ff', '#b8f0c8', '#e6c9ff', '#ffe8a3'];
