
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface JobSearchFiltersProps {
  onFilterChange: (filters: any) => void;
  disabled?: boolean;
}

const JobSearchFilters = ({ onFilterChange, disabled = false }: JobSearchFiltersProps) => {
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
            <RadioGroupItem value="remote" id="remote" disabled={disabled} />
            <Label htmlFor="remote" className={disabled ? "opacity-50" : ""}>Remote</Label>
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
  );
};

export default JobSearchFilters;
