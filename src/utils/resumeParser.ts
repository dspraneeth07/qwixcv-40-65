
// This is a mock implementation of a resume parser
// In a real application, this would use actual PDF parsing libraries

export const resumeParser = async (file: File) => {
  return new Promise((resolve, reject) => {
    // Simulate PDF parsing delay
    setTimeout(() => {
      // For demonstration purposes, return mock data
      if (file) {
        const mockResumeData = {
          currentRole: "Software Developer",
          yearsOfExperience: 3,
          skills: ["JavaScript", "React", "Node.js", "TypeScript", "HTML", "CSS", "Git"],
          softSkills: ["Communication", "Problem Solving", "Teamwork"],
          education: ["Bachelor of Science in Computer Science"],
          certifications: ["AWS Certified Developer"]
        };
        
        resolve(mockResumeData);
      } else {
        reject(new Error("No file provided"));
      }
    }, 1500);
  });
};
