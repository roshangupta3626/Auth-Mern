import { useState } from "react";
import API from "../api";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");

  const sendOtp = async () => {
    const res = await API.post("/send-verify-otp");
    alert(res.data.message);
  };

  const verify = async () => {
    const res = await API.post("/verify-account", { otp });
    alert(res.data.message);
  };

  return (
    <div>
      <h2>Verify Email</h2>
      <button onClick={sendOtp}>Send OTP</button>
      <br />
      <input placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
      <button onClick={verify}>Verify</button>
    </div>
  );
};

export default VerifyEmail;
