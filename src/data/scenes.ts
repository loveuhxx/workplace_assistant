export const scenes = [
  { id: 'raise', category: '薪酬沟通', name: '加薪申请', description: '向老板提出加薪请求', icon: 'TrendingUp' },
  { id: 'bonus', category: '薪酬沟通', name: '年终奖谈判', description: '年终奖金协商', icon: 'Gift' },
  { id: 'salary-expect', category: '薪酬沟通', name: '薪资期望回复', description: '面试时回答薪资期望', icon: 'Briefcase' },
  { id: 'refuse-overtime', category: '任务管理', name: '拒绝加班', description: '拒绝不合理的加班要求', icon: 'Clock' },
  { id: 'refuse-task', category: '任务管理', name: '拒绝不合理任务', description: '拒绝超出职责范围的任务', icon: 'XCircle' },
  { id: 'follow-up', category: '任务管理', name: '催促进度', description: '催促同事完成协作任务', icon: 'AlertCircle' },
  { id: 'year-report', category: '汇报沟通', name: '年终汇报', description: '年终总结汇报开场白', icon: 'Presentation' },
  { id: 'project-report', category: '汇报沟通', name: '项目汇报', description: '项目进展汇报', icon: 'BarChart3' },
  { id: 'bad-news', category: '汇报沟通', name: '问题上报', description: '向老板报告坏消息', icon: 'AlertTriangle' },
  { id: 'feedback', category: '人际关系', name: '向上提意见', description: '向领导提出改进建议', icon: 'MessageSquare' },
  { id: 'coordination', category: '人际关系', name: '跨部门协调', description: '协调跨部门合作事宜', icon: 'Users' },
  { id: 'apology', category: '人际关系', name: '道歉补救', description: '工作失误后的道歉话术', icon: 'Heart' },
  { id: 'resign', category: '离职求职', name: '离职沟通', description: '体面地提出离职', icon: 'DoorOpen' },
  { id: 'interview', category: '离职求职', name: '面试回答', description: '常见面试问题回答', icon: 'FileText' },
  { id: 'client-complaint', category: '客户沟通', name: '客户投诉', description: '应对客户投诉', icon: 'Headphones' },
  { id: 'price-negotiation', category: '客户沟通', name: '价格谈判', description: '与客户进行价格协商', icon: 'Tag' },
];

export const categories = ['薪酬沟通', '任务管理', '汇报沟通', '人际关系', '离职求职', '客户沟通'];

export const roleOptions = [
  { id: 'boss', name: '老板', description: '强势直属领导' },
  { id: 'hr', name: 'HR', description: '人力资源专员' },
  { id: 'client', name: '客户', description: '重要客户' },
  { id: 'colleague', name: '同事', description: '跨部门同事' },
];
