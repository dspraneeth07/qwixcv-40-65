
import html2pdf from 'html2pdf.js';

export const generateComparisonReport = async (
  resumeDataA: any,
  resumeDataB: any,
  scoreDataA: any,
  scoreDataB: any
) => {
  // Mock comparison results for the example
  const comparisonResults = {
    winner: scoreDataA.atsScore > scoreDataB.atsScore ? 'resumeA' : 'resumeB',
    resumeA: {
      atsScore: scoreDataA.atsScore,
      keywordScore: scoreDataA.keywordScore || 78,
      formatScore: scoreDataA.formatScore || 85,
      contentScore: scoreDataA.contentScore || 82,
      strengths: [
        "Clear job title and professional summary",
        "Good use of action verbs",
        "Quantifiable achievements included",
        "Consistent formatting throughout"
      ],
      weaknesses: [
        "Could use more industry-specific keywords",
        "Experience descriptions could be more detailed",
        "Skills section could be expanded"
      ]
    },
    resumeB: {
      atsScore: scoreDataB.atsScore,
      keywordScore: scoreDataB.keywordScore || 83,
      formatScore: scoreDataB.formatScore || 79,
      contentScore: scoreDataB.contentScore || 88,
      strengths: [
        "Excellent keyword optimization",
        "Strong technical skills section",
        "Well-structured experience section",
        "Education details are comprehensive"
      ],
      weaknesses: [
        "Some formatting inconsistencies",
        "Professional summary could be more impactful",
        "Limited quantifiable achievements"
      ]
    },
    reason: `${scoreDataA.atsScore > scoreDataB.atsScore ? 'Resume A' : 'Resume B'} scores higher overall due to ${scoreDataA.atsScore > scoreDataB.atsScore ? 'better formatting consistency and clarity of experience' : 'stronger keyword optimization and more comprehensive content'}. The winning resume has a better chance of passing through ATS systems and impressing hiring managers with its ${scoreDataA.atsScore > scoreDataB.atsScore ? 'clear structure and actionable achievements' : 'relevant keywords and detailed skill descriptions'}.`,
    improvementSuggestions: [
      "Include more industry-specific keywords in both resumes to improve ATS scores",
      "Quantify achievements with specific numbers and percentages when possible",
      "Ensure consistent formatting throughout both documents",
      "Tailor each resume to the specific job description you're applying for",
      "Include relevant certifications and technical skills prominently",
      "Keep the resume length appropriate - typically 1-2 pages maximum",
      "Use a clean, professional design that is ATS-friendly"
    ]
  };

  return comparisonResults;
};

// Helper function to get color based on score (unused but kept for future use)
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#059669'; // Green
  if (score >= 60) return '#0891b2'; // Teal
  if (score >= 40) return '#d97706'; // Amber
  return '#dc2626'; // Red
};
