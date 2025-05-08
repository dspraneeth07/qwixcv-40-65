
import React from "react";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem 
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const popularRoles = [
  { value: "frontend-developer", label: "Frontend Developer" },
  { value: "backend-developer", label: "Backend Developer" },
  { value: "fullstack-developer", label: "Full Stack Developer" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "product-manager", label: "Product Manager" },
  { value: "ux-designer", label: "UX Designer" },
  { value: "project-manager", label: "Project Manager" },
  { value: "qa-engineer", label: "QA Engineer" },
  { value: "devops-engineer", label: "DevOps Engineer" },
  { value: "mobile-developer", label: "Mobile Developer" },
  { value: "ai-engineer", label: "AI Engineer" },
  { value: "blockchain-developer", label: "Blockchain Developer" },
  { value: "marketing-specialist", label: "Marketing Specialist" },
  { value: "hr-manager", label: "HR Manager" },
  { value: "sales-manager", label: "Sales Manager" }
];

interface JobRoleSelectorProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
}

export const JobRoleSelector = ({ selectedRole, onRoleSelect }: JobRoleSelectorProps) => {
  const [open, setOpen] = React.useState(false);
  
  // Find the current selected role label or use placeholder
  const selectedRoleLabel = React.useMemo(() => {
    if (!selectedRole) return "Select a job role...";
    const role = popularRoles.find(role => role.value === selectedRole);
    return role ? role.label : "Select a job role...";
  }, [selectedRole]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-black dark:text-white">Select Job Role</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-2 border-gray-300 dark:border-gray-700"
          >
            <span className="text-black dark:text-white">{selectedRoleLabel}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 bg-white dark:bg-slate-950 shadow-md border-2 border-gray-300 dark:border-gray-700">
          <Command>
            <CommandInput placeholder="Search roles..." className="text-black dark:text-white" />
            <CommandEmpty className="text-black dark:text-white">No role found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {popularRoles.map((role) => (
                <CommandItem
                  key={role.value}
                  value={role.value}
                  onSelect={(value) => {
                    // Make sure we're selecting a valid value
                    const selectedValue = value || role.value;
                    onRoleSelect(selectedValue);
                    setOpen(false);
                  }}
                  className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedRole === role.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {role.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
