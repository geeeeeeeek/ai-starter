// app/api/chat/route.js
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.OPENAI_API_KEY, // 从环境变量中获取 API Key
});

export async function POST(request) {
  const { messages } = await request.json();

  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
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