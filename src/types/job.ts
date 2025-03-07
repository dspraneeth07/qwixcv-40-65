
export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  date: string;
  url: string;
  tags?: string[];
  salary?: string;
}

export interface JobFilter {
  jobType?: string;
  experience?: string[];
  datePosted?: string;
  remote?: boolean;
  keywordMatch?: string[]; // Added for matching with resume skills
  employmentType?: string; // Added to match FindWork API parameter
  salary?: string; // Added for filtering by salary range
}
