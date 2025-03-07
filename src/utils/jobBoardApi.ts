import { JobListing } from "@/types/job";

// API key for Indeed
const RAPID_API_KEY = "9515e48d1bmsh7a2462135b3d8e9p1755e7jsn7759e1a20e89";

interface JobSearchParams {
  query?: string;
  location?: string;
  page?: number;
  remote?: boolean;
  employment_type?: string;
  experience?: string;
}

// Function to search for jobs using the Indeed API
export const fetchJobs = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    const query = params.query || "";
    const location = params.location || "us";
    const page = params.page || 1;
    
    const url = `https://indeed12.p.rapidapi.com/jobs/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&page_id=${page}&locality=us`;
    
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': 'indeed12.p.rapidapi.com',
        'x-rapidapi-key': RAPID_API_KEY
      }
    });

    if (!response.ok) {
      console.error(`Indeed API error with status: ${response.status}`);
      return generateMockJobs(params);
    }

    const data = await response.json();
    
    if (!data.hits || data.hits.length === 0) {
      return generateMockJobs(params);
    }
    
    return data.hits.map((job: any) => ({
      id: job.id || `indeed-${Math.random().toString(36).substring(7)}`,
      title: job.title || "Job Position",
      company: job.company || "Company",
      location: job.location || location,
      description: job.snippet || "No description available",
      date: job.posted_at || new Date().toISOString(),
      url: job.url || "https://indeed.com",
      tags: job.tags || [],
      salary: job.salary || "Not specified",
      platform: 'indeed'
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return generateMockJobs(params);
  }
};

// Function to get job details
export const getJobDetails = async (jobId: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://indeed12.p.rapidapi.com/job/${jobId}?locality=us`,
      {
        headers: {
          'x-rapidapi-host': 'indeed12.p.rapidapi.com',
          'x-rapidapi-key': RAPID_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error(`Job details API error with status: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching job details:", error);
    return null;
  }
};

// Function to get company jobs
export const getCompanyJobs = async (companyName: string): Promise<JobListing[]> => {
  try {
    const response = await fetch(
      `https://indeed12.p.rapidapi.com/company/${encodeURIComponent(companyName)}/jobs?locality=us&start=1`,
      {
        headers: {
          'x-rapidapi-host': 'indeed12.p.rapidapi.com',
          'x-rapidapi-key': RAPID_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error(`Company jobs API error with status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (!data.jobs || data.jobs.length === 0) {
      return [];
    }
    
    return data.jobs.map((job: any) => ({
      id: job.id || `indeed-${Math.random().toString(36).substring(7)}`,
      title: job.title || "Job Position",
      company: companyName,
      location: job.location || "Not specified",
      description: job.snippet || "No description available",
      date: job.posted_at || new Date().toISOString(),
      url: job.url || "https://indeed.com",
      tags: [],
      salary: job.salary || "Not specified",
      platform: 'indeed'
    }));
  } catch (error) {
    console.error("Error fetching company jobs:", error);
    return [];
  }
};

// Create a function to get job recommendations based on resume skills
export const getJobRecommendations = async (skills: string[], jobTitle: string, location?: string): Promise<JobListing[]> => {
  // Extract keywords from skills
  const skillsArray = skills.join(" ").split(/[,;]\s*|\s+/).filter(skill => skill.length > 3);
  
  // Use job title as primary search and supplement with top skills
  const searchQuery = jobTitle || skillsArray.slice(0, 3).join(" ");
  
  try {
    // Try to fetch company jobs if jobTitle contains a company name
    if (jobTitle && jobTitle.length > 3) {
      const companyJobs = await getCompanyJobs(jobTitle);
      if (companyJobs.length > 0) {
        return companyJobs;
      }
    }
    
    // Otherwise do a regular search
    return await fetchJobs({
      query: searchQuery,
      location: location,
      page: 1
    });
  } catch (error) {
    console.error("Error fetching job recommendations:", error);
    return [];
  }
};

// Mock data generation for development fallback
const generateMockJobs = (params: JobSearchParams): JobListing[] => {
  const jobTitles = [
    "Frontend Developer", "Backend Engineer", "Full Stack Developer", 
    "UX Designer", "Product Manager", "DevOps Engineer", "Data Scientist",
    "Mobile Developer", "QA Engineer", "Project Manager"
  ];
  
  const companies = [
    "TechCorp", "InnovateLabs", "CodeGenius", "DataSmart", 
    "CloudFlow", "DesignMasters", "AppNation", "SecureNet",
    "GrowthTech", "FutureWorks"
  ];
  
  const locations = [
    "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA",
    "Remote", "Boston, MA", "Chicago, IL", "Los Angeles, CA",
    "Portland, OR", "Denver, CO"
  ];
  
  const descriptions = [
    "We are looking for a talented developer to join our team. You'll be working on cutting-edge technologies to build innovative products.",
    "Join our team to work on challenging problems and deliver impactful solutions to our customers around the world.",
    "We're seeking an experienced professional to help us build and maintain our growing platform.",
    "Help us design and implement new features for our flagship product. Your contributions will directly impact thousands of users.",
    "Work with a cross-functional team to develop and maintain our suite of applications and services."
  ];
  
  const tags = [
    ["React", "JavaScript", "TypeScript", "HTML", "CSS"],
    ["Node.js", "Express", "MongoDB", "REST API"],
    ["Python", "Django", "PostgreSQL", "Docker"],
    ["AWS", "Kubernetes", "CI/CD", "Terraform"],
    ["React Native", "iOS", "Android", "Mobile"],
    ["UX/UI", "Figma", "Adobe XD", "Design Systems"],
    ["Product", "Agile", "Scrum", "JIRA"]
  ];
  
  const salaries = [
    "$80,000 - $100,000", "$90,000 - $120,000", "$100,000 - $130,000",
    "$120,000 - $150,000", "$150,000 - $180,000", "Competitive"
  ];

  // Filter based on search parameters
  let filteredJobs = Array(10).fill(0).map((_, i) => {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    
    const titleIndex = Math.floor(Math.random() * jobTitles.length);
    const companyIndex = Math.floor(Math.random() * companies.length);
    const locationIndex = Math.floor(Math.random() * locations.length);
    const descIndex = Math.floor(Math.random() * descriptions.length);
    const tagIndex = Math.floor(Math.random() * tags.length);
    const salaryIndex = Math.floor(Math.random() * salaries.length);
    
    return {
      id: `job-${i + 1}`,
      title: jobTitles[titleIndex],
      company: companies[companyIndex],
      location: locations[locationIndex],
      description: descriptions[descIndex],
      date: randomDate.toISOString(),
      url: "https://example.com/job-application",
      tags: tags[tagIndex],
      salary: salaries[salaryIndex],
      platform: 'indeed' as const
    };
  });
  
  // Simple search filtering
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(query) || 
      job.company.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query)
    );
  }
  
  if (params.location) {
    const location = params.location.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(location)
    );
  }
  
  // Pagination
  const page = params.page || 1;
  const pageSize = 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return filteredJobs.slice(startIndex, endIndex);
};
