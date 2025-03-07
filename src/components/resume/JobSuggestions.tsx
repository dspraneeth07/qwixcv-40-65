
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Building, MapPin, ExternalLink, Search, Linkedin, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { JobListing } from "@/types/job";
import { getJobRecommendations } from "@/utils/jobBoardApi";
import { Badge } from "@/components/ui/badge";

interface JobSuggestionsProps {
  skills: string[];
  jobTitle: string;
  location?: string;
}

const JobSuggestions = ({ skills, jobTitle, location }: JobSuggestionsProps) => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        // Extract all skills from different skill categories
        const allSkills = Array.isArray(skills) ? 
          skills : 
          Object.values(skills).filter(Boolean) as string[];
        
        const jobRecommendations = await getJobRecommendations(allSkills, jobTitle, location);
        setJobs(jobRecommendations.slice(0, 5)); // Only show top 5 recommendations
      } catch (error) {
        console.error("Error loading job recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (skills && (Array.isArray(skills) ? skills.length > 0 : Object.values(skills).some(Boolean)) || jobTitle) {
      loadJobs();
    } else {
      setLoading(false);
    }
  }, [skills, jobTitle, location]);

  // Function to get platform icon
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'linkedin':
        return <Linkedin className="h-3 w-3" />;
      case 'indeed':
        return <Briefcase className="h-3 w-3" />;
      case 'upwork':
        return <Globe className="h-3 w-3" />;
      default:
        return <Briefcase className="h-3 w-3" />;
    }
  };

  // Function to get platform color
  const getPlatformColor = (platform: string) => {
    switch(platform) {
      case 'linkedin':
        return "bg-blue-100 text-blue-800";
      case 'indeed':
        return "bg-blue-100 text-blue-800";
      case 'upwork':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get platform label
  const getPlatformLabel = (platform: string) => {
    switch(platform) {
      case 'linkedin':
        return "LinkedIn";
      case 'indeed':
        return "Indeed";
      case 'upwork':
        return "Upwork";
      default:
        return "Other";
    }
  };

  if (loading) {
    return (
      <Card className="border shadow-sm h-full">
        <CardHeader className="pb-2">
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex space-x-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="border shadow-sm h-full">
        <CardHeader className="pb-2">
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">No matching jobs found</p>
            <Link to="/job-board">
              <Button variant="link" className="mt-2">
                <Search className="h-4 w-4 mr-2" />
                Browse all jobs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle>Recommended Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between">
                <h3 className="font-medium text-sm">{job.title}</h3>
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center text-xs"
                >
                  Apply
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                <span className="inline-flex items-center">
                  <Building className="h-3 w-3 mr-1" />
                  {job.company}
                </span>
                <span className="inline-flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {job.location}
                </span>
                <Badge 
                  variant="outline" 
                  className={`text-xs px-1.5 py-0 h-5 ${getPlatformColor(job.platform)}`}
                >
                  <span className="flex items-center">
                    {getPlatformIcon(job.platform)}
                    <span className="ml-1">{getPlatformLabel(job.platform)}</span>
                  </span>
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link to="/job-board">
            <Button variant="outline" size="sm" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              View More Jobs
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSuggestions;
