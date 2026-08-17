// 预制种子卡：owner 固定为 esther（管理员），访客只读。
// 想改内容：改这里 → 重新部署即可（种子卡不写进数据存储）。

export const seedCards = [
  {
    id: 'seed-welcome',
    kind: 'seed',
    owner: 'esther',
    tpl: 'washi',
    data: {
      title: '👋 欢迎来到共享白板',
      body: '这里不是展示板，是游乐场：\n🪪 留一张你的名片（自我介绍卡）\n📸 贴一张拍立得，😆 扔个贴纸\n🗳️ 发起或参与一个投票\n🖌️ 点工具栏「涂鸦」，在白板任意角落乱画\n\n只能改/删自己创建的东西，别人的碰不得哦。',
    },
    x: 420,
    y: 140,
    w: 380,
    h: 260,
    createdAt: 0,
  },
  {
    id: 'seed-vote',
    kind: 'seed',
    owner: 'esther',
    tpl: 'vote',
    data: {
      question: '路过这里的你，今天心情如何？',
      options: [
        { text: '😆 开心', votes: [] },
        { text: '🙂 平静', votes: [] },
        { text: '🥱 想躺平', votes: [] },
        { text: '🤯 忙到飞起', votes: [] },
      ],
    },
    x: 960,
    y: 140,
    w: 300,
    h: 200,
    createdAt: 0,
  },
  {
    id: 'seed-polaroid',
    kind: 'seed',
    owner: 'esther',
    tpl: 'polaroid',
    data: {
      image: '/esther-sticker.png',
      caption: '第一张拍立得，我的贴纸分身 📸',
    },
    x: 960,
    y: 460,
    w: 230,
    h: 300,
    createdAt: 0,
  },
  {
    id: 'seed-about',
    kind: 'seed',
    owner: 'esther',
    tpl: 'profile',
    data: {
      avatar: '👩‍💻',
      name: 'ESTHER不二',
      sub: '在AI时代认真生活的女生',
      tag: '1 Person + AI = 1 Team',
      slogan: '慢慢来，比较快。',
      belief: '最会用AI的，是最知道自己想要什么的人。',
      quote: '"找到你喜欢的事，然后让它杀死你。" — Charles Bukowski',
      links: [
        { label: '📕 小红书 @ESTHER不二', href: 'https://www.xiaohongshu.com' },
        { label: '📮 联系我', href: 'mailto:esther.sjw@gmail.com' },
      ],
    },
    x: 1420,
    y: 140,
    w: 380,
    h: 320,
    createdAt: 0,
  },
];

// 留言卡可选颜色
export const messageColors = ['#ffd166', '#ff9f9f', '#a8d8ff', '#b8f0c8', '#e6c9ff', '#ffe8a3'];
