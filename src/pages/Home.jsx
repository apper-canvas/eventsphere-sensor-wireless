import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard
    navigate('/dashboard');
  }, [navigate]);
  
  return <div>Redirecting to dashboard...</div>;
}

export default Home;