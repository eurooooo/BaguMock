"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, MessageSquare } from "lucide-react";
import { generateContent } from "@/lib/generate-content";
import { generateAudio } from "@/lib/generate-audio";
import { AudioPlayer } from "./AudioPlayer";

export function MainForm() {
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [dialogue, setDialogue] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsGenerating(true);
    setError("");
    setDialogue("");
    setAudioUrl("");

    try {
      // Generate dialogue from input text
      const generatedDialogue = await generateContent(inputText);
      setDialogue(generatedDialogue);

      // Generate speech from dialogue
      const audio = await generateAudio(generatedDialogue);
      setAudioUrl(audio);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "生成对话时出错，请稍后重试"
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="p-6">
          <div className="mb-4">
            <Label
              htmlFor="experience"
              className="text-base font-medium flex items-center gap-2 mb-2"
            >
              <FileText className="h-4 w-4" />
              输入面经内容
            </Label>
            <Textarea
              id="experience"
              placeholder="请输入面经内容，例如：'Java后端开发工程师面试，问了JVM内存模型和线程池原理...'"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] resize-y"
              disabled={isGenerating}
            />
          </div>

          <Button
            type="submit"
            disabled={isGenerating || !inputText.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>生成面试对话</>
            )}
          </Button>
        </Card>
      </form>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      {dialogue && (
        <Card className="p-6">
          <Label className="text-base font-medium flex items-center gap-2 mb-4">
            <MessageSquare className="h-4 w-4" />
            生成的对话
          </Label>
          <div className="whitespace-pre-wrap bg-muted p-4 rounded-md max-h-[400px] overflow-y-auto text-sm mb-6">
            {dialogue}
          </div>

          {audioUrl && <AudioPlayer url={audioUrl} />}
        </Card>
      )}
    </div>
  );
}
