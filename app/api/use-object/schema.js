import { z } from "zod";

// define a schema for a single notification
export const notificationSchema = z.object({
  name: z.string().describe("人物角色：面试官或应聘者"),
  message: z.string().describe("该人物说话内容"),
});
