
// Define types for career paths and nodes

export interface SkillRequirement {
  name: string;
  level: number; // 1-5 scale
}

export interface SkillGap {
  skill: string;
  suggestion: string;
  resourceUrl?: string; // Optional link to learning resource
}

export interface CareerNode {
  title: string;
  description: string;
  yearsFromNow: number; // Years from current position
  stage: "Entry" | "Mid" | "Senior" | "Lead" | "Executive";
  salaryRange: string;
  requiredSkills: SkillRequirement[];
  skillGaps?: SkillGap[]; // Skills to develop for this position
}

export interface CareerPath {
  type: "ambitious" | "skills" | "balanced";
  title: string;
  description: string;
  nodes: CareerNode[];
}
