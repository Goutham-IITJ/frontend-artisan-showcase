import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { Message, StreamEvent } from "@/types/chat";
import { sendChatMessage } from "@/lib/api";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
  scrollToBottom();
}, [messages.length]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    // Add user message and a placeholder for the assistant's response
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        tools: [],
        isStreaming: true,
      },
    ]);

    setIsStreaming(true);

    try {
      await sendChatMessage(content, (event: StreamEvent) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const assistantMessage = newMessages[newMessages.length - 1];

          switch (event.type) {
            case "text":
              assistantMessage.content += event.content;
              break;

            case "tool_call":
            case "tool_result":
              if (event.tool) {
                const toolIndex = assistantMessage.tools?.findIndex((t) => t.id === event.tool!.id) ?? -1;
                if (toolIndex > -1) {
                  assistantMessage.tools![toolIndex] = event.tool;
                } else {
                  assistantMessage.tools = [...(assistantMessage.tools || []), event.tool];
                }
              }
              break;

            case "error":
              toast.error("Error: " + event.content);
              break;

            case "done":
              assistantMessage.isStreaming = false;
              break;
          }

          return newMessages;
        });
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      setMessages((prev) => prev.slice(0, -2)); // Remove user and assistant placeholder
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AI Streaming Assistant</h1>
              <p className="text-xs text-muted-foreground">Powered by Genoshi Technologies</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 animate-pulse-glow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Welcome to AI Streaming</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Ask me anything! I can check the weather, perform calculations, generate images, query databases, and more.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                <button
                  onClick={() => handleSendMessage("What's the weather in Tokyo?")}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors text-left"
                  disabled={isStreaming}
                >
                  <div className="text-sm font-medium text-foreground mb-1">Weather Query</div>
                  <div className="text-xs text-muted-foreground">What's the weather in Tokyo?</div>
                </button>
                <button
                  onClick={() => handleSendMessage("Calculate 1234 * 5678")}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors text-left"
                  disabled={isStreaming}
                >
                  <div className="text-sm font-medium text-foreground mb-1">Calculator</div>
                  <div className="text-xs text-muted-foreground">Calculate 1234 * 5678</div>
                </button>
                <button
                  onClick={() => handleSendMessage("Generate an image of a sunset")}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors text-left"
                  disabled={isStreaming}
                >
                  <div className="text-sm font-medium text-foreground mb-1">Image Generation</div>
                  <div className="text-xs text-muted-foreground">Generate an image of a sunset</div>
                </button>
                <button
                  onClick={() => handleSendMessage("Query the user database")}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors text-left"
                  disabled={isStreaming}
                >
                  <div className="text-sm font-medium text-foreground mb-1">Database Query</div>
                  <div className="text-xs text-muted-foreground">Query the user database</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
          <p className="text-xs text-muted-foreground text-center mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;