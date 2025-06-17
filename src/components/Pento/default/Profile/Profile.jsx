import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserCircle } from 'lucide-react';

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "F",
    score: 0,
    state: "",
    city: "",
    street: "",
    phone_numbers: [{ phone_num: "" }],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const userType = localStorage.getItem("userType"); // 'lender' or 'customer'
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          userType === "lender"
            ? "https://lavender-eel-222276.hostingersite.com/api/lender/profile"
            : "https://lavender-eel-222276.hostingersite.com/api/rent/customer/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data.");
      }
    };
    fetchProfile();
  }, [userType, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e, index) => {
    const { value } = e.target;
    const updatedPhones = [...profile.phone_numbers];
    updatedPhones[index].phone_num = value;
    setProfile((prev) => ({ ...prev, phone_numbers: updatedPhones }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(
        `https://lavender-eel-222276.hostingersite.com/api/${userType}/profile`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 via-purple-900 to-indigo-900 p-6">
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 max-w-3xl w-full animate-fade-in-down">
        <div className="flex flex-col items-center">
          <UserCircle className="text-purple-500 w-20 h-20 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            My Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "First Name", name: "first_name", value: profile.first_name },
            { label: "Last Name", name: "last_name", value: profile.last_name },
            { label: "Email", name: "email", value: profile.email, disabled: true },
            { label: "Gender", name: "gender", value: profile.gender },
            { label: "State", name: "state", value: profile.state },
            { label: "City", name: "city", value: profile.city },
            { label: "Street", name: "street", value: profile.street },
            { label: "Score", name: "score", value: profile.score, disabled: true },
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-1">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={field.name === "gender" ? (field.value === "F" ? "Female" : "Male") : field.value}
                onChange={field.name === "gender" ? (e) => setProfile(prev => ({ ...prev, gender: e.target.value === "Female" ? "F" : "M" })) : handleChange}
                disabled={!isEditing || field.disabled}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 shadow-inner focus:outline-none"
              />
            </div>
          ))}

          {profile.phone_numbers.map((phone, index) => (
            <div key={index}>
              <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-1">
                Phone Number {index + 1}
              </label>
              <input
                type="text"
                value={phone.phone_num}
                onChange={(e) => handlePhoneChange(e, index)}
                disabled={!isEditing}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 shadow-inner focus:outline-none"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-3 bg-green-500 text-white rounded-xl shadow-md hover:bg-green-600 transition duration-300"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl shadow-md hover:bg-purple-600 transition duration-300"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
