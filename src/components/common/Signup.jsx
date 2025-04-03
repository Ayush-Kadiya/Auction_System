import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


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

    //api call
    const res = await axios.post("/user", data);
    console.log(res); //axios
    console.log(res.data); //api response
    if (res.status === 201) {
      alert("Signup success");
      navigate("/login"); // check in app.j slogin...
    } else {
      alert("Signup failed");
    }
  };
  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit(submitHandler)} className="signup-form">
        <div className="form-group">
          <label>First Name</label>
          <input type="text" {...register("firstName")} />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" {...register("lastName")} />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input type="number" {...register("age")} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <input type="text" {...register("status")} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register("email")} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" {...register("password")} />
        </div>
        <div>
          <input type="submit" value="Signup" className="submit-button" />
        </div>
        <div>
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};
