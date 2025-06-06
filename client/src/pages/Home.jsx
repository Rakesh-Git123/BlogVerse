import React, { useEffect, useContext } from 'react';
import { ThemeContext } from '../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { BlogContext } from '../Context/BlogContext';
import Loading from "../components/Loading"

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const { filteredBlogs,fetchBlogs,loading } = useContext(BlogContext)
  const navigate = useNavigate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${theme === "light" ? "bg-gray-100" : "bg-gray-900"}`}>
      {
        loading ? <Loading /> : (
          <>
            <h1 className={`text-4xl font-bold mb-10 text-center transition-colors duration-500 ${theme === "light" ? "text-black" : "text-white"}`}>
              📰 Latest Blog Posts
            </h1>
  
            {filteredBlogs.length === 0 ? (
              <p className={`text-center text-lg ${theme === "light" ? "text-black" : "text-white"}`}>
                No blogs found.
              </p>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className={`transition-colors duration-500 w-full max-w-[350px] rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
                  >
                    <div className="h-52 w-full overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 flex flex-col gap-2">
                      <span className={`text-sm font-semibold px-3 py-1 w-fit rounded-full transition-colors duration-500 ${theme === "light" ? "bg-blue-100 text-blue-800" : "bg-blue-700 text-white"}`}>
                        {blog.category || "General"}
                      </span>
  
                      <h2 className={`text-lg font-bold transition-colors duration-500 ${theme === "light" ? "text-gray-800" : "text-white"}`}>
                        {blog.title}
                      </h2>
  
                      <p className={`text-sm transition-colors duration-500 ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                        By <span className="font-medium">{blog.author?.fullName || "Unknown"}</span> on{" "}
                        {`${monthNames[new Date(blog.date).getMonth()].slice(0, 3)} ${new Date(blog.date).getDate()}, ${new Date(blog.date).getFullYear()}`}
                      </p>
  
                      <p className={`text-sm transition-colors duration-500 ${theme === "light" ? "text-gray-700" : "text-gray-200"}`}>
                        {blog.description?.slice(0, 100)}{blog.description?.length > 100 && "..."}
                      </p>
  
                      <button
                        className={`mt-3 text-sm font-semibold w-fit px-4 py-2 rounded-md transition duration-300 cursor-pointer ${theme === "light" ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-red-600 text-white hover:bg-red-700"}`}
                        onClick={() => navigate(`/blogDetail/${blog._id}`)}
                      >
                        Read More →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )
      }
    </div>
  );
  
};

export default Home;
