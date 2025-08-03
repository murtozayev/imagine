import axios from "axios";

const api = axios.create({
  baseURL: "https://imagine-api-ashen.vercel.app/api",
  withCredentials: true,
});

export default api;
