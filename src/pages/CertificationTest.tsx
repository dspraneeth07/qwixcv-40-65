import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import QwiXCertHeader from '@/components/certification/QwiXCertHeader';
import MCQTest from '@/components/certification/MCQTest';
import TestResults from '@/components/certification/TestResults';
import CertificateGenerator from '@/components/certification/CertificateGenerator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Question, Certificate } from '@/types/certification';
import { useToast } from "@/components/ui/use-toast";
import { getMockTestById } from '@/utils/mockData';
import { Link } from 'react-router-dom';

enum TestStage {
  INTRO,
  TEST,
  RESULTS,
  CERTIFICATE
}

const CertificationTest = () => {
  const { testId = '' } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [stage, setStage] = useState<TestStage>(TestStage.INTRO);
  const [testData, setTestData] = useState<{
    id: string;
    title: string;
    description: string;
    timeLimit: number;
    passingScore: number;
    questions: Question[];
  } | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Get mock test data
    const fetchTest = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get mock test data
        const test = getMockTestById(testId);
        
        if (!test) {
          setError("Test not found");
          console.error(`Test with ID ${testId} not found`);
          return;
        }
        
        setTestData(test);
        console.log("Test data loaded:", test.title);
      } catch (err) {
        console.error("Failed to load test:", err);
        setError("Failed to load the test. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTest();
  }, [testId]);
  
  const handleStartTest = () => {
    setStage(TestStage.TEST);
  };
  
  const handleTestComplete = (testScore: number, testPassed: boolean, answers: Record<number, string>) => {
    setScore(testScore);
    setPassed(testPassed);
    setUserAnswers(answers);
    setStage(TestStage.RESULTS);
  };
  
  const handleCertificateGenerated = (newCertificate: Certificate) => {
    setCertificate(newCertificate);
    setStage(TestStage.CERTIFICATE);
    
    toast({
      title: "Certificate Generated",
      description: "Your blockchain certificate has been added to your profile.",
    });
    
    // In a real app, you would send this to your backend
    console.log("Certificate generated:", newCertificate);
  };
  
  const handleRetry = () => {
    navigate(0); // Refresh the page to reset the test
  };
  
  // ... keep existing code (loading state rendering)
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-10">
          <div className="flex justify-center items-center h-[300px]">
            <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !testData) {
    return (
      <MainLayout>
        <div className="container py-10">
          <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || "Test not found"}</AlertDescription>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/certification-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Certification Center
              </Link>
            </Button>
          </Alert>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-10">
        {stage === TestStage.INTRO && (
          // ... keep existing code (intro stage rendering)
          <>
            <QwiXCertHeader 
              title={testData.title} 
              subtitle="Complete this assessment to earn a blockchain-verified certificate"
            />
            
            <div className="max-w-3xl mx-auto">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium mb-4 text-blue-900">About This Test</h3>
                <p className="mb-4 text-blue-800">{testData.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Time Limit</p>
                    <p className="text-lg font-semibold">{testData.timeLimit} minutes</p>
                  </div>
                  <div className="bg-white p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Questions</p>
                    <p className="text-lg font-semibold">{testData.questions.length} multiple choice</p>
                  </div>
                  <div className="bg-white p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Passing Score</p>
                    <p className="text-lg font-semibold">{testData.passingScore}%</p>
                  </div>
                </div>
                
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Once you start the test, you'll have {testData.timeLimit} minutes to complete it. 
                    If you fail, you'll need to wait 24 hours before retaking the test.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    asChild
                  >
                    <Link to="/certification-center">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Link>
                  </Button>
                  
                  <Button 
                    onClick={handleStartTest}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  >
                    Start Test
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
        
        {stage === TestStage.TEST && testData && (
          <MCQTest 
            testId={testData.id}
            testTitle={testData.title}
            questions={testData.questions}
            timeLimit={testData.timeLimit}
            passingScore={testData.passingScore}
            onTestComplete={handleTestComplete}
          />
        )}
        
        {stage === TestStage.RESULTS && (
          <TestResults 
            testId={testData.id}
            testTitle={testData.title}
            score={score}
            passingScore={testData.passingScore}
            questions={testData.questions}
            userAnswers={userAnswers}
            onGenerate={() => setStage(TestStage.CERTIFICATE)}
            onRetry={handleRetry}
          />
        )}
        
        {stage === TestStage.CERTIFICATE && (
          <>
            {!certificate ? (
              <CertificateGenerator
                testId={testData.id}
                testTitle={testData.title}
                score={score}
                onComplete={handleCertificateGenerated}
              />
            ) : (
              <div className="text-center max-w-lg mx-auto">
                <h2 className="text-2xl font-bold mb-4">Certificate Created!</h2>
                <p className="mb-6">
                  Your certificate has been generated and securely stored on the blockchain.
                </p>
                <div className="flex justify-center gap-4">
                  <Button asChild>
                    <Link to={`/verify-cert/${certificate.certHash}`}>
                      View Certificate
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/certification-center">
                      Back to Certification Center
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default CertificationTest;
