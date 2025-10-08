import { ToolInfo } from "@/types/chat";
import { 
  Cloud, 
  Calculator, 
  Image as ImageIcon, 
  Database, 
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCallCardProps {
  tool: ToolInfo;
}

const toolIcons = {
  weather: Cloud,
  calculator: Calculator,
  image_generator: ImageIcon,
  database_query: Database,
  file_operations: FileText,
};

const toolColors = {
  weather: "text-tool-weather border-tool-weather/30 bg-tool-weather/10",
  calculator: "text-tool-calculator border-tool-calculator/30 bg-tool-calculator/10",
  image_generator: "text-tool-image border-tool-image/30 bg-tool-image/10",
  database_query: "text-tool-database border-tool-database/30 bg-tool-database/10",
  file_operations: "text-tool-file border-tool-file/30 bg-tool-file/10",
};

const statusIcons = {
  pending: Clock,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
};

const statusColors = {
  pending: "text-status-pending",
  running: "text-status-running",
  completed: "text-status-completed",
  failed: "text-status-failed",
};

function getToolKey(toolName: string): keyof typeof toolIcons {
  const lowerName = toolName.toLowerCase();
  if (lowerName.includes("weather")) return "weather";
  if (lowerName.includes("calculator") || lowerName.includes("calc")) return "calculator";
  if (lowerName.includes("image")) return "image_generator";
  if (lowerName.includes("database") || lowerName.includes("db")) return "database_query";
  if (lowerName.includes("file")) return "file_operations";
  return "file_operations";
}

export function ToolCallCard({ tool }: ToolCallCardProps) {
  const toolKey = getToolKey(tool.name);
  const Icon = toolIcons[toolKey];
  const StatusIcon = statusIcons[tool.status];
  const toolColor = toolColors[toolKey];
  const statusColor = statusColors[tool.status];

  return (
    <div className={cn("rounded-xl border p-3 animate-slide-in", toolColor)}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{tool.name}</span>
        <div className="ml-auto flex items-center gap-1">
          <StatusIcon className={cn("w-4 h-4", statusColor, tool.status === "running" && "animate-spin")} />
          <span className={cn("text-xs capitalize", statusColor)}>{tool.status}</span>
        </div>
      </div>
      
      {tool.result && tool.status === "completed" && (
        <div className="mt-2 text-xs opacity-80 p-2 rounded bg-background/50">
          {typeof tool.result === "string" ? (
            <p>{tool.result}</p>
          ) : (
            <pre className="whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(tool.result, null, 2)}
            </pre>
          )}
        </div>
      )}

      {tool.status === "failed" && (
        <div className="mt-2 text-xs text-status-failed p-2 rounded bg-status-failed/10">
          Tool execution failed
        </div>
      )}
    </div>
  );
}
