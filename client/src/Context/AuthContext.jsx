import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const signup = async (userData) => {
        try {
            const res = await axios.post("http://localhost:4000/api/auth/signup", userData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = res.data;
            if (data.success) {
                toast.success(data.message);
                navigate("/login")
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Signup Error:", error);
            toast.error(error.response?.data?.message || "Signup failed. Please try again.");
        }
    };

    const login = async (userData) => {
        try {
            const res = await axios.post("http://localhost:4000/api/auth/login", userData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = res.data;
            if (data.success) {
                toast.success(data.message);
                await checkAuth();
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    const checkAuth = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/auth/check", {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = res.data;
            if (data.success) {
                setUser(data.user);
                return true;
            } else {
                setUser(null);
                return false;
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, checkAuth, login, signup }}>
            {children}
        </AuthContext.Provider>
    );
};
