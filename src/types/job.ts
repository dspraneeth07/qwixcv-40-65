
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
  platform: 'indeed' | 'upwork' | 'linkedin' | 'other'; // Added platform field
}

export interface JobFilter {
  jobType?: string;
  experience?: string[];
  datePosted?: string;
  remote?: boolean;
  keywordMatch?: string[]; // For matching with resume skills
  employmentType?: string; // For API parameter
  salary?: string; // For filtering by salary range
  platform?: 'indeed' | 'upwork' | 'linkedin' | 'all'; // Added platform filter
}
