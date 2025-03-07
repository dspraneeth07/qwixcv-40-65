
import html2pdf from 'html2pdf.js';

export const generateComparisonReport = async (
  resumeData: any,
  jobDescription: string,
  matchScore: number,
  keywordMatches: any[],
  missingKeywords: string[],
  recommendations: string[]
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
  taglineDiv.innerHTML = 'Resume Analysis Report';
  
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
  subtitle.innerHTML = `For: ${resumeData?.personalInfo?.firstName || ''} ${resumeData?.personalInfo?.lastName || ''}`;
  
  titleDiv.appendChild(title);
  titleDiv.appendChild(subtitle);
  reportContainer.appendChild(titleDiv);
  
  // Add match score section
  const scoreDiv = document.createElement('div');
  scoreDiv.style.backgroundColor = '#f8fafc';
  scoreDiv.style.border = '1px solid #e2e8f0';
  scoreDiv.style.borderRadius = '8px';
  scoreDiv.style.padding = '20px';
  scoreDiv.style.marginBottom = '30px';
  scoreDiv.style.display = 'flex';
  scoreDiv.style.alignItems = 'center';
  scoreDiv.style.justifyContent = 'space-between';
  
  const scoreInfo = document.createElement('div');
  
  const scoreTitle = document.createElement('h2');
  scoreTitle.style.fontSize = '18px';
  scoreTitle.style.fontWeight = 'bold';
  scoreTitle.style.marginBottom = '10px';
  scoreTitle.innerHTML = 'ATS Compatibility Score';
  
  const scoreDesc = document.createElement('p');
  scoreDesc.style.fontSize = '14px';
  scoreDesc.style.color = '#6b7280';
  scoreDesc.innerHTML = 'How well your resume matches the job description';
  
  scoreInfo.appendChild(scoreTitle);
  scoreInfo.appendChild(scoreDesc);
  
  const scoreValue = document.createElement('div');
  scoreValue.style.fontSize = '36px';
  scoreValue.style.fontWeight = 'bold';
  scoreValue.style.color = getScoreColor(matchScore);
  scoreValue.innerHTML = `${matchScore}%`;
  
  scoreDiv.appendChild(scoreInfo);
  scoreDiv.appendChild(scoreValue);
  reportContainer.appendChild(scoreDiv);
  
  // Add job description section
  const jobSection = document.createElement('div');
  jobSection.style.marginBottom = '30px';
  
  const jobTitle = document.createElement('h2');
  jobTitle.style.fontSize = '18px';
  jobTitle.style.fontWeight = 'bold';
  jobTitle.style.marginBottom = '15px';
  jobTitle.innerHTML = 'Job Description Analyzed';
  
  const jobContent = document.createElement('div');
  jobContent.style.backgroundColor = '#f8fafc';
  jobContent.style.border = '1px solid #e2e8f0';
  jobContent.style.borderRadius = '8px';
  jobContent.style.padding = '15px';
  jobContent.style.fontSize = '14px';
  jobContent.style.lineHeight = '1.5';
  jobContent.style.maxHeight = '200px';
  jobContent.style.overflow = 'auto';
  jobContent.innerHTML = jobDescription;
  
  jobSection.appendChild(jobTitle);
  jobSection.appendChild(jobContent);
  reportContainer.appendChild(jobSection);
  
  // Add matched keywords section
  const matchedSection = document.createElement('div');
  matchedSection.style.marginBottom = '30px';
  
  const matchedTitle = document.createElement('h2');
  matchedTitle.style.fontSize = '18px';
  matchedTitle.style.fontWeight = 'bold';
  matchedTitle.style.marginBottom = '15px';
  matchedTitle.innerHTML = 'Matched Keywords';
  
  const matchedGrid = document.createElement('div');
  matchedGrid.style.display = 'grid';
  matchedGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
  matchedGrid.style.gap = '10px';
  
  keywordMatches.forEach(match => {
    const matchItem = document.createElement('div');
    matchItem.style.backgroundColor = '#ecfdf5';
    matchItem.style.border = '1px solid #d1fae5';
    matchItem.style.borderRadius = '6px';
    matchItem.style.padding = '10px';
    matchItem.style.fontSize = '14px';
    matchItem.innerHTML = `<span style="font-weight: bold;">${match.keyword}</span>`;
    
    matchedGrid.appendChild(matchItem);
  });
  
  matchedSection.appendChild(matchedTitle);
  matchedSection.appendChild(matchedGrid);
  reportContainer.appendChild(matchedSection);
  
  // Add missing keywords section
  if (missingKeywords.length > 0) {
    const missingSection = document.createElement('div');
    missingSection.style.marginBottom = '30px';
    
    const missingTitle = document.createElement('h2');
    missingTitle.style.fontSize = '18px';
    missingTitle.style.fontWeight = 'bold';
    missingTitle.style.marginBottom = '15px';
    missingTitle.innerHTML = 'Missing Keywords';
    
    const missingGrid = document.createElement('div');
    missingGrid.style.display = 'grid';
    missingGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
    missingGrid.style.gap = '10px';
    
    missingKeywords.forEach(keyword => {
      const missingItem = document.createElement('div');
      missingItem.style.backgroundColor = '#fee2e2';
      missingItem.style.border = '1px solid #fecaca';
      missingItem.style.borderRadius = '6px';
      missingItem.style.padding = '10px';
      missingItem.style.fontSize = '14px';
      missingItem.innerHTML = keyword;
      
      missingGrid.appendChild(missingItem);
    });
    
    missingSection.appendChild(missingTitle);
    missingSection.appendChild(missingGrid);
    reportContainer.appendChild(missingSection);
  }
  
  // Add recommendations section
  if (recommendations.length > 0) {
    const recSection = document.createElement('div');
    recSection.style.marginBottom = '30px';
    
    const recTitle = document.createElement('h2');
    recTitle.style.fontSize = '18px';
    recTitle.style.fontWeight = 'bold';
    recTitle.style.marginBottom = '15px';
    recTitle.innerHTML = 'Recommendations';
    
    const recList = document.createElement('ul');
    recList.style.paddingLeft = '20px';
    
    recommendations.forEach(rec => {
      const recItem = document.createElement('li');
      recItem.style.fontSize = '14px';
      recItem.style.marginBottom = '10px';
      recItem.style.lineHeight = '1.5';
      recItem.innerHTML = rec;
      
      recList.appendChild(recItem);
    });
    
    recSection.appendChild(recTitle);
    recSection.appendChild(recList);
    reportContainer.appendChild(recSection);
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
    filename: 'Resume_Analysis_Report.pdf',
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
