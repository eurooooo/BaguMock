/**
 * Generates speech audio from dialogue text using Azure TTS
 */
export async function generateAudio(dialogue) {
  try {
    // In a real implementation, this would call the Azure TTS API
    // This is a mock implementation for demonstration purposes
    const response = await fetch("/api/generate-audio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dialogue }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "生成语音失败");
    }

    const data = await response.json();
    return data.audioUrl;
  } catch (error) {
    console.error("生成语音出错:", error);
    throw error;
  }
}
