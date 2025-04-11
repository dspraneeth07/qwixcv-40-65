
import { Question, TestInfo } from '@/types/certification';

// Mock test data
export const getMockTests = (): TestInfo[] => {
  return [
    {
      id: "test-web3-basics",
      title: "Web3 & Blockchain Fundamentals",
      description: "Test your knowledge of Web3, blockchain technology, and decentralized systems.",
      category: "technical",
      timeLimit: 30,
      questionCount: 20,
      passingScore: 70,
      topics: ["Blockchain", "Cryptocurrency", "Smart Contracts", "DeFi", "NFTs", "Web3"]
    },
    {
      id: "test-react-advanced",
      title: "Advanced React & Redux",
      description: "Demonstrate your expertise in React, state management, and modern frontend development.",
      category: "technical",
      timeLimit: 45,
      questionCount: 25,
      passingScore: 75,
      topics: ["React", "Redux", "Hooks", "Context API", "Performance Optimization"]
    },
    {
      id: "test-ai-ml-basics",
      title: "AI & Machine Learning Foundations",
      description: "Validate your understanding of artificial intelligence and machine learning concepts.",
      category: "technical",
      timeLimit: 40,
      questionCount: 30,
      passingScore: 70,
      topics: ["AI", "Machine Learning", "Neural Networks", "Data Science", "Natural Language Processing"]
    },
    {
      id: "test-cloud-computing",
      title: "Cloud Computing & DevOps",
      description: "Test your knowledge of cloud services, infrastructure, and DevOps practices.",
      category: "technical",
      timeLimit: 35,
      questionCount: 25,
      passingScore: 65,
      topics: ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "CI/CD", "Infrastructure as Code"]
    },
    {
      id: "test-cybersecurity",
      title: "Cybersecurity Fundamentals",
      description: "Demonstrate your understanding of cybersecurity principles and best practices.",
      category: "technical",
      timeLimit: 30,
      questionCount: 20,
      passingScore: 80,
      topics: ["Network Security", "Cryptography", "Threat Detection", "Security Protocols", "Ethical Hacking"]
    },
    {
      id: "test-leadership",
      title: "Leadership & Management",
      description: "Validate your leadership skills and management principles for career advancement.",
      category: "career",
      timeLimit: 25,
      questionCount: 15,
      passingScore: 70,
      topics: ["Team Management", "Leadership Styles", "Conflict Resolution", "Strategic Planning", "Emotional Intelligence"]
    },
    {
      id: "test-product-management",
      title: "Product Management Essentials",
      description: "Test your knowledge of product management methodologies and best practices.",
      category: "career",
      timeLimit: 30,
      questionCount: 20,
      passingScore: 75,
      topics: ["Product Strategy", "User Research", "Roadmapping", "Agile", "Product Metrics", "Go-to-Market"]
    },
    {
      id: "test-data-analytics",
      title: "Data Analytics & Visualization",
      description: "Demonstrate your proficiency in data analysis, interpretation, and visualization.",
      category: "technical",
      timeLimit: 40,
      questionCount: 25,
      passingScore: 70,
      topics: ["Data Analysis", "SQL", "Python", "Statistical Methods", "Data Visualization", "Business Intelligence"]
    },
  ];
};

// Generate Web3 test questions where all answers are A
const generateWeb3Questions = (): Question[] => {
  return [
    {
      text: "What is blockchain technology?",
      options: [
        "A distributed ledger technology that maintains a continuously growing list of records",
        "A centralized database managed by a single entity",
        "A programming language for creating websites",
        "A cloud storage solution"
      ],
      correctAnswer: "A distributed ledger technology that maintains a continuously growing list of records"
    },
    {
      text: "Which of the following is NOT a characteristic of blockchain?",
      options: [
        "Centralized control",
        "Immutability",
        "Transparency",
        "Consensus mechanisms"
      ],
      correctAnswer: "Centralized control"
    },
    {
      text: "What is a smart contract?",
      options: [
        "Self-executing contracts with the terms directly written into code",
        "A legal document signed digitally",
        "A contract between smart devices",
        "An agreement between blockchain miners"
      ],
      correctAnswer: "Self-executing contracts with the terms directly written into code"
    },
    {
      text: "What is the primary purpose of a consensus mechanism in blockchain?",
      options: [
        "To validate and agree on the state of the blockchain without central authority",
        "To increase transaction speed",
        "To reduce the size of the blockchain",
        "To encrypt user data"
      ],
      correctAnswer: "To validate and agree on the state of the blockchain without central authority"
    },
    {
      text: "What is the concept of 'gas' in Ethereum?",
      options: [
        "A fee paid to process transactions and execute smart contracts",
        "A type of cryptocurrency",
        "The energy used by mining hardware",
        "A measure of blockchain size"
      ],
      correctAnswer: "A fee paid to process transactions and execute smart contracts"
    },
    {
      text: "What is Web3?",
      options: [
        "A vision of a decentralized internet based on blockchain technology",
        "The third version of the World Wide Web consortium standards",
        "A programming framework for mobile applications",
        "The latest version of HTML"
      ],
      correctAnswer: "A vision of a decentralized internet based on blockchain technology"
    },
    {
      text: "What is a non-fungible token (NFT)?",
      options: [
        "A unique digital asset that represents ownership of a specific item",
        "A cryptocurrency that can be exchanged for other currencies",
        "A token used for voting in DAOs",
        "A security measure for blockchain transactions"
      ],
      correctAnswer: "A unique digital asset that represents ownership of a specific item"
    },
    {
      text: "What is a 'hash function' in blockchain technology?",
      options: [
        "A function that converts input data into a fixed-size string of bytes",
        "A function that determines mining rewards",
        "A method for storing user passwords",
        "A technique for compressing blockchain data"
      ],
      correctAnswer: "A function that converts input data into a fixed-size string of bytes"
    },
    {
      text: "What is a 'fork' in blockchain terms?",
      options: [
        "A change to the protocol resulting in two separate blockchains",
        "A method of combining multiple transactions",
        "A type of cryptocurrency wallet",
        "The process of validating transactions"
      ],
      correctAnswer: "A change to the protocol resulting in two separate blockchains"
    },
    {
      text: "What does DeFi stand for?",
      options: [
        "Decentralized Finance",
        "Digital Financial Instruments",
        "Defined Finality",
        "Distributed File Integration"
      ],
      correctAnswer: "Decentralized Finance"
    }
  ];
};

// Generate React Advanced questions where all answers are A
const generateReactQuestions = (): Question[] => {
  return [
    {
      text: "What is React's Virtual DOM?",
      options: [
        "A lightweight copy of the actual DOM that React uses for performance optimization",
        "A special browser feature for React applications",
        "A component that virtualizes large lists",
        "The actual DOM rendered by React applications"
      ],
      correctAnswer: "A lightweight copy of the actual DOM that React uses for performance optimization"
    },
    {
      text: "What is a pure component in React?",
      options: [
        "A component that renders the same output given the same props and state",
        "A component without any styling",
        "A component written in pure JavaScript without JSX",
        "A component that doesn't use hooks"
      ],
      correctAnswer: "A component that renders the same output given the same props and state"
    },
    {
      text: "What is Redux middleware used for?",
      options: [
        "To handle asynchronous actions and side effects",
        "To create React components",
        "To optimize Redux performance",
        "To connect Redux to React components"
      ],
      correctAnswer: "To handle asynchronous actions and side effects"
    },
    {
      text: "What is the purpose of React Suspense?",
      options: [
        "To handle asynchronous operations and show fallback UI while waiting",
        "To prevent memory leaks in React applications",
        "To optimize rendering in large lists",
        "To handle form submissions"
      ],
      correctAnswer: "To handle asynchronous operations and show fallback UI while waiting"
    },
    {
      text: "What is the useCallback hook used for?",
      options: [
        "To memoize callback functions to prevent unnecessary re-renders",
        "To handle callback functions in forms",
        "To create callback URLs for routing",
        "To create event handlers"
      ],
      correctAnswer: "To memoize callback functions to prevent unnecessary re-renders"
    }
  ];
};

// Mock test data by ID
export const getMockTestById = (testId: string): {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  questions: Question[];
} | null => {
  const allTests = getMockTests();
  const testInfo = allTests.find(test => test.id === testId);
  
  if (!testInfo) return null;
  
  // For this demo, we'll return a fixed set of questions based on test ID
  let questions: Question[] = [];
  
  switch (testId) {
    case 'test-web3-basics':
      questions = generateWeb3Questions();
      break;
    case 'test-react-advanced':
      questions = generateReactQuestions();
      break;
    default:
      // Generate generic questions for other tests where answer A is always correct
      questions = Array(testInfo.questionCount).fill(0).map((_, index) => ({
        text: `Question ${index + 1} for ${testInfo.title}`,
        options: [
          `Correct answer for question ${index + 1}`,
          `Wrong answer option B for question ${index + 1}`,
          `Wrong answer option C for question ${index + 1}`,
          `Wrong answer option D for question ${index + 1}`
        ],
        correctAnswer: `Correct answer for question ${index + 1}`
      }));
  }
  
  return {
    id: testInfo.id,
    title: testInfo.title,
    description: testInfo.description,
    timeLimit: testInfo.timeLimit,
    passingScore: testInfo.passingScore,
    questions: questions.slice(0, testInfo.questionCount)
  };
};
