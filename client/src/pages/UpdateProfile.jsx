import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const { theme } = useContext(ThemeContext);
  const { user, checkAuth } = useContext(AuthContext);

  const [editBio, setEditBio] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setEditBio(e.target.value);
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();

    const formData = new FormData();
    formData.append("bio", editBio);
    if (editImage) {
      formData.append("profilePic", editImage);
    }

    try {
      await axios.put("https://blogverse-id8q.onrender.com/api/auth/update-profile", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      checkAuth();
      setEditBio("")
      setEditImage(null)
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.alert("Failed to update profile");
    }
    setLoading(false)
  };

  return (
    <>
      <div
        className={`max-w-full sm:max-w-md mx-auto mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg shadow-lg transition-colors duration-500 ${theme === "light" ? "bg-white text-gray-900" : "bg-gray-900 text-gray-100"
          }`}
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Update Profile</h2>

        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-6">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 transition-colors duration-500 ${theme === "light" ? "border-blue-500" : "border-blue-400"
              } shadow-md`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={user?.profilePic || "https://staging.svgrepo.com/show/295402/user-profile.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <label
            htmlFor="imageUpload"
            className={`mt-2 cursor-pointer text-xs sm:text-sm font-medium transition-colors duration-300 hover:underline ${theme === "light" ? "text-blue-600 hover:text-blue-700" : "text-blue-400 hover:text-blue-500"
              }`}
          >
            Change Picture
          </label>
          <input
            type="file"
            id="imageUpload"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-xs sm:text-sm" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              disabled
              value={user?.fullName || ""}
              className={`w-full rounded-md border px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm transition-colors duration-500
          focus:outline-none focus:ring-2 ${theme === "light"
                  ? "border-gray-300 focus:ring-blue-500 bg-white text-gray-900"
                  : "border-gray-600 focus:ring-blue-400 bg-gray-800 text-gray-100"
                }`}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-xs sm:text-sm" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              disabled
              value={user?.email || ""}
              className={`w-full rounded-md border px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm transition-colors duration-500
          focus:outline-none focus:ring-2 ${theme === "light"
                  ? "border-gray-300 focus:ring-blue-500 bg-white text-gray-900"
                  : "border-gray-600 focus:ring-blue-400 bg-gray-800 text-gray-100"
                }`}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-xs sm:text-sm" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={editBio}
              onChange={handleChange}
              rows={3}
              placeholder="Write something about yourself..."
              className={`w-full rounded-md border px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm transition-colors duration-500 resize-none
          focus:outline-none focus:ring-2 ${theme === "light"
                  ? "border-gray-300 focus:ring-blue-500 bg-white text-gray-900"
                  : "border-gray-600 focus:ring-blue-400 bg-gray-800 text-gray-100"
                }`}
            />
          </div>

          {loading ? (
            <button
              type="submit"
              className={`w-full py-2.5 rounded-md text-sm font-semibold transition-colors duration-300 cursor-pointer ${theme === "light"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-gray-100"
                } flex justify-center items-center gap-2`}
              disabled
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Updating Profile
            </button>
          ) : (
            <button
              type="submit"
              className={`w-full py-2.5 rounded-md text-sm font-semibold transition-colors duration-300 cursor-pointer ${theme === "light"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-gray-100"
                }`}
            >
              Update Profile
            </button>
          )}
        </form>
      </div>

    </>
  );
};

export default UpdateProfile;
