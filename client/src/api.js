import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/auth`,
  withCredentials: true,
});

export default API;