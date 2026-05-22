import { useState } from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle, Copy, Check, Sparkles } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Textarea } from '../components/common/Input';
import { aiService } from '../services/aiService';
import type { EmotionResult } from '../types';
import { detectRiskWords, calculateRiskLevel, calculateScore } from '../utils/riskWords';

const riskTypeLabels: Record<string, { label: string; color: string }> = {
  shift: { label: '甩锅词', color: 'bg-orange-100 text-orange-600' },
  confront: { label: '对抗词', color: 'bg-yellow-100 text-yellow-600' },
  emotional: { label: '情绪化词', color: 'bg-purple-100 text-purple-600' },
  attack: { label: '攻击性词', color: 'bg-red-100 text-red-600' },
};

export function Detect() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    try {
      // 1. 先调用AI获取改写建议
      const aiResult = await aiService.analyzeEmotion(inputText);
      
      // 2. 本地检测风险词（更稳定）
      const riskWords = detectRiskWords(inputText);
      const level = calculateRiskLevel(riskWords);
      const score = calculateScore(riskWords);
      
      // 3. 合并结果，用本地检测覆盖AI的level和score
      setResult({
        level: level,
        score: score,
        riskWords: riskWords.map(rw => ({
          word: rw.word,
          type: rw.type,
          position: [0, 0] // 暂时不需要位置信息
        })),
        suggestions: aiResult.suggestions || generateSuggestions(level, riskWords),
        rewrites: aiResult.rewrites
      });
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      // 如果出错，只用本地检测
      const riskWords = detectRiskWords(inputText);
      const level = calculateRiskLevel(riskWords);
      const score = calculateScore(riskWords);
      
      setResult({
        level: level,
        score: score,
        riskWords: riskWords.map(rw => ({
          word: rw.word,
          type: rw.type,
          position: [0, 0]
        })),
        suggestions: generateSuggestions(level, riskWords),
        rewrites: {
          gentle: inputText,
          professional: inputText,
          firm: inputText,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  function generateSuggestions(level: string, riskWords: any[]) {
    const suggestions = [];
    
    if (level === 'red') {
      suggestions.push('文本中包含攻击性语言，请避免在职场中使用');
      suggestions.push('建议调整语气，保持专业沟通');
    } else if (level === 'yellow') {
      suggestions.push('文本中存在情绪化表达，建议调整');
      suggestions.push('可以使用更客观、专业的表达方式');
    } else {
      suggestions.push('文本表达专业得体');
      suggestions.push('继续保持良好的沟通方式');
    }
    
    return suggestions;
  }

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getLevelIcon = () => {
    if (!result) return null;
    
    const icons = {
      red: <AlertTriangle className="w-6 h-6 text-red-500" />,
      yellow: <AlertCircle className="w-6 h-6 text-yellow-500" />,
      green: <CheckCircle2 className="w-6 h-6 text-green-500" />,
    };
    
    return icons[result.level];
  };

  const getLevelText = () => {
    if (!result) return '';
    
    const texts = {
      red: '高风险',
      yellow: '中等风险',
      green: '安全',
    };
    
    return texts[result.level];
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">情绪红绿灯检测</h1>
        <p className="text-black/50">分析表达风险，避免职场沟通踩雷</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <Textarea
              label="输入要检测的文本"
              placeholder="粘贴聊天记录或会议发言..."
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button
              onClick={handleAnalyze}
              disabled={!inputText.trim() || loading}
              className="w-full mt-4"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  检测中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  开始检测
                </span>
              )}
            </Button>
          </Card>

          {result && (
            <Card>
              <h3 className="font-semibold text-black mb-4">原文分析</h3>
              <div className="p-4 bg-gray-50 rounded-xl min-h-[100px]">
                <p className="text-black/70 whitespace-pre-wrap">{inputText}</p>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {result.riskWords.length > 0 ? (
                  result.riskWords.map((riskWord, index) => {
                    const riskInfo = riskTypeLabels[riskWord.type] || { label: '风险词', color: 'bg-gray-100 text-gray-600' };
                    return (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${riskInfo.color}`}
                      >
                        {riskInfo.label}: {riskWord.word}
                      </span>
                    );
                  })
                ) : (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
                    未检测到风险词
                  </span>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {result && (
            <>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-black">风险评估</h3>
                  <div className="flex items-center gap-2">
                    {getLevelIcon()}
                    <span className={`font-bold text-lg ${
                      result.level === 'red' ? 'text-red-500' : 
                      result.level === 'yellow' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {getLevelText()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="text-4xl font-bold text-black">{result.score}</div>
                    <div className="text-sm text-black/40">安全分数</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-1">
                      <div className={`w-3 h-3 rounded-full ${result.level === 'red' ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
                      <div className={`w-3 h-3 rounded-full ${result.level === 'yellow' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'}`} />
                      <div className={`w-3 h-3 rounded-full ${result.level === 'green' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                    </div>
                    <div className="text-xs text-black/40 mt-1">红绿灯状态</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm font-medium text-black/60 mb-2">优化建议</div>
                  <div className="space-y-2">
                    {result.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-black/60">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold text-black mb-4">改写建议</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-black/70">温和专业版</span>
                      <button
                        onClick={() => handleCopy(result.rewrites.gentle, 'gentle')}
                        className="flex items-center gap-1 text-xs text-black/50 hover:text-black"
                      >
                        {copiedType === 'gentle' ? (
                          <>
                            <Check className="w-3 h-3" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            复制
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-black/70">{result.rewrites.gentle}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-black/70">专业正式版</span>
                      <button
                        onClick={() => handleCopy(result.rewrites.professional, 'professional')}
                        className="flex items-center gap-1 text-xs text-black/50 hover:text-black"
                      >
                        {copiedType === 'professional' ? (
                          <>
                            <Check className="w-3 h-3" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            复制
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-black/70">{result.rewrites.professional}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-black/70">坚定得体版</span>
                      <button
                        onClick={() => handleCopy(result.rewrites.firm, 'firm')}
                        className="flex items-center gap-1 text-xs text-black/50 hover:text-black"
                      >
                        {copiedType === 'firm' ? (
                          <>
                            <Check className="w-3 h-3" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            复制
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-black/70">{result.rewrites.firm}</p>
                  </div>
                </div>
              </Card>
            </>
          )}

          {!result && (
            <Card className="h-full flex items-center justify-center min-h-[500px]">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-black/40" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">输入文本开始检测</h3>
                <p className="text-black/40">粘贴聊天记录或会议发言，AI会自动分析情绪风险</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
