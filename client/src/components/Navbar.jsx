import React, { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from '../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { toast } from "react-toastify";
import axios from 'axios';
import { BlogContext } from '../Context/BlogContext';

const Navbar = () => {
    const { blogs, setFilteredBlogs } = useContext(BlogContext);
    const [search, setSearch] = useState("");
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user, checkAuth } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        const filteredData = blogs?.filter((d) =>
            d.category.toLowerCase().includes(search.toLowerCase()) ||
            d.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredBlogs(filteredData);
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const logout = async () => {
        try {
            let res = await axios.post("https://blogverse-id8q.onrender.com/api/auth/logout",
                {},
                {
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                await checkAuth();
                navigate("/login");
                setMobileMenuOpen(false);
            }
            else {
                toast.error(res.data.message);
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <nav className={`sticky top-0 z-50 h-[10vh] border-b px-4 md:px-8 flex justify-between items-center transition-colors duration-300 ${theme === "light" ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"}`}>
            {/* Left: Logo + Search */}
            <div className="flex items-center gap-4 w-full md:w-auto">
                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-500 focus:outline-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                        navigate("/");
                        setMobileMenuOpen(false);
                    }}
                >
                    <span className="text-2xl md:text-3xl text-red-600 font-bold">Blog</span>
                    <span className="text-2xl md:text-3xl text-blue-600 font-bold">Verse</span>
                </div>

                {/* Desktop Search */}
                <div className="hidden md:block relative">
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        className={`px-4 py-2 text-sm rounded-full outline-none transition-colors duration-300 w-48 lg:w-64 ${theme === "light"
                            ? "bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            : "bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            }`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className={`absolute right-3 top-2.5 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Mobile Search (shown when menu is open) */}
            {mobileMenuOpen && (
                <div className="absolute top-16 left-0 right-0 px-4 py-2 bg-white dark:bg-gray-900 md:hidden">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            className={`w-full px-4 py-2 text-sm rounded-full outline-none transition-colors duration-300 ${theme === "light"
                                ? "bg-gray-100 text-gray-900 placeholder-gray-500"
                                : "bg-gray-700 text-white placeholder-gray-400"
                                }`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className={`absolute right-3 top-2.5 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-4 relative">
                {user ? (
                    <>
                        <button
                            className={`flex items-center gap-1 px-3 py-2 rounded-full hover:bg-opacity-90 transition-colors duration-300 text-sm font-medium ${theme === "light"
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-blue-700 text-white hover:bg-blue-800"
                                }`}
                            onClick={() => {
                                navigate("/addblog");
                                setMobileMenuOpen(false);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Blog</span>
                        </button>

                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={toggleDropdown}
                            >
                                <img
                                    className="h-10 w-10 rounded-full object-cover border-2 border-blue-500"
                                    src={user?.profilePic || "https://staging.svgrepo.com/show/295402/user-profile.svg"}
                                    alt="profile"
                                />
                                <span className={`hidden lg:block font-medium ${theme === "light" ? "text-gray-800" : "text-white"}`}>
                                    {user?.username}
                                </span>
                            </div>
                            {showDropdown && (
                                <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-50 transition-colors duration-300 ${theme === "light"
                                    ? "bg-white text-gray-800 shadow-md"
                                    : "bg-gray-800 text-white shadow-lg"
                                    }`}>
                                    <div className="py-1">
                                        <div
                                            className={`px-4 py-3 border-b ${theme === "light"
                                                ? "border-gray-200"
                                                : "border-gray-700"
                                                }`}
                                        >
                                            <p className="text-sm font-medium">{user?.username}</p>
                                            <p className="text-xs truncate">{user?.email}</p>
                                        </div>
                                        <button
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-opacity-80 transition-colors ${theme === "light"
                                                ? "hover:bg-gray-100"
                                                : "hover:bg-gray-700"
                                                }`}
                                            onClick={() => {
                                                navigate("/");
                                                setShowDropdown(false);
                                            }}
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-opacity-80 transition-colors ${theme === "light"
                                                ? "hover:bg-gray-100"
                                                : "hover:bg-gray-700"
                                                }`}
                                            onClick={() => {
                                                navigate("/updateProfile");
                                                setShowDropdown(false);
                                            }}
                                        >
                                            Update Profile
                                        </button>
                                        <button
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-opacity-80 transition-colors ${theme === "light"
                                                ? "hover:bg-gray-100"
                                                : "hover:bg-gray-700"
                                                }`}
                                            onClick={() => {
                                                navigate(`/profile/${user?._id}`);
                                                setShowDropdown(false);
                                            }}
                                        >
                                            Profile
                                        </button>
                                        <button
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-opacity-80 transition-colors ${theme === "light"
                                                ? "hover:bg-gray-100 text-red-600"
                                                : "hover:bg-gray-700 text-red-400"
                                                }`}
                                            onClick={logout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <button
                            className={`px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors duration-300 text-sm font-medium ${theme === "light"
                                ? "bg-gray-800 text-white hover:bg-gray-700"
                                : "bg-white text-gray-800 hover:bg-gray-200"
                                }`}
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                        <button
                            className={`px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors duration-300 text-sm font-medium ${theme === "light"
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-blue-700 text-white hover:bg-blue-800"
                                }`}
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </button>
                    </>
                )}

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-full focus:outline-none ${theme === "light"
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                        }`}
                >
                    {theme === "light" ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className={`absolute top-16 left-0 right-0 py-2 px-4 shadow-lg z-40 md:hidden transition-all duration-300 ${theme === "light"
                    ? "bg-white border-t border-gray-200"
                    : "bg-gray-900 border-t border-gray-700"
                    }`}>
                    {user ? (
                        <div className="flex flex-col space-y-3">
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left ${theme === "light"
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-700 text-white"
                                    }`}
                                onClick={() => {
                                    navigate("/addblog");
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Blog
                            </button>
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left 
    ${theme === "light"
                                        ? "hover:bg-gray-100 text-black"
                                        : "hover:bg-gray-800 text-white"
                                    }`}
                                onClick={() => {
                                    navigate("/");
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Dashboard
                            </button>

                            <button
                                type="button"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left ${theme === "light"
                                    ? "text-black hover:bg-gray-100"
                                    : "text-white hover:bg-gray-800"
                                    }`}
                                onClick={() => {
                                    navigate("/updateProfile");
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                Update Profile
                            </button>

                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left ${theme === "light"
                                        ? "hover:bg-gray-100 text-black"
                                        : "hover:bg-gray-800 text-white"
                                    }`}
                                onClick={() => {
                                    navigate(`/myblogs/${user?._id}`);
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                                Profile
                            </button>

                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left ${theme === "light"
                                    ? "hover:bg-gray-100 text-red-600"
                                    : "hover:bg-gray-800 text-red-400"
                                    }`}
                                onClick={logout}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                            <div className="flex items-center justify-between px-4 py-2">
                                <span className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                                    Theme
                                </span>
                                <button
                                    onClick={toggleTheme}
                                    className={`p-2 rounded-full focus:outline-none ${theme === "light"
                                        ? "bg-gray-200 text-gray-700"
                                        : "bg-gray-700 text-yellow-300"
                                        }`}
                                >
                                    {theme === "light" ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-3">
                            <button
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${theme === "light"
                                    ? "bg-gray-800 text-white hover:bg-gray-700"
                                    : "bg-white text-gray-800 hover:bg-gray-200"
                                    }`}
                                onClick={() => {
                                    navigate("/login");
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Login
                            </button>
                            <button
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${theme === "light"
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-blue-700 text-white hover:bg-blue-800"
                                    }`}
                                onClick={() => {
                                    navigate("/signup");
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Sign Up
                            </button>
                            <div className="flex items-center justify-between px-4 py-2">
                                <span className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                                    Theme
                                </span>
                                <button
                                    onClick={toggleTheme}
                                    className={`p-2 rounded-full focus:outline-none ${theme === "light"
                                        ? "bg-gray-200 text-gray-700"
                                        : "bg-gray-700 text-yellow-300"
                                        }`}
                                >
                                    {theme === "light" ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;