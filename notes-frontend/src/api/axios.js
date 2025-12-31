import axios from "axios";

const api = axios.create({
  baseURL: "https://notes-mern-rjdu.onrender.com",
  withCredentials: true,
});

export default api;
