/**
 * Generates an interview dialogue based on the provided interview content
 * using the Deepseek API
 */
export async function generateContent(interviewContent) {
  try {
    // In a real implementation, this would call the Deepseek API
    // This is a mock implementation for demonstration purposes
    const response = await fetch("/api/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ interviewContent }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "生成对话失败");
    }

    const data = await response.json();
    return data.dialogue;
  } catch (error) {
    console.error("生成对话出错:", error);
    throw error;
  }
}
