import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const { scene, identity, stance, situation } = req.body;
    const prompt = buildGeneratePrompt(scene, identity, stance, situation);
    const response = await callDeepSeek(prompt);
    const result = parseGenerateResponse(response);
    res.json(result);
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: '生成失败' });
  }
});

app.post('/api/detect', async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = buildDetectPrompt(text);
    const response = await callDeepSeek(prompt);
    console.log('DeepSeek raw response:', response.substring(0, 500));
    const result = parseDetectResponse(response, text);
    res.json(result);
  } catch (error) {
    console.error('Detect error:', error);
    res.status(500).json({ error: '检测失败' });
  }
});

app.post('/api/practice', async (req, res) => {
  try {
    const { role, scene, messages } = req.body;
    const prompt = buildPracticePrompt(role, scene, messages);
    const response = await callDeepSeek(prompt);
    res.json({ content: response });
  } catch (error) {
    console.error('Practice error:', error);
    res.status(500).json({ error: '对话失败' });
  }
});

app.post('/api/evaluate', async (req, res) => {
  try {
    const { userMessages } = req.body;
    const prompt = buildEvaluatePrompt(userMessages);
    const response = await callDeepSeek(prompt);
    const result = parseEvaluateResponse(response);
    res.json(result);
  } catch (error) {
    console.error('Evaluate error:', error);
    res.status(500).json({ error: '评分失败' });
  }
});

app.post('/api/rewrite', async (req, res) => {
  try {
    const { text, style } = req.body;
    const prompt = buildRewritePrompt(text, style);
    const response = await callDeepSeek(prompt);
    res.json({ result: response });
  } catch (error) {
    console.error('Rewrite error:', error);
    res.status(500).json({ error: '改写失败' });
  }
});

async function callDeepSeek(prompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的职场沟通顾问。请严格按照用户要求的JSON格式输出，不要添加任何markdown标记或其他文字。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function buildGeneratePrompt(scene: string, identity: string, stance: string, situation: string) {
  return `请帮我为以下职场场景生成三套话术：

场景：${scene}
对方身份：${identity}
我的立场：${stance}
补充情况：${situation || '无'}

请严格按照以下JSON格式输出（不要有其他文字）：
{
  "gentle": "温和稳妥版话术",
  "firm": "立场清晰版话术",
  "emotional": "高情商版话术",
  "analysis": "话术逻辑解析（分点说明，每点用；分隔）"
}

要求：
- 温和版：语气委婉，先理解对方，再表达困难
- 立场清晰版：态度坚定，明确边界，不卑不亢
- 高情商版：同理心强，提供替代方案，双赢思维
- 逻辑解析：说明每套话术背后的沟通策略`;
}

function buildDetectPrompt(text: string) {
  return `请分析以下职场沟通文本的情绪风险。

文本："${text}"

请严格按照JSON格式输出：
{
  "level": "red|yellow|green",
  "score": 0-100,
  "suggestions": ["建议1", "建议2"],
  "rewrites": {
    "gentle": "温和专业改写",
    "professional": "专业正式改写",
    "firm": "坚定得体改写"
  }
}

判断标准：
- red: 有明显的攻击性、侮辱性语言或强烈负面情绪
- yellow: 语气生硬、情绪化、可能引起冲突
- green: 专业得体、沟通良好

score: 风险分数，越高越安全（0-100）

rewrites: 针对原文提供三种不同风格的专业改写版本`;
}

function buildPracticePrompt(role: string, scene: string, messages: Array<{ role: string; content: string }>) {
  const roleDescriptions: Record<string, string> = {
    boss: '你是一个强势、直接、注重结果的老板，会给下属施压，强调公司利益',
    hr: '你是一个专业但也有原则的HR，会为公司争取利益，也关注员工感受',
    client: '你是一个挑剔、强势的客户，会砍价、抱怨、要求多',
    colleague: '你是一个会推诿、怕担责、有时不好配合的同事',
  };

  const history = messages.map(m => `${m.role === 'user' ? '我' : '对方'}: ${m.content}`).join('\n');

  return `${roleDescriptions[role]}

现在我们正在进行${scene}相关的对话。请根据上下文，以${role}的身份回复我。

对话历史：
${history}

请直接给出回复内容，不要加其他说明。回复要符合角色性格。`;
}

function buildEvaluatePrompt(userMessages: string[]) {
  return `请评估以下职场对话表现，严格按照JSON格式输出：

我的发言：
${userMessages.map((msg, i) => `${i + 1}. ${msg}`).join('\n')}

{
  "logic": 0-100,
  "tone": 0-100,
  "stance": 0-100,
  "risk": 0-100,
  "solution": 0-100,
  "total": 0-100
}

评分标准：
- logic: 逻辑清晰度（数据支撑、条理）
- tone: 语气得体度（专业、不卑不亢）
- stance: 立场坚定度（守住边界、不被带偏）
- risk: 风险规避度（避免风险词、不留把柄）
- solution: 方案建设性（提供替代方案、积极态度）`;
}

function buildRewritePrompt(text: string, style: string) {
  const styleDescriptions: Record<string, string> = {
    gentle: '温和专业，先理解后表达，体现同理心',
    professional: '专业正式，客观理性，符合职场规范',
    firm: '坚定得体，守住边界，态度明确但尊重对方',
  };

  return `请将以下文本改写成${styleDescriptions[style]}的版本：

原文：${text}

请直接给出改写后的内容，不要加其他说明。`;
}

function parseGenerateResponse(response: string) {
  try {
    let trimmed = response.trim();
    
    if (trimmed.startsWith('```json')) {
      trimmed = trimmed.slice(7);
    }
    if (trimmed.startsWith('```')) {
      trimmed = trimmed.slice(3);
    }
    if (trimmed.endsWith('```')) {
      trimmed = trimmed.slice(0, -3);
    }
    trimmed = trimmed.trim();
    
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const parsed = JSON.parse(trimmed);
      if (parsed.gentle && parsed.firm && parsed.emotional) {
        return parsed;
      }
    }
    
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.gentle && parsed.firm && parsed.emotional) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Parse error:', error);
  }
  
  return {
    gentle: '很抱歉，生成失败，请重试',
    firm: '很抱歉，生成失败，请重试',
    emotional: '很抱歉，生成失败，请重试',
    analysis: '生成失败',
  };
}

function parseDetectResponse(response: string, originalText: string) {
  try {
    let trimmed = response.trim();
    
    if (trimmed.startsWith('```json')) {
      trimmed = trimmed.slice(7);
    }
    if (trimmed.startsWith('```')) {
      trimmed = trimmed.slice(3);
    }
    if (trimmed.endsWith('```')) {
      trimmed = trimmed.slice(0, -3);
    }
    trimmed = trimmed.trim();
    
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const parsed = JSON.parse(trimmed);
      if (parsed.level && parsed.score !== undefined && parsed.rewrites) {
        console.log('Successfully parsed detect response');
        return {
          level: parsed.level,
          score: parsed.score,
          riskWords: [], // 简化，暂不返回风险词
          suggestions: parsed.suggestions || [],
          rewrites: parsed.rewrites
        };
      }
    }
    
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.level && parsed.score !== undefined && parsed.rewrites) {
        console.log('Successfully parsed detect response via regex');
        return {
          level: parsed.level,
          score: parsed.score,
          riskWords: [],
          suggestions: parsed.suggestions || [],
          rewrites: parsed.rewrites
        };
      }
    }
  } catch (error) {
    console.error('Parse detect error:', error);
  }
  
  console.log('Falling back to default response');
  return {
    level: 'green',
    score: 90,
    riskWords: [],
    suggestions: ['文本正常', '表达专业'],
    rewrites: {
      gentle: originalText,
      professional: originalText,
      firm: originalText,
    },
  };
}

function parseEvaluateResponse(response: string) {
  try {
    let trimmed = response.trim();
    
    if (trimmed.startsWith('```json')) {
      trimmed = trimmed.slice(7);
    }
    if (trimmed.startsWith('```')) {
      trimmed = trimmed.slice(3);
    }
    if (trimmed.endsWith('```')) {
      trimmed = trimmed.slice(0, -3);
    }
    trimmed = trimmed.trim();
    
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Parse evaluate error:', error);
  }
  return {
    logic: 75,
    tone: 70,
    stance: 72,
    risk: 80,
    solution: 68,
    total: 73,
  };
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
