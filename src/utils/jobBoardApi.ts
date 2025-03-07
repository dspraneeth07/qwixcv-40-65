import { JobListing } from "@/types/job";

// API key for RapidAPI - Indeed API
const RAPID_API_KEY = "9515e48d1bmsh7a2462135b3d8e9p1755e7jsn7759e1a20e89";
const RAPID_API_HOST = "indeed12.p.rapidapi.com";

interface JobSearchParams {
  query?: string;
  location?: string;
  page?: number;
  remote?: boolean;
  employment_type?: string;
  experience?: string;
}

// Function to generate mock job listings when API fails
const generateMockJobs = (query: string, location: string, count: number = 20): JobListing[] => {
  console.log(`Generating ${count} mock job listings for ${query} in ${location}`);
  
  const companies = [
    "Tech Innovations Inc", "Digital Solutions", "Global Software", "Data Systems Ltd", 
    "Cloud Computing Co", "AI Solutions", "DevOps Experts", "Mobile Development",
    "Web Solutions Inc", "Fintech Innovators", "Healthcare IT", "Enterprise Systems",
    "Security Solutions", "Network Systems", "Blockchain Tech", "E-commerce Solutions",
    "IoT Platforms", "Quantum Computing", "CRM Specialists", "AR/VR Technologies"
  ];
  
  const titles = [
    "Senior Developer", "Full Stack Engineer", "Frontend Developer", "Backend Engineer",
    "DevOps Specialist", "Product Manager", "UX Designer", "System Architect",
    "Data Scientist", "AI Engineer", "Cloud Architect", "Mobile Developer",
    "SRE Engineer", "QA Specialist", "Project Manager", "Scrum Master",
    "Technical Lead", "CTO", "IT Manager", "Software Engineer"
  ];
  
  const skills = [
    "React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "Kubernetes",
    "GraphQL", "REST API", "CI/CD", "MongoDB", "SQL", "Java", "C#", ".NET",
    "Vue.js", "Angular", "Flutter", "Swift", "Kotlin", "Go", "Ruby on Rails",
    "PHP", "Laravel", "Django", "Express.js", "Spring Boot", "Microservices"
  ];
  
  const jobs: JobListing[] = [];
  
  // Using the query to influence job generation
  const queryLower = query.toLowerCase();
  const isFrontend = queryLower.includes("front") || queryLower.includes("ui") || queryLower.includes("ux");
  const isBackend = queryLower.includes("back") || queryLower.includes("server") || queryLower.includes("api");
  const isFullStack = queryLower.includes("full") || queryLower.includes("stack");
  const isDevOps = queryLower.includes("devops") || queryLower.includes("sre") || queryLower.includes("ops");
  const isManagement = queryLower.includes("manage") || queryLower.includes("lead") || queryLower.includes("director");
  
  for (let i = 0; i < count; i++) {
    // Select title based on query
    let title = "";
    if (isFrontend) {
      title = titles.filter(t => t.includes("Frontend") || t.includes("UX") || t.includes("UI"))[0] || "Frontend Developer";
    } else if (isBackend) {
      title = titles.filter(t => t.includes("Backend") || t.includes("System"))[0] || "Backend Engineer";
    } else if (isFullStack) {
      title = titles.filter(t => t.includes("Full") || t.includes("Stack"))[0] || "Full Stack Developer";
    } else if (isDevOps) {
      title = titles.filter(t => t.includes("DevOps") || t.includes("SRE"))[0] || "DevOps Engineer";
    } else if (isManagement) {
      title = titles.filter(t => t.includes("Manager") || t.includes("Lead") || t.includes("CTO"))[0] || "Technical Lead";
    } else {
      title = titles[Math.floor(Math.random() * titles.length)];
    }
    
    // Select relevant skills based on title
    let relevantSkills: string[] = [];
    if (title.includes("Frontend")) {
      relevantSkills = skills.filter(s => ["React", "Vue.js", "Angular", "TypeScript", "HTML", "CSS"].includes(s));
    } else if (title.includes("Backend")) {
      relevantSkills = skills.filter(s => ["Node.js", "Python", "Java", "SQL", "MongoDB", "Express.js"].includes(s));
    } else if (title.includes("Full Stack")) {
      relevantSkills = skills.filter(s => ["React", "Node.js", "TypeScript", "MongoDB", "REST API", "GraphQL"].includes(s));
    } else if (title.includes("DevOps")) {
      relevantSkills = skills.filter(s => ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Ansible"].includes(s));
    } else {
      relevantSkills = skills.sort(() => 0.5 - Math.random()).slice(0, 5);
    }
    
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const selectedSkills = relevantSkills.slice(0, 5 + Math.floor(Math.random() * 5));
    
    // Generate random salary range
    const baseSalary = 70000 + Math.floor(Math.random() * 100000);
    const maxSalary = baseSalary + 20000 + Math.floor(Math.random() * 50000);
    
    jobs.push({
      id: `job-${Math.random().toString(36).substring(7)}`,
      title: title,
      company: randomCompany,
      location: location || "Remote",
      description: `We are seeking a talented ${title} to join our team at ${randomCompany}. The ideal candidate will have expertise in ${selectedSkills.join(", ")}. This role will involve developing and maintaining applications, collaborating with cross-functional teams, and implementing best practices.`,
      date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      url: "https://example.com/job",
      tags: selectedSkills,
      salary: `$${(baseSalary / 1000).toFixed(0)}k - $${(maxSalary / 1000).toFixed(0)}k`,
      platform: 'indeed'
    });
  }
  
  return jobs;
};

// Function to search for jobs using the Indeed API
export const fetchJobs = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    const query = params.query || "developer";
    const location = params.location || "";
    const page = params.page || 1;
    
    console.log(`Fetching jobs from Indeed API for: ${query} in ${location}`);
    
    const url = `https://indeed12.p.rapidapi.com/jobs/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&page_id=${page}&locality=us`;
    
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': RAPID_API_HOST,
        'x-rapidapi-key': RAPID_API_KEY
      }
    });

    if (!response.ok) {
      console.error(`Indeed API error with status: ${response.status}`);
      
      // If API fails with rate limiting (429) or other errors, return mock data
      return generateMockJobs(query, location);
    }

    const data = await response.json();
    console.log("Indeed API response:", data);
    
    if (!data.hits || data.hits.length === 0) {
      // If no results, return mock data
      return generateMockJobs(query, location);
    }
    
    return data.hits.map((job: any) => ({
      id: job.job_id || `job-${Math.random().toString(36).substring(7)}`,
      title: job.job_title || "Job Position",
      company: job.company_name || "Company",
      location: job.job_location || params.location || "Remote",
      description: job.job_description || "No description available",
      date: job.job_posted_at_datetime_utc || new Date().toISOString(),
      url: job.job_apply_link || "https://indeed.com",
      tags: job.job_required_skills?.split(",") || [],
      salary: job.job_min_salary ? `$${job.job_min_salary} - $${job.job_max_salary}` : "Not specified",
      platform: 'indeed'
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    // Return mock data in case of any error
    return generateMockJobs(params.query || "developer", params.location || "");
  }
};

// Function to get job details
export const getJobDetails = async (jobId: string): Promise<any> => {
  try {
    const url = `https://indeed12.p.rapidapi.com/job/${jobId}?locality=us`;
    console.log("Fetching job details from:", url);
    
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': RAPID_API_HOST,
        'x-rapidapi-key': RAPID_API_KEY
      }
    });

    if (!response.ok) {
      console.error(`Job details API error with status: ${response.status}`);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log("Job details response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw error;
  }
};

// Get company details
export const getCompanyDetails = async (companyName: string): Promise<any> => {
  try {
    const url = `https://indeed12.p.rapidapi.com/company/${encodeURIComponent(companyName)}?locality=us`;
    console.log("Fetching company details from:", url);
    
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': RAPID_API_HOST,
        'x-rapidapi-key': RAPID_API_KEY
      }
    });

    if (!response.ok) {
      console.error(`Company details API error with status: ${response.status}`);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log("Company details response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching company details:", error);
    throw error;
  }
};

// Search for companies
export const searchCompanies = async (companyName: string): Promise<any> => {
  try {
    const url = `https://indeed12.p.rapidapi.com/companies/search?company_name=${encodeURIComponent(companyName)}&locality=us`;
    console.log("Searching companies from:", url);
    
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': RAPID_API_HOST,
        'x-rapidapi-key': RAPID_API_KEY
      }
    });

    if (!response.ok) {
      console.error(`Company search API error with status: ${response.status}`);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log("Company search response:", data);
    return data;
  } catch (error) {
    console.error("Error searching companies:", error);
    throw error;
  }
};

// Get company jobs
export const getCompanyJobs = async (companyName: string, start: number = 1): Promise<any> => {
  try {
    const url = `https://indeed12.p.rapidapi.com/company/${encodeURIComponent(companyName)}/jobs?locality=us&start=${start}`;
    console.log("Fetching company jobs from:", url);
    
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': RAPID_API_HOST,
        'x-rapidapi-key': RAPID_API_KEY
      }
    });

    if (!response.ok) {
      console.error(`Company jobs API error with status: ${response.status}`);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log("Company jobs response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching company jobs:", error);
    throw error;
  }
};

// Create a function to get job recommendations based on resume skills
export const getJobRecommendations = async (skills: string[], jobTitle: string, location?: string): Promise<JobListing[]> => {
  // Extract keywords from skills
  const skillsArray = Array.isArray(skills) ? 
    skills : 
    Object.values(skills).filter(Boolean) as string[];
  
  // Use job title as primary search and supplement with top skills
  const searchQuery = jobTitle || skillsArray.slice(0, 3).join(" ");
  
  try {
    console.log(`Getting job recommendations for query: ${searchQuery}`);
    
    // Do a regular search using the most relevant skills or job title
    const jobs = await fetchJobs({
      query: searchQuery,
      location: location,
      page: 1
    });
    
    if (jobs.length === 0) {
      return generateMockJobs(searchQuery, location || "", 10);
    }
    
    return jobs;
  } catch (error) {
    console.error("Error fetching job recommendations:", error);
    return generateMockJobs(searchQuery, location || "", 10);
  }
};
