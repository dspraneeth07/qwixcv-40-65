
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user role
    if (user) {
      switch(user.role) {
        case 'student':
          navigate('/student-home');
          break;
        case 'organization':
          navigate('/organization-home');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/student-home');
      }
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </Layout>
  );
};

export default Dashboard;
