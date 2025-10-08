import { Message } from "@/types/chat";
import { ToolCallCard } from "./ToolCallCard";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-4 animate-fade-in", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex gap-3 max-w-3xl", isUser && "flex-row-reverse")}>
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
            isUser ? "bg-primary" : "bg-gradient-primary"
          )}
        >
          {isUser ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4 text-white" />}
        </div>
        
        <div className={cn("flex flex-col gap-3", isUser && "items-end")}>
          <div
            className={cn(
              "rounded-2xl px-4 py-3 max-w-full break-words",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-card-foreground"
            )}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
              {message.isStreaming && (
                <span className="inline-block w-1 h-4 ml-1 bg-primary animate-pulse-glow" />
              )}
            </p>
          </div>

          {message.tools && message.tools.length > 0 && (
            <div className="flex flex-col gap-2 w-full">
              {message.tools.map((tool) => (
                <ToolCallCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
