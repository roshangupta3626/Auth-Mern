import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post("/register", form);
    alert(res.data.message);

    if (res.data.success) {
      navigate("/verify-email");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input placeholder="Name" onChange={(e) => setForm({...form, name: e.target.value})} />
      <input placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Signup;
