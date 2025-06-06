import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import { ThemeContext } from "../Context/ThemeContext";
import { toast } from "react-toastify";

const BlogDetail = () => {
    const { blogId } = useParams();
    const [apiData, setApiData] = useState({});
    const [comment, setComment] = useState("");
    const [like, setLike] = useState(0);
    const [liked, setLiked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("english");
    const [Description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [sloading, setSloading] = useState(false);
    const API_KEY = "AIzaSyAibuDiTvW5cj5_x0XKQv2c0S4s66XveHA";

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editImage, setEditImage] = useState(null);

    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const fetchBlog = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`https://blogverse-id8q.onrender.com/api/blog/${blogId}`, {
                withCredentials: true,
            });
            setApiData(res.data);
            setDescription(res.data.blog.description)

        } catch (err) {
            setApiData({ error: "Error occurred" });

        }
        setLoading(false)
    };

    const toggleLike = async () => {
        try {
            const res = await axios.post(
                `https://blogverse-id8q.onrender.com/api/blog/like/${blogId}`,
                {},
                { withCredentials: true }
            );
            setLike(res.data.likes);
            setLiked(res.data.liked);
        } catch (err) {
            console.error("Error liking blog:", err);
        }
    };

    const getLikeStatus = async () => {
        try {
            const res = await axios.get(`https://blogverse-id8q.onrender.com/api/blog/like/${blogId}`, {
                withCredentials: true,
            });
            setLike(res.data.likes);
            setLiked(res.data.liked);
        } catch (err) {
            console.error("Error fetching like status:", err);
        }
    };

    const deleteBlog = async (blogId) => {
        try {
            const res = await axios.delete(`https://blogverse-id8q.onrender.com/api/blog/${blogId}`, {
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
            }
            else {
                toast.error(res.data.message)
            }
            navigate("/");
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };


    const addComment = async () => {
        if (!comment.trim()) return alert("Comment cannot be empty");
        const res = await axios.post(
            `https://blogverse-id8q.onrender.com/api/blog/${blogId}/comments`,
            { text: comment },
            { withCredentials: true }
        );
        if (res.data.success) {
            toast.success(res.data.message);
        }
        else {
            toast.error(res.data.message)
        }
        setComment("");
        fetchBlog();
    };

    const deleteComment = async (commentId) => {
        const res = await axios.delete(`https://blogverse-id8q.onrender.com/api/blog/${blogId}/comments/${commentId}`, {
            withCredentials: true,
        });
        if (res.data.success) {
            toast.success(res.data.message);
        }
        else {
            toast.error(res.data.message)
        }
        fetchBlog();
    };

    const handleEditClick = () => {
        setEditTitle(apiData.blog.title);
        setEditDescription(apiData.blog.description);
        setEditCategory(apiData.blog.category || "");
        setEditImage(null);
        setShowModal(true);
    };

    // Modal close
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Handle file input change
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setEditImage(e.target.files[0]);
        }
    };

    // Update blog with image upload support
    const handleUpdateBlog = async () => {
        try {
            const formData = new FormData();
            formData.append("title", editTitle);
            formData.append("description", editDescription);
            formData.append("category", editCategory);
            if (editImage) {
                formData.append("image", editImage);
            }

            const res = await axios.put(
                `https://blogverse-id8q.onrender.com/api/blog/${blogId}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (res.data.success) {
                toast.success(res.data.message);
            }
            else {
                toast.error(res.data.message)
            }
            setShowModal(false);
            fetchBlog();
        } catch (err) {
            toast.error("Error updating blog");
        }
    };

    const handleLanguageChange = async (e) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);


        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `Translate this blog ${Description} into ${lang} and dont give anything extra just translate`
                                    }
                                ]
                            }
                        ]
                    })
                }
            );

            const data = await response.json();

            const translated =
                data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (translated) {
                setDescription(translated);
                toast.success("Translated");
            } else {
                toast.error("Cannot translate the description");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error translate description.");
        } finally {

        }
    };

    const summarize = async () => {
        setSloading(true);
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `Summarize this blog ${Description} in the given language  and dont give anything extra just summarize and if there are 200 words that dont summarize more just give the same description `
                                    }
                                ]
                            }
                        ]
                    })
                }
            );

            const data = await response.json();

            const summarized =
                data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (summarized) {
                setDescription(summarized);
                toast.success("Summarized");
            } else {
                toast.error("Cannot summarize the description");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error summarizing the description.");
        }
        setSloading(false)

    }


    useEffect(() => {
        fetchBlog();
        getLikeStatus();
    }, []);


    return (
        <>
            <div
                className={`min-h-screen py-8 px-4 md:px-12 ${theme === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-800"
                    }`}
            >
                {loading ? <Loading /> :
                    <>
                        <div
                            className={`max-w-3xl mx-auto shadow-md rounded-lg p-6 space-y-6 ${theme === "dark"
                                ? "bg-gray-800 text-white"
                                : "bg-white text-gray-800"
                                }`}
                        >
                            {/* Title + Edit/Delete */}
                            {Object.keys(apiData).length > 0 ?
                                <>
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-3xl font-bold">{apiData.blog.title}</h1>
                                        {apiData.user === apiData.blog.author._id && (
                                            <div className="flex space-x-4 text-xl">
                                                <i
                                                    className="bx bxs-edit cursor-pointer hover:text-blue-400"
                                                    onClick={handleEditClick}
                                                ></i>
                                                <i
                                                    className="fa-solid fa-trash cursor-pointertet text-[18px] hover:text-red-600 cursor-pointer"
                                                    onClick={() => deleteBlog(apiData.blog._id)}
                                                ></i>
                                            </div>
                                        )}
                                    </div>

                                    {/* Author + Date */}
                                    <div className="text-sm text-gray-500">
                                        Author:{" "}
                                        <span className="text-red-500 font-medium cursor-pointer" onClick={() => navigate(`/profile/${apiData.blog.author._id}`)}>
                                            @{apiData.blog.author.fullName}
                                        </span>{" "}
                                        •{" "}
                                        {`${monthNames[new Date(apiData.blog.date).getMonth()].slice(
                                            0,
                                            3
                                        )} ${new Date(apiData.blog.date).getDate()}, ${new Date(
                                            apiData.blog.date
                                        ).getFullYear()}`}
                                    </div>

                                    {/* Image */}
                                    <img
                                        src={apiData.blog.image}
                                        alt={apiData.blog.title}
                                        className="w-full max-h-[500px] object-contain rounded-lg"
                                    />

                                    {/* Translate & Summarize Buttons */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <label htmlFor="lang" className="text-sm font-medium">
                                                Translate:
                                            </label>
                                            <select
                                                id="lang"
                                                className="border px-2 py-1 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
                                                onChange={handleLanguageChange}
                                                value={selectedLanguage}
                                            >
                                                <option value="english">English</option>
                                                <option value="hindi">Hindi</option>
                                            </select>
                                        </div>
                                        <button
                                            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 text-sm cursor-pointer"
                                            onClick={summarize}
                                        >
                                            {sloading ? "Summarizing..." : "Summarize"}
                                        </button>
                                    </div>

                                    {/* Description */}
                                    <p className="text-md leading-relaxed">{Description || blog.description}</p>
                                    <i
                                        className={`fa-solid fa-thumbs-up cursor-pointer text-xl transition-colors duration-300 ${liked ? "text-red-600" : "text-gray-400"
                                            }`}
                                        onClick={toggleLike}
                                    />{" "}
                                    <span>{like}</span>

                                    {/* Comments Section */}
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4">Comments</h2>
                                        <div className="space-y-4">
                                            {apiData.blog.comments.map((c, i) => (
                                                <div
                                                    key={i}
                                                    className={`relative border p-4 pr-10 rounded-md ${theme === "dark"
                                                        ? "bg-gray-700 border-gray-600"
                                                        : "bg-gray-100"
                                                        }`}
                                                >
                                                    {apiData.user === c.author._id && (
                                                        <button
                                                            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                                            onClick={() => deleteComment(c._id)}
                                                            aria-label="Delete Comment"
                                                        >
                                                            <i className="fa-solid fa-trash cursor-pointer"></i>
                                                        </button>
                                                    )}
                                                    <div className="flex items-center gap-4 text-sm mb-2">
                                                        <span className="font-medium">@{c.author.fullName}</span>
                                                        <span className="text-xs text-gray-400">
                                                            {`${monthNames[new Date(c.date).getMonth()].slice(
                                                                0,
                                                                3
                                                            )} ${new Date(c.date).getDate()}, ${new Date(
                                                                c.date
                                                            ).getFullYear()}`}
                                                        </span>
                                                    </div>
                                                    <p>{c.text}</p>
                                                </div>
                                            ))}

                                        </div>

                                        {/* Add Comment */}
                                        <div className="mt-6">
                                            <div className="flex flex-wrap gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Write a comment..."
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    className={`flex-1 min-w-[200px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark"
                                                            ? "bg-gray-700 text-white border-gray-600"
                                                            : ""
                                                        }`}
                                                />
                                                <button
                                                    onClick={addComment}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </> : <></>
                            }
                        </div>
                    </>
                }
            </div>

            {/* Modal code remains unchanged */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow-lg w-full max-w-lg">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <h5 className="text-lg font-semibold">Edit Blog</h5>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-white focus:outline-none"
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Category</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Description</label>
                                <textarea
                                    rows="4"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                            <button
                                className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                onClick={handleUpdateBlog}
                            >
                                Save changes
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </>
    );

};

export default BlogDetail;
