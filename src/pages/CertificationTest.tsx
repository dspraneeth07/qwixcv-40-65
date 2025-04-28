
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle, XCircle, Clock, Award, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useBlockchain } from '@/context/BlockchainContext';
import { useAuth } from '@/context/AuthContext';

interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface TestData {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  timeLimit: number; // in minutes
  questions: TestQuestion[];
  passingScore: number; // percentage
}

const CertificationTest = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isConnected, connectWallet, generateCertificate, saveCertificateToVault } = useBlockchain();
  
  const [test, setTest] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  
  // Fetch test data
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        // In a real app, this would fetch from an API
        // For demo, we'll use mock data
        const mockTests: Record<string, TestData> = {
          "web-dev-basics": {
            id: "web-dev-basics",
            title: "Web Development Fundamentals",
            description: "Test your knowledge of HTML, CSS, and JavaScript fundamentals",
            category: "Web Development",
            difficulty: "Beginner",
            timeLimit: 15,
            passingScore: 70,
            questions: [
              {
                id: 1,
                question: "What does HTML stand for?",
                options: [
                  "Hyper Text Markup Language",
                  "High Tech Modern Language",
                  "Hyper Transfer Markup Language",
                  "Home Tool Markup Language"
                ],
                correctAnswer: 0
              },
              {
                id: 2,
                question: "Which property is used to change the background color in CSS?",
                options: [
                  "color",
                  "bgcolor",
                  "background-color",
                  "background"
                ],
                correctAnswer: 2
              },
              {
                id: 3,
                question: "Which JavaScript method is used to select an element by its id?",
                options: [
                  "querySelector()",
                  "getElement()",
                  "getElementById()",
                  "selectElement()"
                ],
                correctAnswer: 2
              },
              {
                id: 4,
                question: "Which CSS property is used to control the text size?",
                options: [
                  "text-style",
                  "font-size",
                  "text-size",
                  "font-style"
                ],
                correctAnswer: 1
              },
              {
                id: 5,
                question: "What is the correct way to create a JavaScript array?",
                options: [
                  "var colors = 'red', 'green', 'blue'",
                  "var colors = (1:'red', 2:'green', 3:'blue')",
                  "var colors = ['red', 'green', 'blue']",
                  "var colors = 'red' + 'green' + 'blue'"
                ],
                correctAnswer: 2
              }
            ]
          },
          "react-basics": {
            id: "react-basics",
            title: "React JS Foundations",
            description: "Essential concepts for React development",
            category: "Frontend Development",
            difficulty: "Intermediate",
            timeLimit: 20,
            passingScore: 75,
            questions: [
              {
                id: 1,
                question: "What is JSX in React?",
                options: [
                  "JavaScript XML - A syntax extension for JavaScript",
                  "JavaScript Extension - A programming language",
                  "Java Syntax Extension - A Java library",
                  "JavaScript Extra - A browser API"
                ],
                correctAnswer: 0
              },
              {
                id: 2,
                question: "Which hook is used to perform side effects in a function component?",
                options: [
                  "useEffect()",
                  "useState()",
                  "useContext()",
                  "useReducer()"
                ],
                correctAnswer: 0
              },
              {
                id: 3,
                question: "What is the correct way to update state in React?",
                options: [
                  "Directly modify the state variable",
                  "Use the this.state approach",
                  "Use the setState function",
                  "Call the updateState() method"
                ],
                correctAnswer: 2
              },
              {
                id: 4,
                question: "What is the virtual DOM in React?",
                options: [
                  "A browser extension for React",
                  "A lightweight copy of the actual DOM",
                  "A programming pattern",
                  "The browser's rendered DOM elements"
                ],
                correctAnswer: 1
              },
              {
                id: 5,
                question: "Which lifecycle method is called after a component renders?",
                options: [
                  "componentDidMount",
                  "componentWillRender",
                  "componentDidUpdate",
                  "componentWillLoad"
                ],
                correctAnswer: 0
              }
            ]
          },
          "blockchain-basics": {
            id: "blockchain-basics",
            title: "Blockchain Fundamentals",
            description: "Core concepts of blockchain technology and cryptocurrencies",
            category: "Blockchain",
            difficulty: "Intermediate",
            timeLimit: 25,
            passingScore: 80,
            questions: [
              {
                id: 1,
                question: "What is a blockchain?",
                options: [
                  "A centralized database managed by banks",
                  "A distributed ledger technology",
                  "A programming language for cryptocurrencies",
                  "A type of cryptocurrency"
                ],
                correctAnswer: 1
              },
              {
                id: 2,
                question: "What is the purpose of mining in Bitcoin?",
                options: [
                  "To create new cryptocurrencies",
                  "To validate and add transactions to the blockchain",
                  "To hack other people's wallets",
                  "To encrypt private keys"
                ],
                correctAnswer: 1
              },
              {
                id: 3,
                question: "What is a smart contract?",
                options: [
                  "A legal document for blockchain transactions",
                  "A hardware wallet",
                  "Self-executing code that runs on a blockchain",
                  "A type of consensus mechanism"
                ],
                correctAnswer: 2
              },
              {
                id: 4,
                question: "What consensus mechanism does Bitcoin use?",
                options: [
                  "Proof of Stake (PoS)",
                  "Delegated Proof of Stake (DPoS)",
                  "Proof of Work (PoW)",
                  "Proof of Authority (PoA)"
                ],
                correctAnswer: 2
              },
              {
                id: 5,
                question: "What is a public key in cryptocurrency?",
                options: [
                  "A private password",
                  "A public address derived from your private key",
                  "A recovery phrase",
                  "A validation mechanism"
                ],
                correctAnswer: 1
              }
            ]
          }
        };
        
        if (testId && mockTests[testId]) {
          setTest(mockTests[testId]);
          // Initialize time remaining
          setTimeRemaining(mockTests[testId].timeLimit * 60);
          // Initialize selected answers array with -1 (no selection)
          setSelectedAnswers(new Array(mockTests[testId].questions.length).fill(-1));
        } else {
          toast({
            title: "Test not found",
            description: "The requested certification test could not be found",
            variant: "destructive",
          });
          navigate("/certification-center");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading test:", error);
        toast({
          title: "Error",
          description: "Failed to load test data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchTestData();
  }, [testId, navigate, toast]);
  
  // Timer countdown
  useEffect(() => {
    if (!testSubmitted && timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !testSubmitted) {
      handleSubmitTest();
    }
  }, [timeRemaining, testSubmitted]);
  
  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };
  
  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestion < (test?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (!test) return 0;
    return ((currentQuestion + 1) / test.questions.length) * 100;
  };
  
  // Calculate how many questions have been answered
  const answeredCount = () => {
    return selectedAnswers.filter(answer => answer !== -1).length;
  };
  
  // Handle test submission
  const handleSubmitTest = () => {
    if (!test) return;
    
    // Calculate score
    let correctAnswers = 0;
    test.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / test.questions.length) * 100);
    const hasPassed = finalScore >= test.passingScore;
    
    setScore(finalScore);
    setPassed(hasPassed);
    setTestSubmitted(true);
    
    toast({
      title: hasPassed ? "Test Passed!" : "Test Completed",
      description: hasPassed 
        ? `Congratulations! You scored ${finalScore}% and earned a certificate.` 
        : `You scored ${finalScore}%. Minimum passing score was ${test.passingScore}%.`,
      variant: hasPassed ? "default" : "destructive",
    });
  };
  
  // Handle certificate generation
  const handleGenerateCertificate = async () => {
    if (!test || !user) return;
    
    try {
      // Check if QwixVault is connected
      if (!isConnected) {
        toast({
          title: "QwixVault Required",
          description: "Please connect your QwixVault to generate a certificate",
          variant: "destructive",
        });
        
        await connectWallet();
        return;
      }
      
      setIsGeneratingCertificate(true);
      
      // Generate the certificate
      const newCertificate = await generateCertificate(test.id, score, test.title);
      
      if (newCertificate) {
        // Save certificate to vault
        const result = await saveCertificateToVault(newCertificate);
        
        if (result) {
          toast({
            title: "Certificate Generated",
            description: "Your blockchain certificate has been added to your QwixVault",
          });
          
          // Navigate to dashboard
          navigate("/dashboard");
        } else {
          toast({
            title: "Certificate Error",
            description: "Failed to save certificate to your vault",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Certificate Error",
          description: "Failed to generate certificate",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Certificate generation error:", error);
      toast({
        title: "Certificate Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCertificate(false);
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="container max-w-4xl py-8 space-y-8">
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-lg">Loading certification test...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Show test results
  if (testSubmitted) {
    return (
      <Layout>
        <div className="container max-w-4xl py-8 space-y-8">
          <Card className="p-8 text-center">
            <div className="mb-8">
              {passed ? (
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle size={48} className="text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-green-700 mb-2">Certification Passed!</h1>
                  <p className="text-lg text-gray-600 mb-4">
                    Congratulations! You have passed the {test?.title} certification.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <XCircle size={48} className="text-red-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-red-700 mb-2">Not Passed</h1>
                  <p className="text-lg text-gray-600 mb-4">
                    You did not meet the minimum score required for certification. Keep learning and try again!
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Your Score</p>
                <p className="text-3xl font-bold">{score}%</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Passing Score</p>
                <p className="text-3xl font-bold">{test?.passingScore}%</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Result</p>
                <p className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {passed ? 'PASS' : 'FAIL'}
                </p>
              </div>
            </div>
            
            {passed ? (
              <div className="flex flex-col items-center">
                <p className="text-gray-600 mb-6">
                  Your blockchain certificate is ready to be generated and stored in your QwixVault.
                </p>
                
                {!isConnected ? (
                  <Button onClick={connectWallet} size="lg" className="mb-4">
                    <Award className="mr-2 h-5 w-5" />
                    Connect QwixVault to Generate Certificate
                  </Button>
                ) : (
                  <Button 
                    onClick={handleGenerateCertificate} 
                    size="lg" 
                    className="mb-4"
                    disabled={isGeneratingCertificate}
                  >
                    {isGeneratingCertificate ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Certificate...
                      </>
                    ) : (
                      <>
                        <Award className="mr-2 h-5 w-5" />
                        Generate Blockchain Certificate
                      </>
                    )}
                  </Button>
                )}
                
                <p className="text-sm text-gray-500">
                  The certificate will be securely stored in your QwixVault with a unique blockchain identifier.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Button onClick={() => navigate("/certification-center")} variant="outline" size="lg">
                  Return to Certification Center
                </Button>
              </div>
            )}
          </Card>
        </div>
      </Layout>
    );
  }
  
  // Show test
  return (
    <Layout>
      <div className="container max-w-4xl py-8 space-y-8">
        {/* Test Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{test?.title}</h1>
            <p className="text-gray-500">{test?.description}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
            <Clock className="h-4 w-4" />
            <span className="font-bold">{formatTime(timeRemaining || 0)}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Question {currentQuestion + 1} of {test?.questions.length}</span>
            <span>{answeredCount()} answered</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>
        
        {/* Question Card */}
        {test && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              {test.questions[currentQuestion].question}
            </h2>
            
            <div className="space-y-3 mb-8">
              {test.questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className={`
                    p-4 rounded-lg cursor-pointer border transition-all
                    ${selectedAnswers[currentQuestion] === index 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'}
                  `}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      h-5 w-5 rounded-full flex items-center justify-center border
                      ${selectedAnswers[currentQuestion] === index 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-gray-400'}
                    `}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion < test.questions.length - 1 ? (
                <Button
                  onClick={goToNextQuestion}
                  disabled={selectedAnswers[currentQuestion] === -1}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitTest}
                  disabled={answeredCount() < test.questions.length}
                >
                  Submit Test
                </Button>
              )}
            </div>
            
            {/* Warning for unanswered questions */}
            {currentQuestion === test.questions.length - 1 && answeredCount() < test.questions.length && (
              <div className="mt-4 flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <span>
                  You have {test.questions.length - answeredCount()} unanswered questions. 
                  Please go back and complete all questions before submitting.
                </span>
              </div>
            )}
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default CertificationTest;
