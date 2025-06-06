import React, { createContext, useState, useEffect } from "react";
import axios from "axios"
export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs,setFilteredBlogs]=useState([]);
    const [loading,setLoading]=useState(false);

  const fetchBlogs = async () => {
    try {
        setLoading(true);
      const res = await axios.get('http://localhost:4000/api/blog'); 
      setBlogs(res.data);
      setFilteredBlogs(res.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
    setLoading(false)
  };

  return (
    <BlogContext.Provider value={{ blogs,setBlogs,filteredBlogs,setFilteredBlogs,fetchBlogs,loading  }}>
      {children}
    </BlogContext.Provider>
  );
};
