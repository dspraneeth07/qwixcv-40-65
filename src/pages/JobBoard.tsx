
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
  Filter
} from "lucide-react";
import { fetchJobs } from "@/utils/jobBoardApi";
import JobSearchFilters from "@/components/jobs/JobSearchFilters";
import { JobListing } from "@/types/job";

const JobBoard = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadJobs();
  }, [currentPage]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const jobData = await fetchJobs({
        query: searchTerm,
        location: location,
        page: currentPage
      });
      setJobs(jobData);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadJobs();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Find Your Next Opportunity</h1>
          <p className="text-muted-foreground">Browse job listings and apply with your resume</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <JobSearchFilters 
                    onFilterChange={(filters) => console.log("Filters changed:", filters)} 
                  />
                  <Button 
                    variant="ats" 
                    className="w-full mt-4"
                    onClick={handleSearch}
                  >
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <div className="relative flex-1">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Location"
                      className="pl-8"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
              </div>
              <Button variant="ats" onClick={handleSearch}>
                Search Jobs
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <Card key={index}>
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
            ) : (
              <>
                {jobs.length === 0 ? (
                  <Card className="p-6">
                    <div className="text-center py-12">
                      <h2 className="font-medium text-xl mb-2">No jobs found</h2>
                      <p className="text-muted-foreground">Try adjusting your search criteria or location</p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <Card key={job.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <div className="flex flex-wrap text-muted-foreground text-sm gap-3 mt-1">
                            <div className="flex items-center">
                              <Building className="h-3.5 w-3.5 mr-1" />
                              {job.company}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              Posted {formatDate(job.date)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm line-clamp-3">{job.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.tags?.map((tag, index) => (
                              <span 
                                key={index} 
                                className="text-xs bg-slate-100 px-2 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <span className="text-sm font-medium">
                            {job.salary ? job.salary : 'Salary not specified'}
                          </span>
                          <a 
                            href={job.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex"
                          >
                            <Button variant="outline" size="sm" className="gap-1">
                              Apply Now
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline" 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center text-sm">
                    Page {currentPage}
                  </span>
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={jobs.length === 0}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobBoard;
