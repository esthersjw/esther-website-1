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
      body: '这里是 Esther 不二 的共享白板。\n我预置了一些东西在这里，你可以随便逛、随便拖、随便缩放。\n点右上角的 ✍️ 留言，把你的话贴到白板上——\n只能改自己贴的卡，别人的卡碰不得哦。',
    },
    x: 420,
    y: 140,
    w: 360,
    h: 210,
    createdAt: 0,
  },
  {
    id: 'seed-howto',
    kind: 'seed',
    owner: 'esther',
    tpl: 'quote',
    data: {
      text: '滚动 = 缩放\n拖空白处 = 移动画布\n拖卡片 = 挪位置\n双击自己的卡 = 编辑\n✍️ 留言 = 贴一张你的卡',
      source: '玩法说明',
    },
    x: 1000,
    y: 140,
    w: 330,
    h: 210,
    createdAt: 0,
  },
  {
    id: 'seed-rule',
    kind: 'seed',
    owner: 'esther',
    tpl: 'dark',
    data: {
      title: '📏 留言公约',
      body: '1. 友善一点，这里是公共空间\n2. 只能编辑/删除自己创建的留言\n3. 不要删别人的东西\n4. 别留隐私信息（电话/地址等）\n5. 玩得开心 ✨',
    },
    x: 1000,
    y: 560,
    w: 330,
    h: 240,
    createdAt: 0,
  },
  {
    id: 'seed-egg',
    kind: 'seed',
    owner: 'esther',
    tpl: 'sticky',
    data: {
      text: '✨ 彩蛋区\n双击这段文字，把它改成你想看到的话。\n或者留言告诉我：你希望白板上出现什么好玩的东西？',
    },
    x: 420,
    y: 600,
    w: 260,
    h: 190,
    createdAt: 0,
  },
  {
    id: 'seed-story',
    kind: 'seed',
    owner: 'esther',
    tpl: 'narrative',
    data: {
      text: '为什么会有这块白板？\n因为我一直觉得，互联网不只是单向的展示——\n它也可以是一块大家都能来涂两笔的画布。',
      author: 'Esther',
    },
    x: 1580,
    y: 140,
    w: 380,
    h: 230,
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
    x: 1580,
    y: 520,
    w: 380,
    h: 320,
    createdAt: 0,
  },
];

// 留言卡可选颜色
export const messageColors = ['#ffd166', '#ff9f9f', '#a8d8ff', '#b8f0c8', '#e6c9ff', '#ffe8a3'];
