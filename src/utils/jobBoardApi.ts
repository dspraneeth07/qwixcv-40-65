
import { JobListing } from "@/types/job";

// API key for FindWork
const FINDWORK_API_KEY = "5f58f90d8f7cf996bfb59b82141c2020c107a88a";

interface JobSearchParams {
  query?: string;
  location?: string;
  page?: number;
  remote?: boolean;
  employment_type?: string;
  experience?: string;
}

// Function to search for jobs using the FindWork API
export const fetchJobs = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    const query = params.query || "";
    console.log(`Fetching jobs from FindWork API: https://findwork.dev/api/jobs/?search=${encodeURIComponent(query)}`);
    
    const url = `https://findwork.dev/api/jobs/?search=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Token ${FINDWORK_API_KEY}`
      }
    });

    if (!response.ok) {
      console.error(`FindWork API error with status: ${response.status}`);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return [];
    }
    
    return data.results.map((job: any) => ({
      id: job.id || `job-${Math.random().toString(36).substring(7)}`,
      title: job.role || "Job Position",
      company: job.company_name || "Company",
      location: job.location || params.location || "Remote",
      description: job.text || "No description available",
      date: job.date_posted || new Date().toISOString(),
      url: job.url || job.apply_url || "https://findwork.dev",
      tags: job.keywords || [],
      salary: job.salary || "Not specified",
      platform: 'indeed' // We'll keep this as 'indeed' to maintain compatibility
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Function to get job details
export const getJobDetails = async (jobId: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://findwork.dev/api/jobs/${jobId}/`,
      {
        headers: {
          'Authorization': `Token ${FINDWORK_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      console.error(`Job details API error with status: ${response.status}`);
      throw new Error(`API returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching job details:", error);
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
