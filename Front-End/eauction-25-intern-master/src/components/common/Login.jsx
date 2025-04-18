import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

export const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [isforgotpasswordCLicked, setisforgotpasswordCLicked] = useState(false);
  const [email, setemail] = useState("");

  const submitHandler = async (data) => {
    try {
      console.log("formData...", data);
      const res = await axios.post("/user/login", data);
      console.log(res.data.user._id);
      console.log(res.data);
      console.log(res);

      if (res.status === 200) {
        localStorage.setItem("id", res.data.user._id);
        localStorage.setItem("role", res.data.user.role.name);
        localStorage.setItem("userfname", res.data.user.firstName);
        localStorage.setItem("userlname", res.data.user.lastName);
        localStorage.setItem("userename", res.data.user.email);

        toast.success("Login successful!", { position: "top-center" });
        
        setTimeout(() => {
          if (res.data.user.role.name === "USER") {
            navigate("/");
          } else if (res.data.user.role.name === "ADMIN") {
            navigate("/admin/add-auction");
          }
        }, 2500);
      } else {
        toast.error("Invalid credentials", { position: "top-right" });
      }
    } catch (error) {
      toast.error("Login failed. Please try again.", { position: "top-right" });
    }
  };

  const forgotPasswordHandler = async () => {
    try {
      console.log(email);
      const res = await axios.post("/forgotpassword?email=" + email);
      console.log(res.data);
      toast.success("Reset Password link sent successfully!", { position: "top-center" });
      setisforgotpasswordCLicked(false);
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.", { position: "top-right" });
    }
  };

  return (
    <div className="auth-login-container">
      <ToastContainer />
      <div className="auth-login-card">
        <div className="auth-login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to e-Auction</p>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="auth-login-form">
          <div className="auth-login-form-group">
            <label>Email</label>
            <input 
              type="email" 
              {...register("email")} 
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="auth-login-form-group">
            <label>Password</label>
            <input 
              type="password" 
              {...register("password")} 
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="auth-login-submit-button">
            Sign In
          </button>

          <button 
            type="button"
            className="auth-login-forgot-button"
            onClick={() => setisforgotpasswordCLicked(true)}
          >
            Forgot Password?
          </button>

          {isforgotpasswordCLicked && (
            <div className="auth-login-forgot-form">
              <div className="auth-login-form-group">
                <label>Reset Password</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  onChange={(event) => setemail(event.target.value)}
                  required
                />
              </div>
              <button
                type="button"
                className="auth-login-submit-button"
                onClick={forgotPasswordHandler}
              >
                Send Reset Link
              </button>
            </div>
          )}

          <div className="auth-login-signup-link">
            Don't have an account? 
            <a href="/signup"> Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
};
