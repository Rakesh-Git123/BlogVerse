import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ThemeContext } from "../Context/ThemeContext";

const AddBlog = () => {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
  });

  const [gdloading, setGDLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Your browser does not support Speech Recognition");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setFormData((prev) => ({
            ...prev,
            description: prev.description + transcriptPiece + " ",
          }));
        } else {
          interimTranscript += transcriptPiece;
        }
      }
    };

    recognition.onerror = (event) => {
      toast.error("Speech recognition error: " + event.error);
      setIsListening(false);
      recognition.stop();
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info("Listening... Speak now");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info("Voice input stopped");
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("image", formData.image);

    try {
      const res = await axios.post("http://localhost:4000/api/blog/", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Blog created successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const generateDescription = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a blog title first.");
      return;
    }
  
    setGDLoading(true);
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
                    text: `Write a long and attractive blog description based on the title : "${formData.title}"`
                  }
                ]
              }
            ]
          })
        }
      );
  
      const data = await response.json();
  
      const generatedDescription =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  
      if (generatedDescription) {
        setFormData((prev) => ({ ...prev, description: generatedDescription }));
        toast.success("Description generated!");
      } else {
        toast.error("Could not generate description.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating description.");
    } finally {
      setGDLoading(false);
    }
  };

  return (
    <div
      className={`max-w-3xl mx-auto p-6 md:p-8 my-8 rounded-xl shadow-lg transition-colors duration-300 ${
        theme === "light"
          ? "bg-white border border-gray-100"
          : "bg-gray-800 border border-gray-700"
      }`}
    >
      <h2
        className={`text-3xl font-bold mb-8 text-center ${
          theme === "light" ? "text-gray-800" : "text-white"
        }`}
      >
        Create New Blog Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className={`block text-sm font-medium mb-2 ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}
          >
            Blog Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter the title..."
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
              theme === "light"
                ? "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                : "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            }`}
            required
          />
        </div>

        <div className="flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={generateDescription}
            disabled={loading || !formData.title.trim()}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              loading || !formData.title.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {gdloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Description
              </>
            )}
          </button>

          {!isListening ? (
            <button
              type="button"
              onClick={startListening}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Start Voice Input
            </button>
          ) : (
            <button
              type="button"
              onClick={stopListening}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Stop Voice Input
            </button>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className={`block text-sm font-medium mb-2 ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}
          >
            Blog Content
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Write your engaging blog content here..."
            rows="8"
            value={formData.description}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
              theme === "light"
                ? "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                : "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            }`}
            required
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="category"
            className={`block text-sm font-medium mb-2 ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            placeholder="e.g. Technology, Health, Travel"
            value={formData.category}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
              theme === "light"
                ? "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                : "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            }`}
            required
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className={`block text-sm font-medium mb-2 ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}
          >
            Featured Image
          </label>
          <div className={`p-3 border-2 border-dashed rounded-lg ${
            theme === "light" ? "border-gray-300 bg-gray-50" : "border-gray-600 bg-gray-700"
          }`}>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className={`block w-full text-sm ${
                theme === "dark" ? "text-white" : "text-gray-600"
              } file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium ${
                theme === "light"
                  ? "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  : "file:bg-blue-900 file:text-white hover:file:bg-blue-800"
              }`}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 flex items-center justify-center ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publishing...
            </>
          ) : (
            "Publish Blog"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;