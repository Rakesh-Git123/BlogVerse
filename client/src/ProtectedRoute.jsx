import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";
import Loading from "./components/Loading";

const ProtectedRoute = ({ children }) => {
  const { checkAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const result = await checkAuth(); 
      setIsAuthenticated(result);
      setLoading(false);
    };

    verifyUser();
  }, []);

  if (loading) return <Loading/>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
