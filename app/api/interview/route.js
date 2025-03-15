import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { content } = await req.json();

    if (!content) {
      return new Response(JSON.stringify({ error: "面经内容不能为空" }), {
        status: 400,
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "system",
          content: `你是一个专业的面试对话生成助手。请根据给定的面经内容，生成一段面试官和候选人之间的对话。

要求：
1. 对话要真实自然，符合实际面试场景
2. 面试官的问题要有层次性，从浅入深
3. 候选人的回答要专业、准确，并适当展现思考过程
4. 严格按照以下格式输出对话：

面试官：[问题内容]
候选人：[回答内容]

注意：
- 每个发言必须以"面试官："或"候选人："开头
- 每个问答要换行
- 不要添加任何其他格式或标记
- 确保对话内容完整，问答逻辑连贯`,
        },
        {
          role: "user",
          content: content,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "生成面试对话时出错" }), {
      status: 500,
    });
  }
}
