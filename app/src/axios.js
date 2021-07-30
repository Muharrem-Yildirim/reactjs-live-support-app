import axios from "axios";
// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
// axios.defaults.baseURL = "http://127.0.0.1:2000/";
axios.defaults.headers.common = {
  Authorization: `Bearer ${localStorage.getItem("TOKEN")}`,
};
export default axios;
