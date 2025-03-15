"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, FileText } from "lucide-react";
import { z } from "zod";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { notificationSchema } from "@/app/api/use-object/schema";
export function MainForm() {
  const [inputText, setInputText] = useState("");
  const { object, submit, isLoading, stop } = useObject({
    api: "/api/use-object",
    schema: z.array(notificationSchema),
  });

  return (
    <div className="space-y-8">
      <div className="space-y-4">
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
              disabled={isLoading}
            />
          </div>

          <Button
            disabled={isLoading || !inputText.trim()}
            className="w-full"
            onClick={() => {
              submit(inputText);
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>生成面试对话</>
            )}
          </Button>
        </Card>
      </div>

      {object && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold mb-4">
            生成的面试对话（{object.length}条）
          </h2>
          {object.map((notification, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
            >
              <p className="font-medium text-lg text-gray-800 mb-1">
                {notification?.name}
              </p>
              <p className="text-gray-600">{notification?.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
