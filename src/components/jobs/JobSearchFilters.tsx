
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JobFilter } from "@/types/job";

interface JobSearchFiltersProps {
  onFilterChange: (filters: JobFilter) => void;
  disabled?: boolean;
}

const JobSearchFilters = ({ onFilterChange, disabled = false }: JobSearchFiltersProps) => {
  const [jobType, setJobType] = useState<string>("all");
  const [experience, setExperience] = useState<string[]>([]);
  const [datePosted, setDatePosted] = useState<string>("any");
  const [remote, setRemote] = useState<boolean>(false);

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange({
      jobType,
      experience,
      datePosted,
      remote,
      employmentType: mapJobTypeToEmploymentType(jobType)
    });
  }, [jobType, experience, datePosted, remote, onFilterChange]);

  // Map our UI job type to API employment_type parameter
  const mapJobTypeToEmploymentType = (type: string): string => {
    switch (type) {
      case "full-time": return "full_time";
      case "part-time": return "part_time";
      case "contract": return "contract";
      case "internship": return "internship";
      default: return "";
    }
  };

  const handleJobTypeChange = (value: string) => {
    setJobType(value);
  };

  const handleExperienceChange = (value: string) => {
    setExperience(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const handleDatePostedChange = (value: string) => {
    setDatePosted(value);
  };

  const handleRemoteChange = (checked: boolean) => {
    setRemote(checked);
  };

  return (
    <ScrollArea className="h-[calc(100vh-240px)] pr-4">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Job Type</h3>
          <RadioGroup value={jobType} onValueChange={handleJobTypeChange} disabled={disabled}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="all" id="all" disabled={disabled} />
              <Label htmlFor="all" className={disabled ? "opacity-50" : ""}>All Types</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="full-time" id="full-time" disabled={disabled} />
              <Label htmlFor="full-time" className={disabled ? "opacity-50" : ""}>Full-time</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="part-time" id="part-time" disabled={disabled} />
              <Label htmlFor="part-time" className={disabled ? "opacity-50" : ""}>Part-time</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="contract" id="contract" disabled={disabled} />
              <Label htmlFor="contract" className={disabled ? "opacity-50" : ""}>Contract</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="internship" id="internship" disabled={disabled} />
              <Label htmlFor="internship" className={disabled ? "opacity-50" : ""}>Internship</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-3">Remote Work</h3>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remote-work" 
              checked={remote}
              onCheckedChange={(checked) => handleRemoteChange(checked as boolean)}
              disabled={disabled}
            />
            <Label htmlFor="remote-work" className={disabled ? "opacity-50" : ""}>Remote Jobs Only</Label>
          </div>
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
                disabled={disabled}
              />
              <Label htmlFor="entry" className={disabled ? "opacity-50" : ""}>Entry Level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mid" 
                checked={experience.includes("mid")}
                onCheckedChange={() => handleExperienceChange("mid")}
                disabled={disabled}
              />
              <Label htmlFor="mid" className={disabled ? "opacity-50" : ""}>Mid Level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="senior" 
                checked={experience.includes("senior")}
                onCheckedChange={() => handleExperienceChange("senior")}
                disabled={disabled}
              />
              <Label htmlFor="senior" className={disabled ? "opacity-50" : ""}>Senior Level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="executive" 
                checked={experience.includes("executive")}
                onCheckedChange={() => handleExperienceChange("executive")}
                disabled={disabled}
              />
              <Label htmlFor="executive" className={disabled ? "opacity-50" : ""}>Executive</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-3">Date Posted</h3>
          <RadioGroup value={datePosted} onValueChange={handleDatePostedChange} disabled={disabled}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="any" id="any" disabled={disabled} />
              <Label htmlFor="any" className={disabled ? "opacity-50" : ""}>Any time</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="day" id="day" disabled={disabled} />
              <Label htmlFor="day" className={disabled ? "opacity-50" : ""}>Past 24 hours</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="week" id="week" disabled={disabled} />
              <Label htmlFor="week" className={disabled ? "opacity-50" : ""}>Past week</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="month" id="month" disabled={disabled} />
              <Label htmlFor="month" className={disabled ? "opacity-50" : ""}>Past month</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </ScrollArea>
  );
};

export default JobSearchFilters;
