import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebaseConfig"; // Import Firestore instance
import { doc, getDoc } from "firebase/firestore";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // To track admin role
  const [checkingRole, setCheckingRole] = useState<boolean>(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        setCheckingRole(true); // Start checking role
        try {
          const userDocRef = doc(db, "users", user.uid); // Reference to the Firestore document
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists() && userDoc.data().role === "admin") {
            setIsAdmin(true); // User is admin
          } else {
            setIsAdmin(false); // User is not admin
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsAdmin(false); // Fallback to not admin
        } finally {
          setCheckingRole(false); // Done checking role
        }
      }
    };

    if (user) {
      checkAdminRole();
    }
  }, [user]);

  if (loading || checkingRole) {
    return <div className="text-center mt-10">Loading...</div>; // Show loading while checking
  }

  if (!user) {
    return <Navigate to="https://firebase-admin-dashboard-4bu5n9gx2-meghals-projects.vercel.app/login" />; // Redirect if not authenticated
  }

  if (isAdmin === false) {
    return (
      <div className="text-center mt-10 text-red-600">
        You do not have permission to access the dashboard because your role is not an admin.
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
