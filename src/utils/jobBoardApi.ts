
import { JobListing } from "@/types/job";

// API key for FindWork.dev
const FINDWORK_API_KEY = "5f58f90d8f7cf996bfb59b82141c2020c107a88a";

interface JobSearchParams {
  query?: string;
  location?: string;
  page?: number;
  remote?: boolean;
  employment_type?: string;
  experience?: string;
}

// Function to search for jobs using the FindWork.dev API
export const fetchJobs = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    const query = params.query || "";
    const location = params.location || "";
    const page = params.page || 1;
    
    let url = `https://findwork.dev/api/jobs/`;
    
    // Add query parameters if they exist
    const queryParams = new URLSearchParams();
    if (query) queryParams.append("search", query);
    if (location) queryParams.append("location", location);
    if (params.remote) queryParams.append("remote", "true");
    if (page > 1) queryParams.append("page", page.toString());
    
    const finalUrl = `${url}?${queryParams.toString()}`;
    
    console.log("Fetching jobs from FindWork API:", finalUrl);
    
    const response = await fetch(finalUrl, {
      headers: {
        'Authorization': `Token ${FINDWORK_API_KEY}`
      }
    });

    if (!response.ok) {
      console.error(`FindWork API error with status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.log("No results from FindWork API");
      return [];
    }
    
    return data.results.map((job: any) => ({
      id: job.id || `findwork-${Math.random().toString(36).substring(7)}`,
      title: job.role || "Job Position",
      company: job.company_name || "Company",
      location: job.location || "Remote",
      description: job.text || "No description available",
      date: job.date_posted || new Date().toISOString(),
      url: job.url || "https://findwork.dev",
      tags: job.keywords || [],
      salary: job.salary || "Not specified",
      platform: 'findwork'
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

// Function to get job recommendations based on resume skills
export const getJobRecommendations = async (skills: string[], jobTitle: string, location?: string): Promise<JobListing[]> => {
  // Extract keywords from skills
  const skillsArray = skills.filter(skill => skill.length > 3);
  
  // Use job title as primary search and supplement with top skills
  const searchQuery = jobTitle || skillsArray.slice(0, 3).join(" ");
  
  try {
    // Do a regular search with the job title or skills
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
