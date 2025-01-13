// app/api/chat/route.js
import OpenAI from 'openai';

let requests = {};
const RATE_LIMIT = 100; // 最多请求次数
const TIME_FRAME = 60 * 60 * 1000; // 时间范围：60分钟

function checkRateLimit(req) {
  const ip = req.headers.get('x-forwarded-for') || req.ip;

  const now = Date.now();

  // 初始化请求计数
  if (!requests[ip]) {
    requests[ip] = {
      count: 1,
      startTime: now,
    };
  } else {
    const { count, startTime } = requests[ip];

    // 检查时间范围
    if (now - startTime > TIME_FRAME) {
      // 超出时间范围，重置计数
      requests[ip] = {
        count: 1,
        startTime: now,
      };
    } else {
      // 在时间范围内的请求计数
      if (count < RATE_LIMIT) {
        requests[ip].count += 1; // 增加计数
      } else {
        return true;
      }
    }
  }
  return false;
}

export async function POST(request) {


  // 限流
  let isRateLimited = checkRateLimit(request);
  if (isRateLimited) {
    return new Response(JSON.stringify({ message: 'Too Many Requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }



  const { messages, model } = await request.json();
  console.log("model===>" + model);

  let baseURL = 'https://api.deepseek.com';
  let apiKey = process.env.OPENAI_API_KEY;

  if (model === 'gpt-4o-mini' || model === 'gpt-4o') {
    baseURL = 'https://models.inference.ai.azure.com';
    apiKey = process.env.OPENAI_API_KEY_GPT;
  } else {
    baseURL = 'https://api.deepseek.com';
    apiKey = process.env.OPENAI_API_KEY;
  }

  const openai = new OpenAI({
    baseURL: baseURL,
    apiKey: apiKey, // 从环境变量中获取 API Key
  });

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages,
      stream: true, // 启用流式响应
    });

    // 创建可读流
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(`data: ${JSON.stringify({ content })}\n\n`);
        }
        controller.close();
      },
    });

    // 返回流式响应
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}