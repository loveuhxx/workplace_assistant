// 风险词库
export interface RiskWord {
  word: string;
  type: 'shift' | 'confront' | 'emotional' | 'attack';
  label: string;
}

export const riskWordList: RiskWord[] = [
  // 攻击性词（red level）
  { word: '脑残', type: 'attack', label: '攻击性词' },
  { word: '傻逼', type: 'attack', label: '攻击性词' },
  { word: '白痴', type: 'attack', label: '攻击性词' },
  { word: '智障', type: 'attack', label: '攻击性词' },
  { word: '滚蛋', type: 'attack', label: '攻击性词' },
  { word: '去死', type: 'attack', label: '攻击性词' },
  { word: '他妈', type: 'attack', label: '攻击性词' },
  { word: '操你', type: 'attack', label: '攻击性词' },
  { word: '混蛋', type: 'attack', label: '攻击性词' },
  { word: '贱人', type: 'attack', label: '攻击性词' },
  
  // 甩锅词
  { word: '不是我', type: 'shift', label: '甩锅词' },
  { word: '不归我', type: 'shift', label: '甩锅词' },
  { word: '我不管', type: 'shift', label: '甩锅词' },
  { word: '不知道', type: 'shift', label: '甩锅词' },
  { word: '自己弄', type: 'shift', label: '甩锅词' },
  { word: '找别人', type: 'shift', label: '甩锅词' },
  { word: '和我没关系', type: 'shift', label: '甩锅词' },
  
  // 对抗词
  { word: '凭什么', type: 'confront', label: '对抗词' },
  { word: '你总是', type: 'confront', label: '对抗词' },
  { word: '每次都', type: 'confront', label: '对抗词' },
  { word: '能不能行', type: 'confront', label: '对抗词' },
  { word: '会不会', type: 'confront', label: '对抗词' },
  { word: '行不行', type: 'confront', label: '对抗词' },
  { word: '是不是', type: 'confront', label: '对抗词' },
  
  // 情绪化词
  { word: '真无语', type: 'emotional', label: '情绪化词' },
  { word: '服了', type: 'emotional', label: '情绪化词' },
  { word: '随便吧', type: 'emotional', label: '情绪化词' },
  { word: '真的烦', type: 'emotional', label: '情绪化词' },
  { word: '好烦', type: 'emotional', label: '情绪化词' },
  { word: '烦死了', type: 'emotional', label: '情绪化词' },
  { word: '真离谱', type: 'emotional', label: '情绪化词' },
  { word: '太离谱', type: 'emotional', label: '情绪化词' },
  { word: '什么鬼', type: 'emotional', label: '情绪化词' },
  { word: '我去', type: 'emotional', label: '情绪化词' },
  { word: '我靠', type: 'emotional', label: '情绪化词' },
  { word: '我晕', type: 'emotional', label: '情绪化词' },
];

// 检测文本中的风险词
export function detectRiskWords(text: string): RiskWord[] {
  const results: RiskWord[] = [];
  
  for (const riskWord of riskWordList) {
    if (text.includes(riskWord.word)) {
      results.push(riskWord);
    }
  }
  
  // 去重
  const uniqueResults = results.filter((item, index, self) =>
    index === self.findIndex((t) => t.word === item.word)
  );
  
  return uniqueResults;
}

// 判断风险等级
export function calculateRiskLevel(riskWords: RiskWord[]): 'red' | 'yellow' | 'green' {
  const hasAttack = riskWords.some(r => r.type === 'attack');
  const hasOther = riskWords.some(r => r.type !== 'attack');
  
  if (hasAttack) {
    return 'red';
  } else if (hasOther) {
    return 'yellow';
  }
  return 'green';
}

// 计算安全分数
export function calculateScore(riskWords: RiskWord[]): number {
  const level = calculateRiskLevel(riskWords);
  
  if (level === 'red') {
    return 20;
  } else if (level === 'yellow') {
    return 60;
  }
  return 95;
}
