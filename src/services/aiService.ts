import { scenes } from '../data/scenes';

const API_BASE = '/api';

export const aiService = {
  generateScripts: async (sceneId: string, params: { identity: string; stance: string; situation: string }) => {
    const scene = scenes.find(s => s.id === sceneId);
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scene: scene?.name || sceneId,
        identity: params.identity,
        stance: params.stance,
        situation: params.situation,
      }),
    });
    
    if (!response.ok) throw new Error('API error');
    return response.json();
  },

  analyzeEmotion: async (text: string) => {
    const response = await fetch(`${API_BASE}/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    
    return {
      level: data?.level || 'green',
      score: data?.score || 90,
      riskWords: Array.isArray(data?.riskWords) ? data.riskWords : [],
      suggestions: Array.isArray(data?.suggestions) ? data.suggestions : [],
      rewrites: {
        gentle: data?.rewrites?.gentle || text,
        professional: data?.rewrites?.professional || text,
        firm: data?.rewrites?.firm || text,
      },
    };
  },

  practiceReply: async (role: string, scene: string, messages: Array<{ role: string; content: string }>) => {
    const response = await fetch(`${API_BASE}/practice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, scene, messages }),
    });
    
    if (!response.ok) throw new Error('API error');
    return response.json();
  },

  evaluatePractice: async (userMessages: string[]) => {
    const response = await fetch(`${API_BASE}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessages }),
    });
    
    if (!response.ok) throw new Error('API error');
    return response.json();
  },

  rewriteText: async (text: string, style: 'gentle' | 'professional' | 'firm') => {
    const response = await fetch(`${API_BASE}/rewrite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style }),
    });
    
    if (!response.ok) throw new Error('API error');
    return response.json();
  },
};

export const sceneService = {
  getCategories: () => ['薪酬沟通', '任务管理', '汇报沟通', '人际关系', '离职求职', '客户沟通'],
  getScenesByCategory: (category: string) => scenes.filter(s => s.category === category),
  getSceneById: (id: string) => scenes.find(s => s.id === id),
};
