
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, Scan, BarChart3, Award, Briefcase, Clock, Shield, Calendar, 
  Send, CheckCircle, ChevronRight, RefreshCw, QrCode 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useBlockchain } from "@/context/BlockchainContext";
import QwixVaultProfile from "@/components/blockchain/QwixVaultProfile";
import type { Certificate } from '@/types/certification';
import type { BlockchainDocument } from '@/types/blockchain';

const Dashboard = () => {
  const { user } = useAuth();
  const { isConnected, account, getUserDocuments, getUserCertificates } = useBlockchain();
  const [documents, setDocuments] = useState<BlockchainDocument[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        if (isConnected) {
          // Get user documents from blockchain vault
          const userDocuments = await getUserDocuments();
          setDocuments(userDocuments);
          
          // Get user certificates
          const userCertificates = await getUserCertificates();
          setCertificates(userCertificates);
        } else {
          // If not connected, clear data
          setDocuments([]);
          setCertificates([]);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [isConnected, getUserDocuments, getUserCertificates]);

  // Refresh user data
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      
      if (isConnected) {
        // Get user documents from blockchain vault
        const userDocuments = await getUserDocuments();
        setDocuments(userDocuments);
        
        // Get user certificates
        const userCertificates = await getUserCertificates();
        setCertificates(userCertificates);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || "User"}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh Data
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="certificates">
                  <Award className="h-4 w-4 mr-2" />
                  Certificates
                </TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Resume Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">78%</div>
                      <p className="text-xs text-muted-foreground mt-1">+12% from last update</p>
                      <Progress value={78} className="h-1.5 mt-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Blockchain Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{documents.length}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Verified & secured credentials
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Certificates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{certificates.length}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Blockchain-verified achievements
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent actions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Show certificates as activity */}
                      {certificates.slice(0, 3).map(certificate => (
                        <div key={certificate.id} className="flex items-start gap-3 pb-3 border-b">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Award className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Certificate Earned</p>
                            <p className="text-sm text-muted-foreground">
                              {certificate.title} - Score: {certificate.score}%
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(certificate.issuedDate)}
                            </p>
                          </div>
                          <Badge variant="outline" className="ml-auto mt-2">
                            Certificate
                          </Badge>
                        </div>
                      ))}
                      
                      {/* Show documents as activity */}
                      {documents.slice(0, 2).map(document => (
                        <div key={document.uniqueId} className="flex items-start gap-3 pb-3 border-b">
                          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Document Secured</p>
                            <p className="text-sm text-muted-foreground">
                              {document.fileName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(document.timestamp)}
                            </p>
                          </div>
                          <Badge variant="outline" className="ml-auto mt-2">
                            Blockchain
                          </Badge>
                        </div>
                      ))}
                      
                      {/* Placeholder activities */}
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
                          <Scan className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Resume ATS Scan</p>
                          <p className="text-sm text-muted-foreground">
                            Your resume scored 78% ATS compatibility
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            3 days ago
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-auto mt-2">
                          ATS
                        </Badge>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                          <Send className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Resume Shared</p>
                          <p className="text-sm text-muted-foreground">
                            You shared your resume with TechCorp Inc.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            1 week ago
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-auto mt-2">
                          Share
                        </Badge>
                      </div>
                    </div>
                    
                    {certificates.length === 0 && documents.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No recent activities found</p>
                        <Button variant="link" asChild>
                          <Link to="/builder">
                            Start building your career profile
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link to="/builder" className="group">
                        <div className="border rounded-lg p-4 transition-all hover:border-primary hover:bg-primary/5">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium group-hover:text-primary">Build Resume</h3>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Create or edit your professional resume
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </div>
                      </Link>
                      
                      <Link to="/ats-scanner" className="group">
                        <div className="border rounded-lg p-4 transition-all hover:border-primary hover:bg-primary/5">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Scan className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium group-hover:text-primary">ATS Scanner</h3>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Check resume compatibility with ATS
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </div>
                      </Link>
                      
                      <Link to="/job-board" className="group">
                        <div className="border rounded-lg p-4 transition-all hover:border-primary hover:bg-primary/5">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium group-hover:text-primary">Find Jobs</h3>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Browse matching job opportunities
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </div>
                      </Link>
                      
                      <Link to="/certification-center" className="group">
                        <div className="border rounded-lg p-4 transition-all hover:border-primary hover:bg-primary/5">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Award className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium group-hover:text-primary">Get Certified</h3>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Earn blockchain-verified certificates
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Secured Documents</CardTitle>
                      <CardDescription>
                        Documents secured in your QwixVault
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/blockchain-vault">
                        <QrCode className="mr-2 h-4 w-4" />
                        Open Vault
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                      </div>
                    ) : documents.length > 0 ? (
                      <div className="space-y-4">
                        {documents.map(document => (
                          <div key={document.uniqueId} className="flex items-center gap-4 border-b pb-4">
                            <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded">
                              <FileText className="h-6 w-6 text-gray-500" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium truncate">{document.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                ID: {document.uniqueId.substring(0, 10)}... • 
                                {" "}{formatDate(document.timestamp)}
                              </p>
                            </div>
                            <Link to={`/verify-document/${document.uniqueId}`}>
                              <Button size="sm" variant="ghost">
                                <Shield className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Documents Yet</h3>
                        <p className="text-muted-foreground mt-1 mb-6">
                          Secure your important documents with blockchain verification
                        </p>
                        <Button asChild>
                          <Link to="/blockchain-vault">Add Documents to Vault</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Certificates Tab */}
              <TabsContent value="certificates" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Blockchain Certificates</CardTitle>
                      <CardDescription>
                        Your verified skills and achievements
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/certification-center">
                        <Award className="mr-2 h-4 w-4" />
                        Get Certified
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                      </div>
                    ) : certificates.length > 0 ? (
                      <div className="space-y-4">
                        {certificates.map(cert => (
                          <div key={cert.id} className="flex items-start gap-4 border-b pb-4">
                            <div className="h-16 w-16 bg-primary/10 flex items-center justify-center rounded-lg">
                              <Award className="h-8 w-8 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{cert.title}</p>
                                <Badge variant="secondary" className="ml-2">
                                  Score: {cert.score}%
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Issued: {formatDate(cert.issuedDate)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Certificate ID: {cert.certHash.substring(0, 10)}...
                              </p>
                            </div>
                            <Link to={`/verify-cert/${cert.certHash}`}>
                              <Button size="sm" variant="ghost">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Certificates Yet</h3>
                        <p className="text-muted-foreground mt-1 mb-6">
                          Take certification tests to earn blockchain-verified credentials
                        </p>
                        <Button asChild>
                          <Link to="/certification-center">Take a Certification</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <QwixVaultProfile />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 text-orange-800 h-10 w-10 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Resume Review</p>
                      <p className="text-xs text-muted-foreground">Due in 2 days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 text-emerald-800 h-10 w-10 rounded-full flex items-center justify-center">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">TechCorp Application</p>
                      <p className="text-xs text-muted-foreground">Due in 1 week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Recommended Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">React.js</span>
                  <Badge variant="outline">Trending</Badge>
                </div>
                <Progress value={65} className="h-1.5" />
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm">TypeScript</span>
                  <Badge variant="outline">In Demand</Badge>
                </div>
                <Progress value={40} className="h-1.5" />
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm">Blockchain</span>
                  <Badge variant="outline">Emerging</Badge>
                </div>
                <Progress value={25} className="h-1.5" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
