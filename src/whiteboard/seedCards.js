// 预制种子卡：owner 固定为 esther（管理员），访客只读。
// 想改内容：改这里 → 重新部署即可（种子卡不写进数据存储）。

export const seedCards = [
  {
    id: 'seed-welcome',
    kind: 'seed',
    owner: 'esther',
    name: '👋 欢迎',
    text: '这里是 Esther 不二 的共享白板。\n我预置了一些东西在这里，你可以随便逛、随便拖、随便缩放。\n最重要的是——点右上角的 ✍️ 留言，把你的话贴到白板上。\n只能改自己贴的卡，别人的卡碰不得哦。',
    color: '#fff8e1',
    x: 420,
    y: 140,
    w: 340,
    h: 210,
    createdAt: 0,
  },
  {
    id: 'seed-howto',
    kind: 'seed',
    owner: 'esther',
    name: '🎮 怎么玩',
    text: '滚动 = 缩放\n拖空白处 = 移动画布\n拖卡片 = 挪位置\n双击自己的卡 = 编辑\n✍️ 留言 = 贴一张你的卡',
    color: '#ffffff',
    x: 980,
    y: 140,
    w: 300,
    h: 210,
    createdAt: 0,
  },
  {
    id: 'seed-rule',
    kind: 'seed',
    owner: 'esther',
    name: '📏 留言公约',
    text: '1. 友善一点，这里是公共空间\n2. 只能编辑/删除自己创建的留言\n3. 不要删别人的东西\n4. 别留隐私信息（电话/地址等）\n5. 玩得开心 ✨',
    color: '#1a2332',
    x: 980,
    y: 520,
    w: 300,
    h: 230,
    createdAt: 0,
  },
  {
    id: 'seed-egg',
    kind: 'seed',
    owner: 'esther',
    name: '✨ 彩蛋区',
    text: '双击这段文字，把它改成你想看到的话。\n（只能你自己看到改动哦，云端版上线后我会开放更多玩法）',
    color: '#ffe8a3',
    x: 420,
    y: 560,
    w: 290,
    h: 150,
    createdAt: 0,
  },
];

// 留言卡可选颜色
export const messageColors = ['#ffd166', '#ff9f9f', '#a8d8ff', '#b8f0c8', '#e6c9ff', '#ffe8a3'];
