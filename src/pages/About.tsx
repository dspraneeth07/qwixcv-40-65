
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { 
  GraduationCap, Code, Cpu, Award, Briefcase, Star, GitBranch, Github, Linkedin, Mail, 
  ArrowRight, Globe, Rocket, Lightbulb, Heart, Shield, Zap, BookOpen, Target, 
  Sparkles, Users, Layers, MessageSquare, Coffee, Microscope, Brain
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

interface ValueProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const ValueCard: React.FC<ValueProps> = ({ icon, title, description }) => (
  <Card className="border-l-4 border-l-modern-blue-500 hover:shadow-lg transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="bg-modern-blue-100 p-3 rounded-full text-modern-blue-600">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const About = () => {
  const [activeTeamMember, setActiveTeamMember] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>("about");

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Dhadi Sai Praneeth Reddy",
      role: "Founder & CTO of QwikZen Group India",
      education: "Student at Vasavi College of Engineering, CSE Department",
      rollNo: "1602-23-733-038",
      bio: "An emerging leader in India's deep-tech and innovation landscape. His work spans the convergence of Artificial Intelligence, Embedded IoT, Natural Language Processing (NLP), and Sacred Geography Research, reflecting a rare blend of technical depth, interdisciplinary curiosity, and visionary entrepreneurship.",
      expertise: ["AI", "Machine Learning", "IoT", "NLP", "Generative AI", "Deep Tech", "Research"],
      achievements: [
        "QwiXSuite: A powerful suite of AI tools for code generation, real-time translation, and more",
        "QwiXGenie: An independently developed AI coding assistant built using transformer-based models",
        "QwikZen Store: Smart IoT hardware such as automatic water tank controllers with real-time monitoring",
        "XpeditionR: Research exploring Indian sacred geography using GIS, NLP, and original fieldwork",
        "QwiXEd: Educational initiative combining AI and pedagogy for real-time learning improvements",
        "First place in the Gen AI Hackathon by SmartBridge, NASSCOM, and FutureSkills Prime",
        "Published peer-reviewed research in multiple domains"
      ],
      image: "/placeholder.svg",
      github: "github.com/dspraneeth07",
      linkedin: "linkedin.com/in/dspraneeth07",
      email: "spreddydhadi@gmail.com"
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

  const coreValues = [
    {
      icon: <Rocket className="h-5 w-5" />,
      title: "Innovation",
      description: "Constantly pushing boundaries to create groundbreaking solutions."
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Excellence",
      description: "Delivering high-quality AI products that stand out in the industry."
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Accessibility",
      description: "Ensuring AI-driven tools are easy to use for everyone."
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Impact",
      description: "Solving real-world problems through AI and automation."
    }
  ];

  const innovations = [
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "QwiX AI",
      description: "A powerful AI chatbot built to enhance user experience and automation across platforms."
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: "QwiXSuite",
      description: "A unified hub for AI-powered applications, including real-time translation and AI coding assistance."
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "QwiXEd",
      description: "A premium educational platform providing interactive e-books and AI-driven learning tools."
    },
    {
      icon: <Cpu className="h-5 w-5" />,
      title: "QwikZen Store",
      description: "A marketplace for innovative hardware solutions, including IoT-powered automation devices."
    },
    {
      icon: <Microscope className="h-5 w-5" />,
      title: "XpeditionR",
      description: "A research-driven initiative exploring ancient sciences and AI-powered historical studies."
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "QOS",
      description: "An ambitious project aimed at creating a next-generation AI-powered Operating System."
    }
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section */}
        <section className="py-16 md:py-24 overflow-hidden">
          <div className="container max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair gradient-text leading-tight">
                About QwikZen
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
                Empowering the Future with AI & Innovation
              </p>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "160px" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-1 bg-gradient-to-r from-modern-blue-500 to-soft-purple mx-auto mt-10 rounded-full"
              />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
                <h3 className="text-xl font-medium mb-4 text-modern-blue-600">The Birth of QwikZen</h3>
                <p className="text-gray-600 mb-4">
                  QwikZen emerged as a bold initiative to push the boundaries of AI, automation, and research. 
                  Founded by a team of passionate technologists and researchers, we set out to create solutions 
                  that harness the power of artificial intelligence to solve real-world problems.
                </p>
                <p className="text-gray-600 mb-4">
                  What began as a small AI research project quickly evolved into a comprehensive technology 
                  company with ambitious goals. Our team's unwavering commitment to innovation and excellence 
                  has driven us to develop groundbreaking solutions across software, hardware, and education.
                </p>
                <p className="text-gray-600">
                  Today, QwikZen stands at the forefront of AI innovation, constantly pushing the limits of 
                  what's possible and reimagining how technology can enhance human capabilities and transform industries.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <div className="relative z-10">
                  <Card className="glassmorphism overflow-hidden border-none">
                    <CardContent className="p-8">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6">
                          <div className="text-3xl font-bold gradient-text mb-2">Our Vision</div>
                          <Separator className="w-24 mx-auto bg-modern-blue-300" />
                        </div>
                        <p className="text-xl italic text-gray-700">
                          "To redefine AI-driven technology by developing innovative, intelligent, and accessible 
                          solutions that transform industries and empower individuals."
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="absolute top-0 left-0 w-full h-full transform -translate-x-4 translate-y-4 rounded-xl bg-modern-blue-100 -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="py-8 bg-gray-50 border-y border-gray-200">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-2 md:gap-8">
              <Button 
                variant={activeSection === "about" ? "default" : "ghost"} 
                onClick={() => setActiveSection("about")}
                className="rounded-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Who We Are
              </Button>
              <Button 
                variant={activeSection === "what" ? "default" : "ghost"} 
                onClick={() => setActiveSection("what")}
                className="rounded-full"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                What We Do
              </Button>
              <Button 
                variant={activeSection === "values" ? "default" : "ghost"} 
                onClick={() => setActiveSection("values")}
                className="rounded-full"
              >
                <Heart className="w-4 h-4 mr-2" />
                Our Values
              </Button>
              <Button 
                variant={activeSection === "team" ? "default" : "ghost"} 
                onClick={() => setActiveSection("team")}
                className="rounded-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Our Team
              </Button>
              <Button 
                variant={activeSection === "research" ? "default" : "ghost"} 
                onClick={() => setActiveSection("research")}
                className="rounded-full"
              >
                <Microscope className="w-4 h-4 mr-2" />
                Research
              </Button>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        {activeSection === "about" && (
          <motion.section 
            className="py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="container max-w-6xl">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 px-6 py-1 text-modern-blue-600 border-modern-blue-200">
                  About Us
                </Badge>
                <h2 className="text-3xl font-bold mb-4">Our Mission and Values</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  QwikZen was founded with a clear vision: to democratize AI and make cutting-edge technology 
                  accessible to businesses of all sizes. We're passionate about innovation, excellence, and 
                  creating solutions that drive real value.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-12">
                <Card className="overflow-hidden border-t-4 border-t-modern-blue-600">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-6">Who We Are</h3>
                    <p className="text-gray-600 mb-4">
                      QwikZen is a forward-thinking AI startup based in Hyderabad, Telangana that specializes 
                      in developing intelligent software solutions for businesses across various sectors. 
                      Founded in 2022, we've quickly established ourselves as innovators in the AI space, 
                      creating tools that drive efficiency, insights, and growth.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Our team consists of AI engineers, data scientists, software developers, and business 
                      strategists who share a common passion for technology and its potential to transform 
                      industries. We collaborate closely with our clients, understanding their unique challenges 
                      and tailoring our solutions to meet their specific needs.
                    </p>
                    <p className="text-gray-600">
                      At QwikZen, we believe in the democratization of AI technology. Our zero-investment, 
                      high-impact philosophy guides our approach to product development, ensuring that businesses 
                      of all sizes can leverage the power of artificial intelligence to stay competitive in an 
                      increasingly digital world.
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ValueCard 
                    icon={<Brain className="h-5 w-5" />}
                    title="AI-First Approach"
                    description="We integrate artificial intelligence at the core of everything we build, creating intelligent systems that learn and evolve."
                  />
                  <ValueCard 
                    icon={<Sparkles className="h-5 w-5" />}
                    title="Innovation-Driven"
                    description="Our team continuously explores new technologies and methodologies to deliver groundbreaking solutions."
                  />
                  <ValueCard 
                    icon={<Shield className="h-5 w-5" />}
                    title="Quality Excellence"
                    description="We uphold the highest standards in our development process, ensuring reliable and secure products."
                  />
                  <ValueCard 
                    icon={<Zap className="h-5 w-5" />}
                    title="Rapid Delivery"
                    description="Our streamlined processes allow us to move quickly from concept to implementation without compromising quality."
                  />
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* What We Do Section */}
        {activeSection === "what" && (
          <motion.section 
            className="py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="container max-w-6xl">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 px-6 py-1 text-modern-blue-600 border-modern-blue-200">
                  What We Do
                </Badge>
                <h2 className="text-3xl font-bold mb-4">Our Key Innovations</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  At QwikZen, we develop cutting-edge AI solutions that span software, hardware, and education, 
                  all designed to enhance productivity and transform industries.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {innovations.map((innovation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="bg-modern-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-modern-blue-600 group-hover:bg-modern-blue-600 group-hover:text-white transition-all duration-300">
                          {innovation.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{innovation.title}</h3>
                        <p className="text-gray-600 flex-grow">{innovation.description}</p>
                        <Button variant="ghost" className="mt-4 self-start">Learn more <ArrowRight className="ml-2 w-4 h-4" /></Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="mt-16">
                <Card className="border-none bg-gradient-to-r from-modern-blue-600 to-soft-purple text-white">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="mb-6 md:mb-0">
                        <h3 className="text-2xl font-bold mb-2">Why Choose Us</h3>
                        <p className="text-white/80">
                          Our commitment to excellence and innovation sets us apart in the rapidly evolving technology landscape.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-white/20 p-2 rounded-full">
                            <Cpu className="h-4 w-4" />
                          </div>
                          <span>AI-Powered Innovation</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-white/20 p-2 rounded-full">
                            <Target className="h-4 w-4" />
                          </div>
                          <span>Real-World Impact</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-white/20 p-2 rounded-full">
                            <Layers className="h-4 w-4" />
                          </div>
                          <span>Seamless Integration</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-white/20 p-2 rounded-full">
                            <Rocket className="h-4 w-4" />
                          </div>
                          <span>Futuristic Vision</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.section>
        )}

        {/* Our Values Section */}
        {activeSection === "values" && (
          <motion.section 
            className="py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="container max-w-6xl">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 px-6 py-1 text-modern-blue-600 border-modern-blue-200">
                  Our Core Values
                </Badge>
                <h2 className="text-3xl font-bold mb-4">What Drives Us</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our values are the foundation of everything we do at QwikZen, guiding our decisions
                  and shaping our culture.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                {coreValues.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden text-center">
                      <CardContent className="p-6">
                        <div className="bg-modern-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-modern-blue-600 mx-auto">
                          {value.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                        <p className="text-gray-600">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="mt-16 max-w-3xl mx-auto">
                <Card className="border-none bg-gradient-to-r from-white to-gray-50 shadow-lg">
                  <CardContent className="p-8">
                    <blockquote className="text-center">
                      <p className="text-xl italic text-gray-700 mb-6">
                        "At QwikZen, we believe that meaningful innovation comes from a deep understanding of real-world problems. 
                        That's why our research is focused on developing practical applications of advanced AI that can be 
                        deployed to solve complex challenges across industries."
                      </p>
                      <footer className="text-gray-500">
                        <strong>Dhadi Sai Praneeth Reddy</strong>, Founder & CTO
                      </footer>
                    </blockquote>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.section>
        )}

        {/* Team Section */}
        {activeSection === "team" && (
          <motion.section 
            className="py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            variants={staggerContainer}
          >
            <div className="container max-w-6xl">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 px-6 py-1 text-modern-blue-600 border-modern-blue-200">
                  Team QwikZen
                </Badge>
                <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  A diverse team of AI specialists, developers, designers, and domain experts working together 
                  to create exceptional AI solutions.
                </p>
              </div>

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
            </div>
          </motion.section>
        )}

        {/* Research Section */}
        {activeSection === "research" && (
          <motion.section 
            className="py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="container max-w-6xl">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 px-6 py-1 text-modern-blue-600 border-modern-blue-200">
                  Research & Innovation
                </Badge>
                <h2 className="text-3xl font-bold mb-4">Xpeditionr Research Group</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our dedicated research division is pushing the boundaries of what's possible with AI and emerging technologies.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h3 className="text-xl font-bold mb-4">Research Focus Areas</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-modern-blue-100 p-2 rounded-full text-modern-blue-600">
                        <Brain className="h-5 w-5" />
                      </div>
                      <span className="font-medium">Advanced Machine Learning Algorithms</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-modern-blue-100 p-2 rounded-full text-modern-blue-600">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <span className="font-medium">Natural Language Processing & Generation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-modern-blue-100 p-2 rounded-full text-modern-blue-600">
                        <Cpu className="h-5 w-5" />
                      </div>
                      <span className="font-medium">Quantum Computing Applications</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-modern-blue-100 p-2 rounded-full text-modern-blue-600">
                        <Users className="h-5 w-5" />
                      </div>
                      <span className="font-medium">Human-AI Collaboration Models</span>
                    </div>
                  </div>
                </div>

                <Card className="bg-gradient-to-r from-modern-blue-600 to-soft-purple text-white">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-4">Join Our Research Team</h3>
                    <p className="mb-4">
                      We're looking for passionate researchers and engineers to join our team and help push the boundaries 
                      of AI innovation. If you're interested in working on cutting-edge technology, we'd love to hear from you.
                    </p>
                    <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold mb-4 text-center">Driving Innovation Through Research</h3>
                <p className="text-gray-600 mb-4">
                  Xpeditionr Research Group is QwikZen's innovation engine, dedicated to exploring cutting-edge 
                  technologies and developing breakthrough solutions. Our team of researchers, engineers, and domain 
                  experts collaborates with academic institutions and industry partners to push the boundaries of 
                  artificial intelligence.
                </p>
                <p className="text-gray-600 mb-4">
                  We believe that meaningful innovation comes from a deep understanding of real-world problems. 
                  That's why our research is focused on developing practical applications of advanced AI that can 
                  be deployed to solve complex challenges across industries.
                </p>
                <p className="text-gray-600">
                  Our research group regularly publishes papers, participates in industry conferences, and hosts 
                  workshops to share knowledge and foster collaboration within the AI community.
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Join Us Section */}
        <motion.section 
          className="py-16 bg-gradient-to-r from-modern-blue-600 to-soft-purple text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="container max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Join the QwikZen Revolution</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Be part of our mission to redefine the future with AI-powered innovation. Explore our products, 
                research, and educational resources to start your journey.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-white text-modern-blue-600 hover:bg-white/90">
                  Explore QwiXSuite
                </Button>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  Discover AI Education
                </Button>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </MainLayout>
  );
};

export default About;
