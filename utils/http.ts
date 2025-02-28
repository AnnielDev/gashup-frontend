import axios from "axios";

const http = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3006/api/"
      : "https://gashup-api-1.vercel.app/api/",
});

export default http;
