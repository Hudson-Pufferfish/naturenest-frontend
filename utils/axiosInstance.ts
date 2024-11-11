import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://naturenest-main-service.up.railway.app/api/" ?? "http://localhost:4400/api/",
});

export default axiosInstance;
