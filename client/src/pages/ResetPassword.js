import { useState } from "react";
import API from "../api";

const ResetPassword = () => {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: ""
  });

  const sendOtp = async () => {
    const res = await API.post("/send-reset-password-otp", {
      email: form.email,
    });
    alert(res.data.message);
  };

  const reset = async () => {
    const res = await API.post("/reset-password", form);
    alert(res.data.message);
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <button onClick={sendOtp}>Send OTP</button>

      <input placeholder="OTP" onChange={(e)=>setForm({...form,otp:e.target.value})}/>
      <input placeholder="New Password" onChange={(e)=>setForm({...form,newPassword:e.target.value})}/>
      <button onClick={reset}>Reset Password</button>
    </div>
  );
};

export default ResetPassword;
