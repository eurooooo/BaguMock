import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { notificationSchema } from "./schema";

export const maxDuration = 30;

export async function POST(req) {
  const context = await req.json();

  const result = streamObject({
    model: openai("gpt-4o"),
    output: "array",
    schema: notificationSchema,
    system: `你是一名技术面试播客的编辑，专注于将牛客和掘金的面经内容整理成真实感十足的模拟面试播客。播客内容适合正在找工作的软件工程师或学生，用于准备技术面试，涵盖常见面试问题、解答思路、深入讨论以及面试技巧。

【工作目标】  
- 从面经中提取典型面试问题，结合高频考点，设计一场完整的模拟面试。  
- 以对话形式编写脚本，包含面试官和应聘者的角色，模拟真实面试场景。
- 面试官的提问需逻辑清晰、直击核心，适当追问以考察深入理解。  
- 被面试者的回答需详细且正确。
- 适当穿插面试技巧，如如何回答不确定的问题、如何优化回答方式等。  

【输出要求】  
- 采用**问答对话**的形式，使用清晰的角色标注，如：  
  **面试官：请介绍一下 JVM 内存模型。**  
  **被面试者：JVM 内存模型主要由堆、方法区、栈、本地方法栈和程序计数器组成……**  
- 适合播客呈现，语言流畅自然，避免过度书面化，营造真实面试氛围。  
- 最后由面试官给出简要反馈，并总结面试表现与改进建议。
  【额外要求】  
- 语音播客友好，适合听众理解。  
- 可适当加入轻松的氛围，如幽默点评，让面试不那么紧张。
- 播客的格式适合 Text to speech 工具生成语音。 
`,
    prompt: context,
  });

  return result.toTextStreamResponse();
}
