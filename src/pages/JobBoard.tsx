
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Briefcase, 
  Building, 
  MapPin, 
  Calendar, 
  Search,
  ArrowUpRight,
  Filter,
  AlertCircle,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  ToggleRight
} from "lucide-react";
import { fetchJobs } from "@/utils/jobBoardApi";
import JobSearchFilters from "@/components/jobs/JobSearchFilters";
import { JobListing, JobFilter } from "@/types/job";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { recommendedJobs } from "@/data/recommendedJobs";
import { ScrollArea } from "@/components/ui/scroll-area";

const JobBoard = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("software developer");
  const [location, setLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showRecommended, setShowRecommended] = useState(false);
  const [activeFilters, setActiveFilters] = useState<JobFilter>({});

  useEffect(() => {
    if (showRecommended) {
      setJobs(recommendedJobs);
      setLoading(false);
      setError(null);
    } else {
      loadJobs();
    }
  }, [currentPage, showRecommended]);

  const loadJobs = async () => {
    if (showRecommended) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Always use a default search term to get results
      const query = searchTerm || "software developer";
      const jobData = await fetchJobs({
        query: query,
        location: location,
        page: currentPage,
        remote: activeFilters.remote,
        employment_type: activeFilters.employmentType,
      });
      
      if (jobData && jobData.length > 0) {
        setJobs(jobData);
      } else {
        // If no results, set a more user-friendly message
        setJobs([]);
        toast({
          title: "No jobs found",
          description: "Try adjusting your search criteria for better results.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
      setError("Failed to load jobs. Our servers might be busy, please try again in a moment.");
      toast({
        title: "Error loading jobs",
        description: "There was a problem loading job listings. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!showRecommended) {
      setCurrentPage(1);
      loadJobs();
    }
  };

  const handleFilterChange = (filters: JobFilter) => {
    console.log("Filter changed:", filters);
    setActiveFilters(filters);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    loadJobs();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) return "Today";
      if (diffDays <= 2) return "Yesterday";
      if (diffDays <= 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch (e) {
      return "Recently";
    }
  };

  const toggleRecommendedJobs = () => {
    setShowRecommended(prev => !prev);
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-indigo-600 to-purple-700 text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-bold tracking-tight mb-4 font-playfair">Find Your Next Opportunity</h1>
          <p className="text-indigo-100 text-lg font-poppins">
            Browse through thousands of jobs and apply with your QwiX CV resume
          </p>
        </div>
      </div>
      
      <div className="container py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8 -mt-16 relative z-10">
          <div className="flex-1 bg-white rounded-xl shadow-xl p-3 flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
              <Input
                type="text"
                placeholder="Job title, keywords, or company"
                className="pl-10 h-12 font-poppins border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={showRecommended}
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
              <Input
                type="text"
                placeholder="Location"
                className="pl-10 h-12 font-poppins border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={showRecommended}
              />
            </div>
            <Button 
              size="lg"
              onClick={handleSearch}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 font-poppins"
              disabled={showRecommended}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-6 shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center font-playfair">
                  <Filter className="h-5 w-5 mr-2" />
                  Refine Search
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4 font-poppins">
                  <div className="flex items-center gap-2">
                    <ToggleRight className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm font-medium">Show Recommended Jobs</span>
                  </div>
                  <Switch 
                    checked={showRecommended} 
                    onCheckedChange={toggleRecommendedJobs}
                  />
                </div>
                
                <div className="font-poppins">
                  <JobSearchFilters 
                    onFilterChange={handleFilterChange}
                    disabled={showRecommended}
                  />
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    onClick={handleApplyFilters}
                    disabled={showRecommended}
                  >
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <ScrollArea className="h-[calc(100vh-240px)]">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <Skeleton className="h-6 w-2/3" />
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <div className="flex space-x-2 pt-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <Card className="border-0 shadow-lg p-6 text-center bg-white">
                  <div className="py-12">
                    <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                      <AlertCircle className="h-12 w-12 text-orange-500" />
                    </div>
                    <h2 className="font-medium text-2xl mb-3 font-playfair">Error Loading Jobs</h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto font-poppins">{error}</p>
                    <Button 
                      onClick={loadJobs} 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-poppins"
                    >
                      Try Again
                    </Button>
                  </div>
                </Card>
              ) : (
                <>
                  {jobs.length === 0 ? (
                    <Card className="border-0 shadow-lg p-6 text-center bg-white">
                      <div className="py-12">
                        <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                          <Briefcase className="h-12 w-12 text-indigo-500" />
                        </div>
                        <h2 className="font-medium text-2xl mb-3 font-playfair">No jobs found</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto font-poppins">
                          Try adjusting your search criteria or location to find more opportunities
                        </p>
                        <Button 
                          onClick={() => {
                            setSearchTerm("software developer");
                            setLocation("");
                            setActiveFilters({});
                            handleSearch();
                          }} 
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-poppins"
                        >
                          Reset Search
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <Card key={job.id} className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                          <CardHeader className="pb-2 pt-5">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-xl font-playfair text-indigo-900">{job.title}</CardTitle>
                                <div className="flex flex-wrap text-gray-600 text-sm gap-3 mt-1 font-poppins">
                                  <div className="flex items-center">
                                    <Building className="h-3.5 w-3.5 mr-1 text-indigo-500" />
                                    {job.company}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-3.5 w-3.5 mr-1 text-indigo-500" />
                                    {job.location}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1 text-indigo-500" />
                                    Posted {formatDate(job.date)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-indigo-900 font-poppins">
                                  {job.salary ? job.salary : 'Salary not specified'}
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm line-clamp-3 text-gray-700 font-poppins">{job.description}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {job.tags?.map((tag, index) => (
                                <span 
                                  key={index} 
                                  className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-poppins"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between pt-0 pb-5">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-1 text-indigo-500" />
                              <Link 
                                to="/builder" 
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-poppins"
                              >
                                Create Resume
                              </Link>
                            </div>
                            <a 
                              href={job.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex"
                            >
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white gap-1 rounded-full font-poppins"
                              >
                                Apply Now
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Button>
                            </a>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}

                  {!showRecommended && jobs.length > 0 && (
                    <div className="flex justify-between items-center mt-8 font-poppins">
                      <Button 
                        variant="outline" 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="flex items-center gap-1 border border-indigo-200 hover:bg-indigo-50"
                      >
                        <ChevronLeft className="h-4 w-4" /> 
                        Previous
                      </Button>
                      <span className="flex items-center text-sm bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full">
                        Page {currentPage}
                      </span>
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={jobs.length === 0}
                        className="flex items-center gap-1 border border-indigo-200 hover:bg-indigo-50"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobBoard;
