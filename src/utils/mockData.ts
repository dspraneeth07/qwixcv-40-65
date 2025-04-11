
import { TestInfo, Question } from '@/types/certification';

/**
 * Generate mock test data
 */
export const getMockTests = (): TestInfo[] => {
  return [
    {
      id: "test-123",
      title: "Resume Optimization Mastery",
      description: "Learn how to create an ATS-optimized resume that gets past automated screening systems.",
      category: "career",
      timeLimit: 20,
      questionCount: 15,
      passingScore: 65,
      topics: ["ATS Optimization", "Resume Structure", "Keywords", "Formatting"]
    },
    {
      id: "test-456",
      title: "HTML + CSS Basics",
      description: "Demonstrate your knowledge of fundamental HTML and CSS concepts for web development.",
      category: "technical",
      timeLimit: 20,
      questionCount: 20,
      passingScore: 65,
      topics: ["HTML5", "CSS3", "Responsive Design", "Flexbox"]
    },
    {
      id: "test-789",
      title: "SQL Foundations",
      description: "Show your proficiency in SQL queries and database fundamentals.",
      category: "technical",
      timeLimit: 20,
      questionCount: 18,
      passingScore: 70,
      topics: ["SELECT Queries", "JOIN Operations", "Database Design", "Indexing"]
    },
    {
      id: "test-101",
      title: "Git & GitHub Essentials",
      description: "Master the fundamentals of version control with Git and GitHub collaboration.",
      category: "technical",
      timeLimit: 15,
      questionCount: 15,
      passingScore: 65,
      topics: ["Basic Commands", "Branching", "Pull Requests", "Merge Conflicts"]
    },
    {
      id: "test-202",
      title: "Python for Data Science",
      description: "Test your knowledge of Python fundamentals for data science applications.",
      category: "technical",
      timeLimit: 25,
      questionCount: 20,
      passingScore: 70,
      topics: ["NumPy", "Pandas", "Data Visualization", "Basic Statistics"]
    },
    {
      id: "test-303",
      title: "Interview Skills Assessment",
      description: "Evaluate your interview preparation and response techniques.",
      category: "career",
      timeLimit: 15,
      questionCount: 15,
      passingScore: 65,
      topics: ["Behavioral Questions", "Technical Interviews", "Salary Negotiation", "Follow-up"]
    }
  ];
};

/**
 * Get a specific test by ID
 */
export const getMockTestById = (testId: string) => {
  const allTests = getMockTests();
  const test = allTests.find(t => t.id === testId);
  
  if (!test) return null;
  
  // Mock questions based on the test
  let questions: Question[] = [];
  
  switch (testId) {
    case "test-123": // Resume Optimization
      questions = [
        {
          text: "What does ATS stand for in the context of resume screening?",
          options: [
            "Application Tracking System",
            "Applicant Tracking System",
            "Automated Testing Service",
            "Applicant Testing Software"
          ],
          correctAnswer: "Applicant Tracking System"
        },
        {
          text: "Which file format is most compatible with ATS systems?",
          options: [
            "PDF",
            "DOCX",
            "TXT",
            "All of the above"
          ],
          correctAnswer: "All of the above"
        },
        {
          text: "What is the recommended approach for including keywords in your resume?",
          options: [
            "List them all in a 'Keywords' section",
            "Make the text white to hide keywords",
            "Integrate them naturally throughout relevant sections",
            "Repeat them as many times as possible"
          ],
          correctAnswer: "Integrate them naturally throughout relevant sections"
        },
        {
          text: "What is keyword stuffing?",
          options: [
            "Adding relevant keywords to your resume",
            "Excessively adding keywords to manipulate ATS rankings",
            "Organizing keywords by importance",
            "Using industry-specific terminology"
          ],
          correctAnswer: "Excessively adding keywords to manipulate ATS rankings"
        },
        {
          text: "Which section is typically most important for ATS optimization?",
          options: [
            "Skills section",
            "Objective statement",
            "Education",
            "References"
          ],
          correctAnswer: "Skills section"
        },
        {
          text: "What is a common reason resumes get rejected by ATS systems?",
          options: [
            "Using standard fonts like Arial or Calibri",
            "Including too much white space",
            "Using complex formatting, tables, or headers/footers",
            "Having too many bullet points"
          ],
          correctAnswer: "Using complex formatting, tables, or headers/footers"
        },
        {
          text: "How should skills be presented for optimal ATS recognition?",
          options: [
            "As a word cloud or infographic",
            "In a clearly labeled skills section with relevant keywords",
            "Only within job descriptions",
            "In the header of the resume"
          ],
          correctAnswer: "In a clearly labeled skills section with relevant keywords"
        },
        {
          text: "What's the recommended approach for job titles that don't match the position you're applying for?",
          options: [
            "Use the exact job title from the listing instead of your actual title",
            "Include both your official title and the equivalent title from the job listing",
            "Omit your title completely",
            "Use an entirely different title that sounds more impressive"
          ],
          correctAnswer: "Include both your official title and the equivalent title from the job listing"
        },
        {
          text: "What's the optimal length for a resume to pass ATS systems?",
          options: [
            "Always exactly one page",
            "1-2 pages for most candidates",
            "At least 3 pages to include all keywords",
            "Length doesn't affect ATS parsing"
          ],
          correctAnswer: "1-2 pages for most candidates"
        },
        {
          text: "How does an ATS typically handle acronyms?",
          options: [
            "It always recognizes them correctly",
            "It never recognizes them",
            "It may not recognize industry-specific acronyms without the spelled-out version",
            "It only recognizes technical acronyms"
          ],
          correctAnswer: "It may not recognize industry-specific acronyms without the spelled-out version"
        },
        {
          text: "What should you do with the job description when tailoring your resume?",
          options: [
            "Copy it verbatim into your resume",
            "Analyze it for keywords and requirements to include",
            "Ignore it and use a standard resume",
            "Send it back to the employer with corrections"
          ],
          correctAnswer: "Analyze it for keywords and requirements to include"
        },
        {
          text: "What formatting elements should be avoided for better ATS compatibility?",
          options: [
            "Bold and italic text",
            "Standard bullet points",
            "Section headers",
            "Tables, text boxes, and graphics"
          ],
          correctAnswer: "Tables, text boxes, and graphics"
        },
        {
          text: "What's the best way to include URLs (like LinkedIn profiles) on an ATS-friendly resume?",
          options: [
            "As QR codes",
            "As hyperlinked text",
            "As plain text without hyperlinks",
            "URLs should be avoided completely"
          ],
          correctAnswer: "As plain text without hyperlinks"
        },
        {
          text: "When applying to multiple similar positions, what's the best approach?",
          options: [
            "Send the exact same resume to all positions",
            "Create a new resume from scratch for each application",
            "Customize a base resume for each position based on the job description",
            "Send multiple versions of your resume for each application"
          ],
          correctAnswer: "Customize a base resume for each position based on the job description"
        },
        {
          text: "What's a good practice regarding contact information on an ATS-friendly resume?",
          options: [
            "Include it only in a separate cover letter",
            "Place it in a header or footer",
            "Include it in the main body of the resume",
            "Omit it to protect your privacy"
          ],
          correctAnswer: "Include it in the main body of the resume"
        }
      ];
      break;
      
    default:
      // Generate generic questions for other tests
      for (let i = 1; i <= test.questionCount; i++) {
        questions.push({
          text: `Sample question ${i} for ${test.title}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A" // First option is always correct in our mock data
        });
      }
  }
  
  return {
    id: test.id,
    title: test.title,
    description: test.description,
    timeLimit: test.timeLimit,
    passingScore: test.passingScore,
    questions
  };
};
