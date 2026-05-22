export const riskWords: Array<{
  word: string;
  type: 'shift' | 'confront' | 'emotional' | 'attack';
  description: string;
}> = [
  { word: '这不归我', type: 'shift', description: '推卸责任' },
  { word: '我不知道', type: 'shift', description: '缺乏担当' },
  { word: '你自己弄', type: 'shift', description: '拒绝协作' },
  { word: '不是我的事', type: 'shift', description: '推卸责任' },
  { word: '不归我管', type: 'shift', description: '推卸责任' },
  { word: '跟我没关系', type: 'shift', description: '推卸责任' },
  { word: '不关我的事', type: 'shift', description: '推卸责任' },
  
  { word: '但是', type: 'confront', description: '直接否定' },
  { word: '明明', type: 'confront', description: '质疑对方' },
  { word: '你总是', type: 'confront', description: '指责对方' },
  { word: '每次都', type: 'confront', description: '指责对方' },
  { word: '可是', type: 'confront', description: '直接否定' },
  { word: '居然', type: 'confront', description: '质疑对方' },
  { word: '凭什么', type: 'confront', description: '质问对方' },
  { word: '为什么', type: 'confront', description: '质问对方' },
  
  { word: '无语', type: 'emotional', description: '表达不满' },
  { word: '服了', type: 'emotional', description: '表达不满' },
  { word: '随便吧', type: 'emotional', description: '消极态度' },
  { word: '呵呵', type: 'emotional', description: '阴阳怪气' },
  { word: '算了', type: 'emotional', description: '消极态度' },
  { word: '烦死了', type: 'emotional', description: '情绪化表达' },
  { word: '真服了', type: 'emotional', description: '表达不满' },
  { word: '搞什么', type: 'emotional', description: '表达不满' },
  
  { word: '你懂什么', type: 'attack', description: '人身攻击' },
  { word: '你行你上', type: 'attack', description: '挑衅' },
  { word: '别跟我讲', type: 'attack', description: '拒绝沟通' },
  { word: '你怎么回事', type: 'attack', description: '指责对方' },
  { word: '你能不能', type: 'attack', description: '指责对方' },
  { word: '会不会做', type: 'attack', description: '质疑能力' },
];

export const riskWordGroups = {
  shift: ['这不归我', '我不知道', '你自己弄', '不是我的事', '不归我管', '跟我没关系', '不关我的事'],
  confront: ['但是', '明明', '你总是', '每次都', '可是', '居然', '凭什么', '为什么'],
  emotional: ['无语', '服了', '随便吧', '呵呵', '算了', '烦死了', '真服了', '搞什么'],
  attack: ['你懂什么', '你行你上', '别跟我讲', '你怎么回事', '你能不能', '会不会做'],
};
