"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { notificationSchema } from "../api/use-object/schema";
import { Button } from "@/components/ui/button";
import { Loader2, XCircle } from "lucide-react"; // Add these imports
import { z } from "zod";

export default function Page() {
  const { object, submit, isLoading, stop } = useObject({
    api: "/api/use-object",
    schema: z.array(notificationSchema),
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Notification Generator
      </h1>

      <div className="flex justify-center mb-8">
        <Button
          onClick={() =>
            submit(`百度前端一面凉经
3.13
HTML
1.HTML文档结构（标签）
2.提到script标签 讲讲async和defer的作用
3.同步和异步操作
4.HTML5新增标签
5.对于DOM的操作方法
6.讲讲有哪些标签
7.块级元素和行内元素

CSS
1.盒模型
2.行内元素可以设置宽高吗 怎么设置
3.讲讲position
4.子绝父相的相对问题（这里被绕晕了，大概问的是给一个盒子设置relative，那么它的位置是相对谁而言balabala）
5.元素水平居中的方式
6.讲讲flex
7.了解过BFC吗（块级格式上下文）
8.BFC的实际作用场景

JS
1.数据类型
2.判断数据类型的方法
3.var let和const的区别
4.var a=1;function a(){} c.log(a)输出？
5.闭包的实际应用

VUE
1.讲讲双向数据绑定
2.实现响应式的流程
手写
1.手写判读值相同isEqual(a,b)函数，a和b的数据类型不一定一样

作者：九巫
链接：https://www.nowcoder.com/
来源：牛客网`)
          }
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-white rounded-lg"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </span>
          ) : (
            "Generate Notifications"
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            onClick={() => stop()}
            className="text-red-500 border-red-300 hover:bg-red-50 flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Stop Generation
          </Button>
        </div>
      )}

      {object && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Generated Notifications
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

      {!isLoading && !object?.notifications && (
        <div className="text-center text-gray-500 italic mt-10">
          Click the button above to generate notifications
        </div>
      )}
    </div>
  );
}
