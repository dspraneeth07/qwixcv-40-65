
import { JobListing } from "@/types/job";

// API keys for the different job platforms
const RAPID_API_KEY = "9515e48d1bmsh7a2462135b3d8e9p1755e7jsn7759e1a20e89";

interface JobSearchParams {
  query?: string;
  location?: string;
  page?: number;
  remote?: boolean;
  employment_type?: string;
  experience?: string;
  platform?: 'indeed' | 'upwork' | 'linkedin' | 'all';
}

// Function to fetch jobs from Indeed API
const fetchIndeedJobs = async (query: string, location?: string): Promise<JobListing[]> => {
  try {
    const company = query || "Software"; // Default to software jobs if no query
    const locality = location || "us"; // Default to US if no location

    const response = await fetch(
      `https://indeed12.p.rapidapi.com/company/${encodeURIComponent(company)}/jobs?locality=${encodeURIComponent(locality)}&start=1`,
      {
        headers: {
          'x-rapidapi-host': 'indeed12.p.rapidapi.com',
          'x-rapidapi-key': RAPID_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error(`Indeed API error with status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.jobs || []).map((job: any) => ({
      id: `indeed-${job.id || Math.random().toString(36).substring(7)}`,
      title: job.title || "Job Position",
      company: job.company || company,
      location: job.location || locality,
      description: job.description || "No description available",
      date: job.date || new Date().toISOString(),
      url: job.url || "https://indeed.com",
      tags: [],
      salary: job.salary || "Not specified",
      platform: 'indeed'
    }));
  } catch (error) {
    console.error("Error fetching Indeed jobs:", error);
    return [];
  }
};

// Function to fetch jobs from Upwork API
const fetchUpworkJobs = async (query: string, location?: string): Promise<JobListing[]> => {
  try {
    const search = query || "Web Developer";
    const locationFilter = location || "United States";

    const response = await fetch(
      `https://upwork-jobs-api2.p.rapidapi.com/active-freelance-7d?search=%22${encodeURIComponent(search)}%22&location_filter=%22${encodeURIComponent(locationFilter)}%22`,
      {
        headers: {
          'x-rapidapi-host': 'upwork-jobs-api2.p.rapidapi.com',
          'x-rapidapi-key': RAPID_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error(`Upwork API error with status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.jobs || []).map((job: any) => ({
      id: `upwork-${job.id || Math.random().toString(36).substring(7)}`,
      title: job.title || "Freelance Position",
      company: job.client?.company || "Upwork Client",
      location: job.client?.location || "Remote",
      description: job.description || "No description available",
      date: job.posted_at || new Date().toISOString(),
      url: job.url || "https://upwork.com",
      tags: [],
      salary: job.budget || "Not specified",
      platform: 'upwork'
    }));
  } catch (error) {
    console.error("Error fetching Upwork jobs:", error);
    return [];
  }
};

// Function to fetch jobs from LinkedIn API
const fetchLinkedInJobs = async (query?: string): Promise<JobListing[]> => {
  try {
    const response = await fetch(
      `https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h`,
      {
        headers: {
          'x-rapidapi-host': 'linkedin-job-search-api.p.rapidapi.com',
          'x-rapidapi-key': RAPID_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error(`LinkedIn API error with status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    // Filter by query if provided
    let jobs = data.jobs || [];
    if (query) {
      const queryLower = query.toLowerCase();
      jobs = jobs.filter((job: any) => 
        job.title?.toLowerCase().includes(queryLower) || 
        job.company?.toLowerCase().includes(queryLower) ||
        job.description?.toLowerCase().includes(queryLower)
      );
    }

    return jobs.map((job: any) => ({
      id: `linkedin-${job.id || Math.random().toString(36).substring(7)}`,
      title: job.title || "LinkedIn Position",
      company: job.company || "LinkedIn Employer",
      location: job.location || "Not specified",
      description: job.description || "No description available",
      date: job.posted_at || new Date().toISOString(),
      url: job.url || "https://linkedin.com/jobs",
      tags: [],
      salary: "Not specified",
      platform: 'linkedin'
    }));
  } catch (error) {
    console.error("Error fetching LinkedIn jobs:", error);
    return [];
  }
};

// Main function to fetch jobs from all platforms
export const fetchJobs = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    let jobs: JobListing[] = [];
    
    // Determine which platforms to fetch from
    const platform = params.platform || 'all';
    
    const promises: Promise<JobListing[]>[] = [];
    
    if (platform === 'indeed' || platform === 'all') {
      promises.push(fetchIndeedJobs(params.query || '', params.location));
    }
    
    if (platform === 'upwork' || platform === 'all') {
      promises.push(fetchUpworkJobs(params.query || '', params.location));
    }
    
    if (platform === 'linkedin' || platform === 'all') {
      promises.push(fetchLinkedInJobs(params.query));
    }
    
    // If all API calls fail, use mock data
    const results = await Promise.all(promises);
    jobs = results.flat();
    
    if (jobs.length === 0) {
      return generateMockJobs(params);
    }
    
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    // Fallback to mock data if API calls fail
    return generateMockJobs(params);
  }
};

// Create a function to get job recommendations based on resume skills
export const getJobRecommendations = async (skills: string[], jobTitle: string, location?: string): Promise<JobListing[]> => {
  // Extract keywords from skills
  const skillsArray = skills.join(" ").split(/[,;]\s*|\s+/).filter(skill => skill.length > 3);
  
  // Use job title as primary search and supplement with top skills
  const searchQuery = jobTitle || skillsArray.slice(0, 3).join(" ");
  
  try {
    return await fetchJobs({
      query: searchQuery,
      location: location,
      page: 1,
      remote: true
    });
  } catch (error) {
    console.error("Error fetching job recommendations:", error);
    return [];
  }
};

// Mock data generation for development
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

  const platforms = ['indeed', 'upwork', 'linkedin'] as const;

  // Filter based on search parameters
  let filteredJobs = Array(20).fill(0).map((_, i) => {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    
    const titleIndex = Math.floor(Math.random() * jobTitles.length);
    const companyIndex = Math.floor(Math.random() * companies.length);
    const locationIndex = Math.floor(Math.random() * locations.length);
    const descIndex = Math.floor(Math.random() * descriptions.length);
    const tagIndex = Math.floor(Math.random() * tags.length);
    const salaryIndex = Math.floor(Math.random() * salaries.length);
    const platformIndex = Math.floor(Math.random() * platforms.length);
    
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
      platform: platforms[platformIndex]
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

  if (params.platform && params.platform !== 'all') {
    filteredJobs = filteredJobs.filter(job => job.platform === params.platform);
  }
  
  // Pagination
  const page = params.page || 1;
  const pageSize = 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return filteredJobs.slice(startIndex, endIndex);
};
