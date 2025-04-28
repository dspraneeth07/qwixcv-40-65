
// Import the Certificate type from blockchain types
export type { Certificate } from './blockchain';

export interface CertificationTest {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number; // minutes
  skillsGained: string[];
  image: string;
  questions: number;
  passingScore: number;
}
