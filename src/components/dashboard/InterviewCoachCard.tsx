
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

const InterviewCoachCard = () => {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-modern-blue-400/40 to-soft-purple/40 rounded-bl-full" />
      
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <div className="mr-2 bg-modern-blue-100 dark:bg-modern-blue-900 p-1.5 rounded-full">
            <MessageSquare className="h-5 w-5 text-modern-blue-600 dark:text-modern-blue-300" />
          </div>
          QwiX AI Interview Coach
        </CardTitle>
        <CardDescription>
          Practice interviews with our 3D virtual interviewer
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Interview readiness</span>
            <span className="font-medium">68%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
            <div className="h-full bg-gradient-to-r from-modern-blue-500 to-soft-purple rounded-full" style={{ width: "68%" }}></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm mb-3">
          <div>
            <span className="text-muted-foreground">Last practice:</span>{" "}
            <span>5 days ago</span>
          </div>
          <div>
            <span className="text-muted-foreground">Sessions:</span>{" "}
            <span>3</span>
          </div>
        </div>
        
        <Button asChild className="w-full bg-gradient-to-r from-modern-blue-600 to-soft-purple hover:opacity-90">
          <Link to="/interview-coach" className="flex items-center justify-center">
            Train Me Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default InterviewCoachCard;
