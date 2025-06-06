import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";
import { toast } from "react-toastify";
import Loading from "./components/Loading";

const ProtectedRoute = ({ children }) => {
  const { checkAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const result = await checkAuth(); 
      if (!result) {
        toast.error("Loggin first", {
          position: "top-center",
          autoClose: 2000,
        });
      }
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
