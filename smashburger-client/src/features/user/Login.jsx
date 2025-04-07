import { useNavigate, Link } from "react-router-dom";
import { userLogin } from "../../services/userLogin";
import "../../styles/auth.css";
import { AuthContext } from "../../services/AuthContext";
import { useContext, useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userData = { email, password };
      const result = await userLogin(userData);
      setUser({ token: result.token });
      navigate("/");
    } catch (error) {
      setError(
        error.message || "Failed to login. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              fill="#FFCC00"
            />
            <path
              d="M16 8C16 9.10457 15.1046 10 14 10C12.8954 10 12 9.10457 12 8C12 6.89543 12.8954 6 14 6C15.1046 6 16 6.89543 16 8Z"
              fill="#1A1A1A"
            />
            <path
              d="M10 15C10 16.1046 9.10457 17 8 17C6.89543 17 6 16.1046 6 15C6 13.8954 6.89543 13 8 13C9.10457 13 10 13.8954 10 15Z"
              fill="#1A1A1A"
            />
            <path
              d="M15 16C15 17.1046 14.1046 18 13 18C11.8954 18 11 17.1046 11 16C11 14.8954 11.8954 14 13 14C14.1046 14 15 14.8954 15 16Z"
              fill="#1A1A1A"
            />
          </svg>
        </div>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Sign in to your SmashBurger account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Dont have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
