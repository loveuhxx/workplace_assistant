import { useState, useRef, useEffect } from 'react';
import { PlayCircle, RotateCcw, Send, Trophy, MessageSquare, Briefcase, Users, Headphones, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { aiService } from '../services/aiService';
import { roleOptions } from '../data/scenes';
import type { PracticeMessage, PracticeScore } from '../types';

const roleIcons: Record<string, typeof MessageSquare> = {
  boss: Briefcase,
  hr: Users,
  client: Headphones,
  colleague: MessageSquare,
};

const scoreDimensions = [
  { key: 'logic', label: '逻辑清晰度', weight: 25 },
  { key: 'tone', label: '语气得体度', weight: 25 },
  { key: 'stance', label: '立场坚定度', weight: 20 },
  { key: 'risk', label: '风险规避度', weight: 15 },
  { key: 'solution', label: '方案建设性', weight: 15 },
];

export function Practice() {
  const [selectedRole, setSelectedRole] = useState('boss');
  const [scene, setScene] = useState('');
  const [messages, setMessages] = useState<PracticeMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<PracticeScore | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStart = () => {
    setMessages([]);
    setScore(null);
    setIsFinished(false);
    setLoading(true);
    
    setTimeout(() => {
      const initialMessages: PracticeMessage[] = [
        {
          id: '1',
          role: 'ai',
          content: '准备好了吗？我们开始练习。我来扮演你的' + roleOptions.find(r => r.id === selectedRole)?.name + '，你有什么想沟通的？',
          timestamp: Date.now(),
        },
      ];
      setMessages(initialMessages);
      setLoading(false);
    }, 500);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || loading || isFinished) return;
    
    const userMessage: PracticeMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };
    
    const messagesWithNew = [...messages, userMessage];
    setMessages(messagesWithNew);
    setInputValue('');
    setLoading(true);
    
    const aiReply = await aiService.practiceReply(selectedRole, scene, messagesWithNew);
    
    const aiMessage: PracticeMessage = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: aiReply.content,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);
  };

  const handleFinish = async () => {
    if (messages.length === 0) return;
    
    setLoading(true);
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
    const practiceScore = await aiService.evaluatePractice(userMessages);
    setScore(practiceScore);
    setIsFinished(true);
    setLoading(false);
  };

  const handleRestart = () => {
    setMessages([]);
    setScore(null);
    setIsFinished(false);
    setInputValue('');
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">AI 对练模拟器</h1>
        <p className="text-black/50">模拟高压场景，提升职场沟通能力</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="text-sm font-medium text-black/60 mb-3">选择角色</h3>
            <div className="space-y-2">
              {roleOptions.map(role => {
                const Icon = roleIcons[role.id];
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setMessages([]);
                      setScore(null);
                      setIsFinished(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                      selectedRole === role.id
                        ? 'bg-black/5 border-2 border-black'
                        : 'bg-white border-2 border-black/5 hover:border-black/10'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="font-medium text-black">{role.name}</div>
                      <div className="text-xs text-black/40">{role.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-black/60 mb-3">操作</h3>
            <div className="space-y-3">
              <Button
                onClick={handleStart}
                disabled={loading}
                className="w-full"
              >
                <span className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" />
                  开始对练
                </span>
              </Button>
              
              <Button
                variant="secondary"
                onClick={handleFinish}
                disabled={messages.length === 0 || loading || isFinished}
                className="w-full"
              >
                <span className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  结束并评分
                </span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleRestart}
                disabled={loading}
                className="w-full"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  重新开始
                </span>
              </Button>
            </div>
          </Card>

          {score && isFinished && (
            <Card>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-black">
                  {score.total}
                </div>
                <div className="text-sm text-black/40">综合得分</div>
              </div>
              
              <div className="space-y-3">
                {scoreDimensions.map(dim => {
                  const value = score?.[dim.key as keyof PracticeScore] as number;
                  return (
                    <div key={dim.key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-black/60">{dim.label}</span>
                        <span className="font-medium text-black">{value}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-black/5">
                <div className="text-sm font-medium text-black/60 mb-2">优化建议</div>
                <div className="space-y-2">
                  {score.logic < 70 && (
                    <div className="flex items-start gap-2 text-sm text-black/60">
                      <XCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span>建议增强逻辑条理，用数据和事实支撑观点</span>
                    </div>
                  )}
                  {score.tone < 70 && (
                    <div className="flex items-start gap-2 text-sm text-black/60">
                      <XCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span>语气可以更温和一些，避免直接对抗</span>
                    </div>
                  )}
                  {score.stance < 70 && (
                    <div className="flex items-start gap-2 text-sm text-black/60">
                      <XCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span>立场可以更坚定，避免被轻易带偏</span>
                    </div>
                  )}
                  {score.risk < 70 && (
                    <div className="flex items-start gap-2 text-sm text-black/60">
                      <XCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span>注意避免使用风险词汇，保持专业表达</span>
                    </div>
                  )}
                  {score.solution < 70 && (
                    <div className="flex items-start gap-2 text-sm text-black/60">
                      <XCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span>建议提供更多建设性方案，体现积极态度</span>
                    </div>
                  )}
                  {score.total >= 80 && (
                    <div className="flex items-start gap-2 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>表现优秀！继续保持这种沟通风格</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col min-h-[600px]">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  {(() => {
                    const Icon = roleIcons[selectedRole];
                    return <Icon className="w-5 h-5 text-white" />;
                  })()}
                </div>
                <div>
                  <div className="font-semibold text-black">{roleOptions.find(r => r.id === selectedRole)?.name}</div>
                  <div className="text-xs text-black/40">AI 对练模式</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-black/40">在线</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-xl mb-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-black/40">
                  <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-center">
                    {loading ? '正在准备...' : '点击「开始对练」开始模拟对话'}
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-black text-white rounded-br-md'
                          : 'bg-white text-black rounded-bl-md shadow-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {!isFinished && (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="输入你的回复..."
                  disabled={loading || messages.length === 0}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 text-black placeholder-black/30"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || loading || messages.length === 0}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}

            {isFinished && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-black/70 rounded-full">
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium">对话已结束，请查看评分</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
