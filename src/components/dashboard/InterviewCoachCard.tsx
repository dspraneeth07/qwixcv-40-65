
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

const InterviewCoachCard = () => {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/40 to-teal-500/40 rounded-bl-full" />
      
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <div className="mr-2 bg-green-100 dark:bg-green-900 p-1.5 rounded-full">
            <Users className="h-5 w-5 text-green-600 dark:text-green-300" />
          </div>
          QwixMask Interview Coach
        </CardTitle>
        <CardDescription>
          Practice for interviews with AI-powered feedback and coaching
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Practice completion</span>
            <span className="font-medium">65%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
            <div className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full" style={{ width: "65%" }}></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm mb-3">
          <div>
            <span className="text-muted-foreground">Sessions:</span>{" "}
            <span>6 completed</span>
          </div>
          <div>
            <span className="text-muted-foreground">Next goal:</span>{" "}
            <span>Technical</span>
          </div>
        </div>
        
        <Button asChild className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:opacity-90">
          <Link to="/interview-coach" className="flex items-center justify-center">
            Continue Practice
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default InterviewCoachCard;
