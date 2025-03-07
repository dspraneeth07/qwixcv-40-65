
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface JobSearchFiltersProps {
  onFilterChange: (filters: any) => void;
}

const JobSearchFilters = ({ onFilterChange }: JobSearchFiltersProps) => {
  const [jobType, setJobType] = useState("all");
  const [experience, setExperience] = useState<string[]>([]);
  const [datePosted, setDatePosted] = useState("any");

  const handleJobTypeChange = (value: string) => {
    setJobType(value);
    onFilterChange({ jobType: value, experience, datePosted });
  };

  const handleExperienceChange = (value: string) => {
    setExperience(prev => {
      const updated = prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value];
      
      onFilterChange({ jobType, experience: updated, datePosted });
      return updated;
    });
  };

  const handleDatePostedChange = (value: string) => {
    setDatePosted(value);
    onFilterChange({ jobType, experience, datePosted: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Job Type</h3>
        <RadioGroup value={jobType} onValueChange={handleJobTypeChange}>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All Types</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="full-time" id="full-time" />
            <Label htmlFor="full-time">Full-time</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="part-time" id="part-time" />
            <Label htmlFor="part-time">Part-time</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="contract" id="contract" />
            <Label htmlFor="contract">Contract</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="remote" id="remote" />
            <Label htmlFor="remote">Remote</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-3">Experience Level</h3>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="entry" 
              checked={experience.includes("entry")}
              onCheckedChange={() => handleExperienceChange("entry")}
            />
            <Label htmlFor="entry">Entry Level</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="mid" 
              checked={experience.includes("mid")}
              onCheckedChange={() => handleExperienceChange("mid")}
            />
            <Label htmlFor="mid">Mid Level</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="senior" 
              checked={experience.includes("senior")}
              onCheckedChange={() => handleExperienceChange("senior")}
            />
            <Label htmlFor="senior">Senior Level</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="executive" 
              checked={experience.includes("executive")}
              onCheckedChange={() => handleExperienceChange("executive")}
            />
            <Label htmlFor="executive">Executive</Label>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-3">Date Posted</h3>
        <RadioGroup value={datePosted} onValueChange={handleDatePostedChange}>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="any" id="any" />
            <Label htmlFor="any">Any time</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="day" id="day" />
            <Label htmlFor="day">Past 24 hours</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="week" id="week" />
            <Label htmlFor="week">Past week</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="month" id="month" />
            <Label htmlFor="month">Past month</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default JobSearchFilters;
