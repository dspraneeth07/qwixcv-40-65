
import { JobListing } from "@/types/job";

// Using the FindWork.dev API
const API_URL = "https://findwork.dev/api/jobs/";
// Using the provided API key
const API_KEY = "5f58f90d8f7cf996bfb59b82141c2020c107a88a";

interface JobSearchParams {
  query?: string;
  location?: string;
  page?: number;
  remote?: boolean;
  employment_type?: string;
  experience?: string;
}

export const fetchJobs = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.append('search', params.query);
    if (params.location) queryParams.append('location', params.location);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.remote) queryParams.append('remote', 'true');
    if (params.employment_type) queryParams.append('employment_type', params.employment_type);
    if (params.experience) queryParams.append('experience', params.experience);
    
    const response = await fetch(`${API_URL}?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Token ${API_KEY}`
      }
    });
    
    if (!response.ok) {
      console.error(`API error with status: ${response.status}`);
      // Fallback to mock data if API fails
      return generateMockJobs(params);
    }
    
    const data = await response.json();
    return data.results.map((job: any) => ({
      id: job.id.toString(),
      title: job.role,
      company: job.company_name,
      location: job.location || "Remote",
      description: job.text,
      date: job.date_posted,
      url: job.url,
      tags: job.keywords || [],
      salary: job.salary || "Not specified"
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    // Fallback to mock data if API fails
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
    
    return {
      id: `job-${i + 1}`,
      title: jobTitles[titleIndex],
      company: companies[companyIndex],
      location: locations[locationIndex],
      description: descriptions[descIndex],
      date: randomDate.toISOString(),
      url: "https://example.com/job-application",
      tags: tags[tagIndex],
      salary: salaries[salaryIndex]
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
