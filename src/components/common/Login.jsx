import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [isforgotpasswordCLicked, setisforgotpasswordCLicked] = useState(false);
  const [email, setemail] = useState("");

  const submitHandler = async (data) => {
    try {
      console.log("formData...", data);

      const res = await axios.post("/user/login", data);
      console.log(res.data.user._id); // axios
      console.log(res.data); // API response
      console.log(res)

      if (res.status === 200) {
        localStorage.setItem("id", res.data.user._id);
        localStorage.setItem("role", res.data.user.role.name);

        toast.success("Login successful!", { position: "top-right" });
        
        setTimeout(() => {
          if (res.data.user.role.name === "USER") {
            navigate("/user/dashboard"); // Navigate to user dashboard
          } else if (res.data.user.role.name === "ADMIN") {
            navigate("/admin"); // Navigate to admin page
          }
        }, 3500);
        const forgotPasswordHandler = async () => {
          console.log(email);
          const res = await axios.post("/forgotpassword?email=" + email);
          console.log(res.data);
          toast.success("Reset Password link send successful!", { position: "top-right" });
        };
      } else {
        toast.error("Invalid credentials", { position: "top-right" });
      }
    } catch (error) {
      toast.error("Login failed. Please try again.", { position: "top-right" });
    }
  };


  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-box">
        <h1>LOGIN</h1>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label>EMAIL</label>
            <input type="email" {...register("email")} />
          </div>
          <div className="form-group">
            <label>PASSWORD</label>
            <input type="password" {...register("password")} />
          </div>
          <div>
            <input type="submit" value="LOGIN" className="submit-button" />
          </div>
        <div>
          <button
            onClick={() => {
              setisforgotpasswordCLicked(true);
            }}
          >
            FORGOT PASSWORD
          </button>
        </div>
        {isforgotpasswordCLicked && (
          <div>
            <label>ENTER EMAIL</label>
            <input
              type="text"
              onChange={(event) => {
                setemail(event.target.value);
              }}
            ></input>
            <button
              onClick={() => {
                forgotPasswordHandler();
              }}
            >
              submit
            </button>
          </div>
        )}
        </form>

      </div>
    </div>
  );
};
