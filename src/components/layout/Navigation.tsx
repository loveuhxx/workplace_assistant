import { MessageSquare, Home, FileText, AlertTriangle, PlayCircle } from 'lucide-react';

const navItems = [
  { id: '/', label: '首页', icon: Home },
  { id: '/generate', label: '话术生成', icon: FileText },
  { id: '/detect', label: '情绪检测', icon: AlertTriangle },
  { id: '/practice', label: 'AI对练', icon: PlayCircle },
];

export function Navigation() {
  const currentPath = window.location.pathname;
  
  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-black">
              职场嘴替
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPath === item.id;
              return (
                <a
                  key={item.id}
                  href={item.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-black/50 hover:text-black hover:bg-black/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
