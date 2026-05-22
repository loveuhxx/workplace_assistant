import { FileText, AlertTriangle, PlayCircle, ArrowRight, TrendingUp, Shield, Users, Zap } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

const features = [
  {
    icon: FileText,
    title: '话术生成',
    description: '一键生成职场高情商话术',
    href: '/generate',
  },
  {
    icon: AlertTriangle,
    title: '情绪检测',
    description: '分析表达风险，避免踩雷',
    href: '/detect',
  },
  {
    icon: PlayCircle,
    title: 'AI 对练',
    description: '模拟高压场景，提升沟通能力',
    href: '/practice',
  },
];

const highlights = [
  { icon: TrendingUp, text: '加薪成功率提升 60%' },
  { icon: Shield, text: '避免职场沟通雷区' },
  { icon: Users, text: '10万+职场人使用' },
  { icon: Zap, text: '响应速度快至 1 秒' },
];

export function Home() {
  return (
    <div className="space-y-24">
      <section className="text-center pt-20 pb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="text-black">职场</span>
          <span className="gradient-text">"嘴替"</span>
          <span className="text-black">助手</span>
        </h1>
        
        <p className="text-lg md:text-xl text-black/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          AI 模拟老板、HR、客户、同事，帮你练加薪、拒绝、汇报、谈判等高难度对话
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-black/5">
                <Icon className="w-4 h-4 text-black/60" />
                <span className="text-sm text-black/60">{item.text}</span>
              </div>
            );
          })}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => window.location.href = '/generate'}
          >
            开始使用
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            了解更多
          </Button>
        </div>
      </section>
      
      <section id="features">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">核心功能</h2>
          <p className="text-black/50">解决职场沟通痛点，让每一次对话都恰到好处</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} hover onClick={() => window.location.href = feature.href}>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-black/50">{feature.description}</p>
                <div className="mt-4 flex items-center text-black/60 text-sm font-medium">
                  <span>立即体验</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>
      
      <section className="bg-gray-50 rounded-3xl p-8 md:p-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            立即开始提升你的职场沟通能力
          </h2>
          <p className="text-black/50 text-lg mb-10">
            从不敢说不会说到张口就来，让 AI 成为你最得力的沟通助手
          </p>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-1">16+</div>
              <div className="text-black/40 text-sm">职场场景</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-1">3套</div>
              <div className="text-black/40 text-sm">话术版本</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-1">4种</div>
              <div className="text-black/40 text-sm">对练角色</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-1">100%</div>
              <div className="text-black/40 text-sm">AI 驱动</div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="text-center py-8 border-t border-black/5">
        <div className="flex justify-center gap-8 mb-4">
          <a href="/" className="text-black/40 hover:text-black text-sm transition-colors">首页</a>
          <a href="/generate" className="text-black/40 hover:text-black text-sm transition-colors">话术生成</a>
          <a href="/detect" className="text-black/40 hover:text-black text-sm transition-colors">情绪检测</a>
          <a href="/practice" className="text-black/40 hover:text-black text-sm transition-colors">AI 对练</a>
        </div>
        <p className="text-black/30 text-sm">
          © 2024 职场"嘴替"助手
        </p>
      </footer>
    </div>
  );
}
