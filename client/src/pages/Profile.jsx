import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../Context/ThemeContext";
import { AuthContext } from "../Context/AuthContext";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";

const Profile = () => {
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);
    const { userId } = useParams();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchMyBlogs = async () => {
            try {
                const res = await axios.get(`https://blogverse-id8q.onrender.com/api/blog/user/${userId}`, {
                    withCredentials: true,
                });
                setData(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch blogs:", err);
                setLoading(false);
            }
        };

        const userProfile=async()=>{
            try{
                const res=await axios.get(`https://blogverse-id8q.onrender.com/api/auth/profile/${userId}`,{
                    withCredentials:true
                })

                setUserInfo(res)
            }
            catch (err) {
                console.error("Failed to get user profile:", err);
                setLoading(false);
            }
        }

        userProfile();
        fetchMyBlogs();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className={`min-h-screen p-6 ${theme === "light" ? "bg-gray-100 text-black" : "bg-gray-900 text-white"}`}>
            {/* User Profile */}
            {userInfo && (
                <div className="flex justify-center mt-6">
                    <div className={`bg-${theme === "light" ? "white" : "gray-800"} shadow-md rounded-xl p-6 w-full max-w-md`}>
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={userInfo.profilePic || "https://staging.svgrepo.com/show/295402/user-profile.svg"}
                                alt={userInfo.fullName}
                                className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-gray-300"
                            />
                            <h2 className="text-2xl font-semibold">{userInfo.fullName}</h2>

                            <p className={`mt-2 ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                                {userInfo.bio || "No bio available."}
                            </p>

                            <p className={`text-sm mt-2 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                                📝 Total Blogs: {data.length}
                            </p>

                            {userInfo.createdAt && (
                                <p className={`text-sm mt-1 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                                    🗓️ Joined on {new Date(userInfo.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {/* Blog List Heading */}
            <h3 className="text-2xl font-bold mb-6 text-center mt-6">Blogs Published</h3>

            {/* Blog Cards */}
            {data?.length === 0 ? (
                <p className="text-center">No blogs found.</p>
            ) : (
                <div className="space-y-6">
                    {data.map((blog) => (
                        <div
                            key={blog._id}
                            className={`relative flex flex-col md:flex-row md:items-start items-center gap-4 md:gap-6 rounded-xl shadow-lg p-5 transition-all duration-300 border hover:shadow-xl hover:-translate-y-1 ${theme === "light"
                                ? "bg-white border-gray-100 hover:border-gray-300"
                                : "bg-gray-800 border-gray-700 hover:border-gray-600"
                                }`}
                        >
                            {/* Blog Info */}
                            <div className="flex-1 w-full space-y-3">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className={`text-xl md:text-2xl font-bold ${theme === "light" ? "text-gray-800" : "text-white"}`}>
                                        {blog.title}
                                    </h3>
                                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${theme === "light"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-blue-900 text-blue-100"
                                        }`}>
                                        {blog.category || "General"}
                                    </span>
                                </div>

                                <p className={`text-sm flex items-center gap-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {blog.author?.fullName}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </p>

                                <p className={`${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                                    {blog.description?.slice(0, 140)}...
                                </p>

                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                    <span className={`flex items-center gap-1 text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                        </svg>
                                        {blog.likes?.length || 0} Likes
                                    </span>
                                    <span className={`flex items-center gap-1 text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        {blog.comments?.length || 0} Comments
                                    </span>
                                    <a
                                        href={`/blogDetail/${blog._id}`}
                                        className="ml-auto inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                    >
                                        Read More
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Blog Image */}
                            {blog.image && (
                                <div className="w-full md:w-48 h-40 overflow-hidden rounded-lg shadow-md">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
