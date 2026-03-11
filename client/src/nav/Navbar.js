import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await API.post("/logout");
    setUser(null);
    navigate("/login");
  };

  return (
    <div>
      <Link to="/">Home</Link> | 

      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link> | 
          <Link to="/verify-email">Verify Email</Link> | 
          <button onClick={handleLogout}>Logout</button> | 
          <span>Welcome {user.name}</span>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | 
          <Link to="/signup">Signup</Link>
        </>
      )}
    </div>
  );
};

export default Navbar;
