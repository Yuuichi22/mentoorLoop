import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/Store";
import defaultProfile from "../assets/defaultProfile.webp";

export const Profile = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="pt-20 p-5 max-w-lg mx-auto shadow-lg rounded-lg bg-white">
      {/* Profile Picture */}
      <div className="flex flex-col items-center">
        <div className="rounded-full overflow-hidden bg-gray-200 h-24 w-24">
          <img
            src={user.profileUrl ? user.profileUrl : defaultProfile}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-semibold mt-3">
          {user.firstname || "John"} {user.lastname || "Doe"}
        </h2>
        <p className="text-gray-500">{user.user_type || "User"}</p>
      </div>

      {/* Email */}
      <div className="mt-4 text-center text-gray-700">{user.email}</div>

      {/* Bio Section */}
      <div className="mt-3 p-3 bg-gray-100 rounded-md">
        <p className="text-gray-600 text-sm">
          {user.bio ||
            "Hey there! You can write your bio here. Share something interesting about yourself!"}
        </p>
      </div>

      {/* Conditional Rendering Based on user_type */}
      <div className="mt-5">
        {user.user_type === "ALUMINI" ? (
          <div className="p-3 bg-blue-50 rounded-md">
            <h3 className="text-lg font-semibold text-blue-600">Alumni Details</h3>
            <p><strong>Company:</strong> {user.company || "N/A"}</p>
            <p><strong>Role:</strong> {user.role || "N/A"}</p>
            <p><strong>Experience:</strong> {user.experience || "N/A"} years</p>
          </div>
        ) : user.user_type === "STUDENT" ? (
          <div className="p-3 bg-green-50 rounded-md">
            <h3 className="text-lg font-semibold text-green-600">Student Details</h3>
            <p><strong>University:</strong> {user.university || "N/A"}</p>
            <p><strong>Course:</strong> {user.course || "N/A"}</p>
            <p><strong>Batch:</strong> {user.batch || "N/A"}</p>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold text-gray-600">General User</h3>
            <p>No additional information available.</p>
          </div>
        )}
      </div>

      {/* Edit Profile Button */}
      <div className="mt-5 flex justify-center">
        <Link to="/edit-profile">
          <button className="bg-black text-white px-5 py-2 rounded-lg">
            Edit Profile
          </button>
        </Link>
      </div>
    </div>
  );
};
