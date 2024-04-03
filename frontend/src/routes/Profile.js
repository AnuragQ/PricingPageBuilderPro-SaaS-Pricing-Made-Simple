import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import NavBar from "../components/NavBar";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios"; // Import Axios for making HTTP requests
import { Link } from "react-router-dom"; // Import Link component

const Profile = () => {
  const { currentUser } = useAuth();
  console.log("Current user:", currentUser);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Function to fetch user details
    const fetchUserDetails = async () => {
      try {
        console.log("Fetching user details...");
        const response = await axios.get(`/api/user/${currentUser.userId}`); // Assuming your API endpoint for fetching user details is /api/user/:userId
        console.log("User details:", response.data);
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    console.log("Current user:", currentUser);
    if (currentUser) {
      fetchUserDetails(); // Call fetchUserDetails if currentUser is available
    }
  },);

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-between mb-4">
        {userDetails && ( // Render user details if userDetails is available
          <div>
            <h2>{userDetails.username}</h2>
            <p>Email: {userDetails.email}</p>
            <p>Partial Stripe Key: {userDetails.stripe_key}</p>
            <Link to="/edit-profile" className="text-blue-500">
              <FaEdit /> Edit Profile
            </Link>
            {/* Add more user details and edit profile functionality */}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
