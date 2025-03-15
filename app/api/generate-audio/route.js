import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { dialogue } = await request.json();

    if (!dialogue) {
      return NextResponse.json({ message: "请提供对话内容" }, { status: 400 });
    }

    // In a production environment, you would call the Azure TTS API here
    // This is a mock implementation for demonstration purposes

    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real implementation, this would be a URL to the generated audio file
    // For this demo, we're returning a sample audio URL
    const audioUrl = "/sample-interview.mp3";

    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error("Generate speech error:", error);
    return NextResponse.json(
      { message: "服务器处理请求时出错" },
      { status: 500 }
    );
  }
}
