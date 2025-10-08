export type StreamEventType = "text" | "tool_call" | "tool_result" | "error" | "done";

export type ToolStatus = "pending" | "running" | "completed" | "failed";

export type ToolType = "weather" | "calculator" | "image_generator" | "database_query" | "file_operations";

export interface ToolInfo {
  name: string;
  id: string;
  status: ToolStatus;
  result?: any;
}

export interface StreamEvent {
  type: StreamEventType;
  content: string;
  tool?: ToolInfo;
  timestamp: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  tools?: ToolInfo[];
  isStreaming?: boolean;
}

export interface Tool {
  name: string;
  description: string;
  parameters?: Record<string, any>;
}
