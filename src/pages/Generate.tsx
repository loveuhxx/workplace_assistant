import { useState } from 'react';
import { TrendingUp, Gift, Briefcase, Clock, XCircle, AlertCircle, Presentation, BarChart3, AlertTriangle, MessageSquare, Users, Heart, DoorOpen, FileText, Headphones, Tag, Sparkles, Copy, Check, Lightbulb } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Textarea } from '../components/common/Input';
import { aiService, sceneService } from '../services/aiService';
import type { ScriptResult } from '../types';

const iconMap: Record<string, typeof TrendingUp> = {
  TrendingUp, Gift, Briefcase, Clock, XCircle, AlertCircle, Presentation, BarChart3, AlertTriangle, MessageSquare, Users, Heart, DoorOpen, FileText, Headphones, Tag
};

export function Generate() {
  const [categories] = useState(sceneService.getCategories());
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [situation, setSituation] = useState('');
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const scenes = sceneService.getScenesByCategory(selectedCategory);
  
  const handleGenerate = async () => {
    if (!selectedScene) return;
    
    setLoading(true);
    const scriptResult = await aiService.generateScripts(selectedScene, {
      identity: '对方',
      stance: '专业',
      situation,
    });
    setResult(scriptResult);
    setLoading(false);
  };

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">话术生成器</h1>
        <p className="text-black/50">选择场景，一键生成高情商职场话术</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-black/60 mb-3">选择场景类别</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedScene(null);
                    setResult(null);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-black/60 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-black/60 mb-3">选择具体场景</h3>
            <div className="space-y-2">
              {scenes.map(scene => {
                const Icon = iconMap[scene.icon] || MessageSquare;
                return (
                  <button
                    key={scene.id}
                    onClick={() => {
                      setSelectedScene(scene.id);
                      setResult(null);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                      selectedScene === scene.id
                        ? 'bg-black/5 border-2 border-black'
                        : 'bg-white border-2 border-black/5 hover:border-black/10'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="font-medium text-black">{scene.name}</div>
                      <div className="text-xs text-black/40">{scene.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Textarea
              label="补充情况（可选）"
              placeholder="例如：手头已有3个紧急任务，家里有事..."
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!selectedScene || loading}
            className="w-full"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                生成中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                一键生成话术
              </span>
            )}
          </Button>
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold">1</span>
                    </div>
                    <span className="font-semibold text-black">温和稳妥版</span>
                  </div>
                  <p className="text-black/60 mb-4">{result.gentle}</p>
                  <button
                    onClick={() => handleCopy(result.gentle, 'gentle')}
                    className="flex items-center gap-2 text-sm text-black/60 hover:text-black"
                  >
                    {copiedType === 'gentle' ? (
                      <>
                        <Check className="w-4 h-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制话术
                      </>
                    )}
                  </button>
                </Card>

                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold">2</span>
                    </div>
                    <span className="font-semibold text-black">立场清晰版</span>
                  </div>
                  <p className="text-black/60 mb-4">{result.firm}</p>
                  <button
                    onClick={() => handleCopy(result.firm, 'firm')}
                    className="flex items-center gap-2 text-sm text-black/60 hover:text-black"
                  >
                    {copiedType === 'firm' ? (
                      <>
                        <Check className="w-4 h-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制话术
                      </>
                    )}
                  </button>
                </Card>

                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold">3</span>
                    </div>
                    <span className="font-semibold text-black">高情商版</span>
                  </div>
                  <p className="text-black/60 mb-4">{result.emotional}</p>
                  <button
                    onClick={() => handleCopy(result.emotional, 'emotional')}
                    className="flex items-center gap-2 text-sm text-black/60 hover:text-black"
                  >
                    {copiedType === 'emotional' ? (
                      <>
                        <Check className="w-4 h-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制话术
                      </>
                    )}
                  </button>
                </Card>
              </div>

              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-black" />
                  <span className="font-semibold text-black">话术逻辑解析</span>
                </div>
                <div className="space-y-2">
                  {result.analysis.split('；').map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="w-5 h-5 bg-gray-100 text-black/60 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-black/60 text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-black/40" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">选择场景开始生成</h3>
                <p className="text-black/40">选择左侧的场景，即可生成专业话术</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
