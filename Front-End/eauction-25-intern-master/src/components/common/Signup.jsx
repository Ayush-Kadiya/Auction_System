import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export const Signup = () => {
  // firstName:str
  // lastName:str
  // age:int
  // status:bool
  // role_id:str
  // email:str
  // password:str

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();
  const submitHandler = async (data) => {
    data.role_id = "67c94653e0705c710909c284";
    data.status = data.status == "true" ? true : false;
    console.log("formData...", data);

    try {
      const res = await axios.post("/user", data);
      console.log(res);
      console.log(res.data);
      if (res.status === 201) {
        alert("Signup success");
        navigate("/login");
      } else {
        alert("Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-signup-container">
      <div className="auth-signup-card">
        <div className="auth-signup-header">
          <h1>Create Account</h1>
          <p>Join our e-auction community today</p>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="auth-signup-form">
          <div className="auth-signup-form-row">
            <div className="auth-signup-form-group">
              <label>First Name</label>
              <input 
                type="text" 
                {...register("firstName")} 
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="auth-signup-form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                {...register("lastName")} 
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className="auth-signup-form-row">
            <div className="auth-signup-form-group">
              <label>Age</label>
              <input 
                type="number" 
                {...register("age")} 
                placeholder="Enter your age"
                min="18"
                required
              />
            </div>
            <div className="auth-signup-form-group">
              <label>Status</label>
              <select {...register("status")} required>
                <option value="">Select status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="auth-signup-form-group">
            <label>Email</label>
            <input 
              type="email" 
              {...register("email")} 
              placeholder="Enter your email address"
              required
            />
            <label>Password</label>
            <input 
              type="password" 
              {...register("password")} 
              placeholder="Create a password"
              required
            />
            <button type="submit" className="auth-signup-submit-button">
              Create Account
            </button>
            <div className="auth-signup-login-link">
              Already have an account? 
              <a href="/login"> Log in</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
