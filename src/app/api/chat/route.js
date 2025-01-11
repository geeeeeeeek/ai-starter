// app/api/chat/route.js
import OpenAI from 'openai';



export async function POST(request) {
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