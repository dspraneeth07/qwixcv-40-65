
import html2pdf from 'html2pdf.js';

export const generateComparisonReport = async (
  resumeDataA: any,
  resumeDataB: any,
  scoreDataA: any,
  scoreDataB: any
) => {
  const reportContainer = document.createElement('div');
  reportContainer.className = 'comparison-report';
  reportContainer.style.width = '100%';
  reportContainer.style.maxWidth = '800px';
  reportContainer.style.margin = '0 auto';
  reportContainer.style.padding = '40px';
  reportContainer.style.fontFamily = 'Arial, sans-serif';
  reportContainer.style.backgroundColor = '#ffffff';
  reportContainer.style.color = '#333333';
  
  // Add QWIKCV logo at the top
  const headerDiv = document.createElement('div');
  headerDiv.style.textAlign = 'center';
  headerDiv.style.marginBottom = '30px';
  
  const logoDiv = document.createElement('div');
  logoDiv.style.fontSize = '28px';
  logoDiv.style.fontWeight = 'bold';
  logoDiv.style.color = '#4f46e5';
  logoDiv.style.letterSpacing = '1px';
  logoDiv.style.textTransform = 'uppercase';
  logoDiv.style.marginBottom = '10px';
  logoDiv.innerHTML = 'QWIK CV';
  
  const taglineDiv = document.createElement('div');
  taglineDiv.style.fontSize = '14px';
  taglineDiv.style.color = '#666';
  taglineDiv.innerHTML = 'Resume Comparison Report';
  
  headerDiv.appendChild(logoDiv);
  headerDiv.appendChild(taglineDiv);
  reportContainer.appendChild(headerDiv);
  
  // Add title section
  const titleDiv = document.createElement('div');
  titleDiv.style.borderBottom = '2px solid #eaeaea';
  titleDiv.style.paddingBottom = '20px';
  titleDiv.style.marginBottom = '30px';
  
  const title = document.createElement('h1');
  title.style.fontSize = '24px';
  title.style.fontWeight = 'bold';
  title.style.color = '#1f2937';
  title.style.marginBottom = '10px';
  title.innerHTML = 'Resume Comparison Analysis';
  
  const subtitle = document.createElement('p');
  subtitle.style.fontSize = '16px';
  subtitle.style.color = '#6b7280';
  subtitle.innerHTML = `Comparing two versions of your resume`;
  
  titleDiv.appendChild(title);
  titleDiv.appendChild(subtitle);
  reportContainer.appendChild(titleDiv);
  
  // Create the comparison report structure
  const createResumeSection = (resumeData: any, scoreData: any, label: string) => {
    const scoreDiv = document.createElement('div');
    scoreDiv.style.backgroundColor = '#f8fafc';
    scoreDiv.style.border = '1px solid #e2e8f0';
    scoreDiv.style.borderRadius = '8px';
    scoreDiv.style.padding = '20px';
    scoreDiv.style.marginBottom = '30px';
    
    const scoreTitle = document.createElement('h2');
    scoreTitle.style.fontSize = '18px';
    scoreTitle.style.fontWeight = 'bold';
    scoreTitle.style.marginBottom = '15px';
    scoreTitle.innerHTML = `Resume ${label} Analysis`;
    
    scoreDiv.appendChild(scoreTitle);
    
    // ATS Score
    const scoreItem = document.createElement('div');
    scoreItem.style.display = 'flex';
    scoreItem.style.justifyContent = 'space-between';
    scoreItem.style.marginBottom = '10px';
    
    const scoreLabel = document.createElement('span');
    scoreLabel.style.fontWeight = 'bold';
    scoreLabel.innerHTML = 'ATS Compatibility Score:';
    
    const scoreValue = document.createElement('span');
    scoreValue.style.color = getScoreColor(scoreData.atsScore);
    scoreValue.style.fontWeight = 'bold';
    scoreValue.innerHTML = `${scoreData.atsScore}%`;
    
    scoreItem.appendChild(scoreLabel);
    scoreItem.appendChild(scoreValue);
    scoreDiv.appendChild(scoreItem);
    
    // Add strengths
    if (scoreData.strengths && scoreData.strengths.length > 0) {
      const strengthsTitle = document.createElement('h3');
      strengthsTitle.style.fontSize = '16px';
      strengthsTitle.style.fontWeight = 'bold';
      strengthsTitle.style.marginTop = '15px';
      strengthsTitle.style.marginBottom = '10px';
      strengthsTitle.style.color = '#059669';
      strengthsTitle.innerHTML = 'Strengths:';
      
      scoreDiv.appendChild(strengthsTitle);
      
      const strengthsList = document.createElement('ul');
      strengthsList.style.paddingLeft = '20px';
      strengthsList.style.marginBottom = '15px';
      
      scoreData.strengths.forEach((strength: string) => {
        const item = document.createElement('li');
        item.style.marginBottom = '5px';
        item.innerHTML = strength;
        strengthsList.appendChild(item);
      });
      
      scoreDiv.appendChild(strengthsList);
    }
    
    // Add weaknesses
    if (scoreData.weaknesses && scoreData.weaknesses.length > 0) {
      const weaknessesTitle = document.createElement('h3');
      weaknessesTitle.style.fontSize = '16px';
      weaknessesTitle.style.fontWeight = 'bold';
      weaknessesTitle.style.marginTop = '15px';
      weaknessesTitle.style.marginBottom = '10px';
      weaknessesTitle.style.color = '#dc2626';
      weaknessesTitle.innerHTML = 'Areas to Improve:';
      
      scoreDiv.appendChild(weaknessesTitle);
      
      const weaknessesList = document.createElement('ul');
      weaknessesList.style.paddingLeft = '20px';
      
      scoreData.weaknesses.forEach((weakness: string) => {
        const item = document.createElement('li');
        item.style.marginBottom = '5px';
        item.innerHTML = weakness;
        weaknessesList.appendChild(item);
      });
      
      scoreDiv.appendChild(weaknessesList);
    }
    
    return scoreDiv;
  };
  
  // Add Resume A section
  reportContainer.appendChild(createResumeSection(resumeDataA, scoreDataA, 'A'));
  
  // Add Resume B section
  reportContainer.appendChild(createResumeSection(resumeDataB, scoreDataB, 'B'));
  
  // Determine the winner
  const winner = scoreDataA.atsScore >= scoreDataB.atsScore ? 'A' : 'B';
  const scoreDiff = Math.abs(scoreDataA.atsScore - scoreDataB.atsScore);
  
  // Add winner section
  const winnerDiv = document.createElement('div');
  winnerDiv.style.backgroundColor = '#ecfdf5';
  winnerDiv.style.border = '1px solid #d1fae5';
  winnerDiv.style.borderRadius = '8px';
  winnerDiv.style.padding = '20px';
  winnerDiv.style.marginBottom = '30px';
  
  const winnerTitle = document.createElement('h2');
  winnerTitle.style.fontSize = '18px';
  winnerTitle.style.fontWeight = 'bold';
  winnerTitle.style.marginBottom = '10px';
  winnerTitle.style.color = '#059669';
  winnerTitle.innerHTML = 'Recommendation';
  
  const winnerText = document.createElement('p');
  winnerText.style.marginBottom = '15px';
  winnerText.innerHTML = `<strong>Resume ${winner}</strong> is more likely to pass ATS systems with a ${scoreDiff}% higher score. We recommend using this version for your job applications.`;
  
  winnerDiv.appendChild(winnerTitle);
  winnerDiv.appendChild(winnerText);
  reportContainer.appendChild(winnerDiv);
  
  // Add improvement suggestions
  if (scoreDataA.improvementSuggestions || scoreDataB.improvementSuggestions) {
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.style.backgroundColor = '#f0f9ff';
    suggestionsDiv.style.border = '1px solid #bae6fd';
    suggestionsDiv.style.borderRadius = '8px';
    suggestionsDiv.style.padding = '20px';
    suggestionsDiv.style.marginBottom = '30px';
    
    const suggestionsTitle = document.createElement('h2');
    suggestionsTitle.style.fontSize = '18px';
    suggestionsTitle.style.fontWeight = 'bold';
    suggestionsTitle.style.marginBottom = '10px';
    suggestionsTitle.style.color = '#0284c7';
    suggestionsTitle.innerHTML = 'General Improvement Suggestions';
    
    suggestionsDiv.appendChild(suggestionsTitle);
    
    const suggestionsList = document.createElement('ol');
    suggestionsList.style.paddingLeft = '20px';
    
    // Combine and deduplicate suggestions
    const allSuggestions = [
      ...(scoreDataA.improvementSuggestions || []),
      ...(scoreDataB.improvementSuggestions || [])
    ];
    const uniqueSuggestions = [...new Set(allSuggestions)];
    
    uniqueSuggestions.forEach((suggestion: string) => {
      const item = document.createElement('li');
      item.style.marginBottom = '8px';
      item.innerHTML = suggestion;
      suggestionsList.appendChild(item);
    });
    
    suggestionsDiv.appendChild(suggestionsList);
    reportContainer.appendChild(suggestionsDiv);
  }
  
  // Add footer
  const footer = document.createElement('div');
  footer.style.marginTop = '50px';
  footer.style.paddingTop = '20px';
  footer.style.borderTop = '1px solid #eaeaea';
  footer.style.textAlign = 'center';
  footer.style.fontSize = '12px';
  footer.style.color = '#9ca3af';
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  footer.innerHTML = `Generated on ${currentDate} | QWIK CV Resume Analysis Tool`;
  
  reportContainer.appendChild(footer);
  
  // Generate PDF
  const opt = {
    margin: [10, 10, 10, 10],
    filename: 'Resume_Comparison_Report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  try {
    const pdfBlob = await html2pdf().from(reportContainer).set(opt).outputPdf('blob');
    return pdfBlob;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
};

// Helper function to get color based on score
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#059669'; // Green
  if (score >= 60) return '#0891b2'; // Teal
  if (score >= 40) return '#d97706'; // Amber
  return '#dc2626'; // Red
};
