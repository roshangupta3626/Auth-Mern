import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome to CodeWithRN App</h1>

      {user ? (
        <>
          <p>You are logged in as <strong>{user.name}</strong></p>
          <Link to="/dashboard">
            <button>Go to Dashboard</button>
          </Link>
        </>
      ) : (
        <>
          <p>Please Login or Signup to continue</p>
          <Link to="/login">
            <button>Login</button>
          </Link>

          <Link to="/signup">
            <button>Signup</button>
          </Link>
        </>
      )}

      <br /><br />

      <Link to="/reset-password">
        <button>Reset Password</button>
      </Link>
    </div>
  );
};

export default Home;
