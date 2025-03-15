import { NextResponse } from "next/server";
import axios from "axios";

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION;

// 解析对话文本，返回对话数组
function parseDialog(text) {
  const lines = text.split("\n").filter((line) => line.trim());
  const dialog = [];

  for (const line of lines) {
    if (line.startsWith("面试官：")) {
      dialog.push({
        role: "interviewer",
        text: line.replace("面试官：", "").trim(),
      });
    } else if (line.startsWith("候选人：")) {
      dialog.push({
        role: "candidate",
        text: line.replace("候选人：", "").trim(),
      });
    }
  }

  return dialog;
}

// 生成对话的SSML
function generateDialogSSML(dialog) {
  const voices = {
    interviewer: "zh-CN-YunxiNeural",
    candidate: "zh-CN-XiaoxiaoNeural",
  };

  const speeches = dialog
    .map(
      ({ role, text }) => `
    <voice name="${voices[role]}">
      <prosody rate="-10%">
        ${text}
      </prosody>
      <break time="800ms"/>
    </voice>
  `
    )
    .join("\n");

  return `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
      ${speeches}
    </speak>
  `;
}

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "对话内容不能为空" }, { status: 400 });
    }

    // 解析对话内容
    const dialog = parseDialog(text);

    if (dialog.length === 0) {
      return NextResponse.json({ error: "无法解析对话内容" }, { status: 400 });
    }

    // 生成SSML
    const ssml = generateDialogSSML(dialog);

    // 获取访问令牌
    const tokenResponse = await axios.post(
      `https://${AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      null,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
        },
      }
    );

    // 使用访问令牌调用文本转语音API
    const speechResponse = await axios.post(
      `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
      ssml,
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.data}`,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        },
        responseType: "arraybuffer",
      }
    );

    // 返回音频数据
    return new NextResponse(speechResponse.data, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "生成语音时出错" }, { status: 500 });
  }
}
