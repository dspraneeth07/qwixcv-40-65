
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { GraduationCap, Code, Cpu, Award, Briefcase, Star, GitBranch, Github, Linkedin, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  education: string;
  rollNo?: string;
  bio: string;
  expertise: string[];
  achievements: string[];
  image: string;
  github?: string;
  linkedin?: string;
  email?: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const About = () => {
  const [activeTeamMember, setActiveTeamMember] = useState<number | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Dhadi Sai Praneeth Reddy",
      role: "Founder & CTO of QwikZen Group India",
      education: "Student at Vasavi College of Engineering, CSE Department",
      rollNo: "1602-23-733-038",
      bio: "Visionary leader behind QwikZen, a zero-investment AI-driven software development startup focused on cutting-edge AI solutions, real-time applications, and hardware innovations.",
      expertise: ["AI", "Machine Learning", "Software Development", "Full-Stack Engineering"],
      achievements: [
        "Spearheaded the QwiXSuite, an ecosystem of independent AI-powered tools.",
        "Developed QwiXGenie, an AI-powered code-generation model.",
        "Innovated QwiXlate, a real-time multilingual AI voice-to-text converter.",
        "Leading research on IKS Samvardhini Yojana to decode the cosmic significance of Pancha Bhoota Sthalas.",
        "Developing a home automation hardware project for automated water motor control with IoT integration."
      ],
      image: "/placeholder.svg",
      github: "github.com/dspraneeth07",
      linkedin: "linkedin.com/in/dspraneeth07",
      email: "dspraneeth07@gmail.com"
    },
    {
      id: 2,
      name: "Kasireddy Manideep Reddy",
      role: "Co-Founder & CEO of QwikZen",
      education: "Student at Vasavi College of Engineering, CSE Department",
      rollNo: "1602-23-733-022",
      bio: "Strategic leader driving QwikZen's growth, innovation, and AI-first approach.",
      expertise: ["Software Engineering", "AI Technologies", "Business Strategy"],
      achievements: [
        "Oversees the development and expansion of QwiXSuite.",
        "Leads AI-driven software development, ensuring scalability and real-world impact.",
        "Works on future monetization strategies for QwikZen's AI projects."
      ],
      image: "/placeholder.svg",
      linkedin: "linkedin.com/in/manideep-kasireddy-2ba51428a",
      email: "kasireddymanideepreddy405@gmail.com"
    },
    {
      id: 3,
      name: "Pravalika Batchu",
      role: "Full-Stack Developer, QwikZen Group India",
      education: "Student at Vasavi College of Engineering, CSE Department",
      rollNo: "1602-23-733-311",
      bio: "Core developer specializing in front-end and back-end development for QwikZen's AI-driven products.",
      expertise: ["Full-Stack Development", "UI/UX Design", "Scalable Web Architectures"],
      achievements: [
        "Developed QwiX CV's AI-powered resume scanner UI.",
        "Works on QwikZen's AI-integrated applications, ensuring smooth user experiences."
      ],
      image: "/placeholder.svg"
    }
  ];

  const toggleMemberDetails = (id: number) => {
    setActiveTeamMember(activeTeamMember === id ? null : id);
  };

  return (
    <MainLayout>
      <section className="py-16 overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="container">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sf-pro gradient-text">
              Meet the Minds Behind QwiX CV
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-600 mb-6">
                QwiX CV is an AI-powered ATS resume scanner developed as part of a hackathon project by Team QwikZen,
                designed to revolutionize job applications with real-time AI insights.
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-modern-blue-500 to-soft-purple mx-auto rounded-full"></div>
            </div>
          </motion.div>

          {/* Team Members */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {teamMembers.map((member) => (
              <motion.div key={member.id} variants={fadeInUp}>
                <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl card-3d
                                ${activeTeamMember === member.id ? 'scale-105 shadow-2xl' : ''}`}>
                  <div 
                    className="h-48 bg-gradient-to-r from-modern-blue-600 to-soft-purple flex items-center justify-center cursor-pointer"
                    onClick={() => toggleMemberDetails(member.id)}
                  >
                    <h3 className="text-2xl font-bold text-white font-sf-pro">{member.name}</h3>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-1 text-gray-800">{member.role}</h4>
                    <p className="text-sm text-gray-600 mb-3 flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2 text-modern-blue-500" />
                      {member.education}
                    </p>
                    {member.rollNo && (
                      <p className="text-sm text-gray-600 mb-3">Roll No: {member.rollNo}</p>
                    )}
                    
                    <p className="text-sm text-gray-700 mb-4">{member.bio}</p>
                    
                    {activeTeamMember === member.id && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <h5 className="text-sm font-semibold mb-2 flex items-center">
                            <Code className="w-4 h-4 mr-2 text-modern-blue-500" />
                            Expertise
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {member.expertise.map((skill, index) => (
                              <span 
                                key={index}
                                className="text-xs bg-modern-blue-100 text-modern-blue-800 px-2 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-semibold mb-2 flex items-center">
                            <Award className="w-4 h-4 mr-2 text-modern-blue-500" />
                            Achievements
                          </h5>
                          <ul className="text-sm space-y-1 list-disc pl-5">
                            {member.achievements.map((achievement, index) => (
                              <li key={index}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="pt-3 flex gap-2">
                          {member.github && (
                            <Button size="sm" variant="outline" asChild className="text-xs">
                              <a href={`https://${member.github}`} target="_blank" rel="noopener noreferrer">
                                <Github className="w-3 h-3 mr-1" />
                                GitHub
                              </a>
                            </Button>
                          )}
                          
                          {member.linkedin && (
                            <Button size="sm" variant="outline" asChild className="text-xs">
                              <a href={`https://${member.linkedin}`} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="w-3 h-3 mr-1" />
                                LinkedIn
                              </a>
                            </Button>
                          )}
                          
                          {member.email && (
                            <Button size="sm" variant="outline" asChild className="text-xs">
                              <a href={`mailto:${member.email}`}>
                                <Mail className="w-3 h-3 mr-1" />
                                Email
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {activeTeamMember !== member.id && (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => toggleMemberDetails(member.id)}
                        className="mt-2"
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          {/* About QwiX CV */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glassmorphism p-8">
              <h2 className="text-3xl font-bold mb-6 font-sf-pro gradient-text">What is QwiX CV?</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-modern-blue-100 flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-modern-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-sf-pro">AI-Powered Resume Analysis</h3>
                    <p className="text-gray-600">
                      QwiX CV is an AI-powered ATS resume scanner that helps users analyze their resume score, 
                      optimize content, and improve job application success rates.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-modern-blue-100 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-modern-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-sf-pro">Hackathon Innovation</h3>
                    <p className="text-gray-600">
                      Developed as part of a hackathon project, QwiX CV is designed to revolutionize job 
                      applications with real-time AI insights, helping students and professionals refine their resumes 
                      for maximum impact.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-modern-blue-100 flex items-center justify-center">
                      <GitBranch className="w-6 h-6 text-modern-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-sf-pro">Part of QwiXSuite</h3>
                    <p className="text-gray-600">
                      QwiX CV is one of several AI-powered tools developed by QwikZen, forming part of 
                      the QwiXSuite ecosystem of independent AI-powered tools designed to improve productivity 
                      and simplify complex tasks.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
