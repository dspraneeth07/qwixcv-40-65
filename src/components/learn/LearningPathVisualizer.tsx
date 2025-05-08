
import React from "react";
import { Card } from "@/components/ui/card";
import { GraduationCap, ArrowRight, Star, Book, CheckCircle } from "lucide-react";

interface LearningPathNode {
  title: string;
  timeframe: string;
  description: string;
  resources: { name: string; type: string; url: string }[];
}

interface LearningPathVisualizerProps {
  data: LearningPathNode[];
}

export function LearningPathVisualizer({ data }: LearningPathVisualizerProps) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No learning path data available</div>;
  }

  // Generate colors from blue to purple gradient for the nodes
  const getNodeColor = (index: number): string => {
    const colors = [
      "bg-blue-500",
      "bg-blue-600",
      "bg-indigo-500",
      "bg-indigo-600",
      "bg-purple-500",
      "bg-purple-600",
      "bg-modern-blue-500",
      "bg-soft-purple"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] p-4">
        <div className="flex flex-col items-center">
          {/* Path visualization */}
          <div className="flex items-center w-full justify-between mb-8">
            {data.map((node, index) => (
              <React.Fragment key={index}>
                {/* Node */}
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full ${getNodeColor(index)} flex items-center justify-center text-white mb-2`}>
                    {index === 0 ? (
                      <Star className="h-7 w-7" />
                    ) : index === data.length - 1 ? (
                      <CheckCircle className="h-7 w-7" />
                    ) : (
                      <Book className="h-7 w-7" />
                    )}
                  </div>
                  <div className="text-center w-28">
                    <p className="font-medium text-sm text-black dark:text-white">{node.title}</p>
                    <p className="text-xs text-black dark:text-gray-300">{node.timeframe}</p>
                  </div>
                </div>
                
                {/* Connector - Make arrows more visible */}
                {index < data.length - 1 && (
                  <div className="flex-1 h-1 bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-500 dark:to-purple-500 mx-2 flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-950 px-1 rounded-full border border-gray-300 dark:border-gray-700">
                      <ArrowRight className="h-5 w-5 text-black dark:text-white" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Detailed cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {data.map((node, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow border-2 border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${getNodeColor(index)} flex items-center justify-center text-white shrink-0`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-black dark:text-white">{node.title}</h3>
                    <p className="text-xs text-black dark:text-gray-300 mb-2">{node.timeframe}</p>
                    <p className="text-sm mb-2 text-black dark:text-gray-300">{node.description}</p>
                    {node.resources.length > 0 && (
                      <div className="text-xs">
                        <span className="font-medium text-black dark:text-white">Top resource:</span>{" "}
                        <a 
                          href={node.resources[0].url} 
                          className="text-modern-blue-500 hover:underline font-bold"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {node.resources[0].name}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
