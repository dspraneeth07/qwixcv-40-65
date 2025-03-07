
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
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.hits || data.hits.length === 0) {
      return [];
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
    throw error;
  }
};

// Function to get job details
export const getJobDetails = async (jobId: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://indeed12.p.rapidapi.com/job/${jobId}?locality=us`,
      {
        headers: {
          'x-rapidapi-host': RAPID_API_HOST,
          'x-rapidapi-key': RAPID_API_KEY
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

// Get company details
export const getCompanyDetails = async (companyName: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://indeed12.p.rapidapi.com/company/${encodeURIComponent(companyName)}?locality=us`,
      {
        headers: {
          'x-rapidapi-host': RAPID_API_HOST,
          'x-rapidapi-key': RAPID_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error(`Company details API error with status: ${response.status}`);
      throw new Error(`API returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching company details:", error);
    throw error;
  }
};

// Search for companies
export const searchCompanies = async (companyName: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://indeed12.p.rapidapi.com/companies/search?company_name=${encodeURIComponent(companyName)}&locality=us`,
      {
        headers: {
          'x-rapidapi-host': RAPID_API_HOST,
          'x-rapidapi-key': RAPID_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error(`Company search API error with status: ${response.status}`);
      throw new Error(`API returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching companies:", error);
    throw error;
  }
};

// Get company jobs
export const getCompanyJobs = async (companyName: string, start: number = 1): Promise<any> => {
  try {
    const response = await fetch(
      `https://indeed12.p.rapidapi.com/company/${encodeURIComponent(companyName)}/jobs?locality=us&start=${start}`,
      {
        headers: {
          'x-rapidapi-host': RAPID_API_HOST,
          'x-rapidapi-key': RAPID_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error(`Company jobs API error with status: ${response.status}`);
      throw new Error(`API returned ${response.status}`);
    }

    return await response.json();
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
