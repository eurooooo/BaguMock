import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { interviewContent } = await request.json();

    if (!interviewContent) {
      return NextResponse.json({ message: "请提供面经内容" }, { status: 400 });
    }

    // In a production environment, you would call the Deepseek API here
    // This is a mock implementation for demonstration purposes

    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate a sample dialogue based on the input
    const dialogue = generateMockDialogue(interviewContent);

    return NextResponse.json({ dialogue });
  } catch (error) {
    console.error("Generate dialogue error:", error);
    return NextResponse.json(
      { message: "服务器处理请求时出错" },
      { status: 500 }
    );
  }
}

function generateMockDialogue(content) {
  // This is a simple mock function to generate dialogue
  // In production, this would be replaced by the actual API call to Deepseek

  const topics =
    content.length > 50
      ? content.substring(0, 50).split(/[,，.。;；]/)
      : content.split(/[,，.。;；]/);

  let dialogue = "";

  dialogue += "面试官: 您好，请介绍一下您自己的技术背景。\n\n";
  dialogue +=
    "应聘者: 您好，我是一名有5年经验的软件开发工程师，擅长Java后端开发，熟悉Spring Boot和微服务架构...\n\n";

  // Generate questions based on content
  for (const topic of topics) {
    if (topic.trim().length > 5) {
      dialogue += `面试官: 能谈谈您对${topic.trim()}的理解吗？\n\n`;
      dialogue += `应聘者: 关于${topic.trim()}，我的理解是...[详细回答]\n\n`;
    }
  }

  dialogue += "面试官: 您有什么问题想问我们团队的吗？\n\n";
  dialogue += "应聘者: 是的，我想了解一下团队的技术栈和日常开发流程...\n\n";
  dialogue += "面试官: 谢谢您的时间，我们会尽快通知您面试结果。\n\n";

  return dialogue;
}
