import axios from 'axios';

axios.interceptors.response.use(
  async (value) => {
    return value;
  },
  function (error) {
    if (error?.response?.data?.status === 401 && (error?.response?.data?.message.toLowerCase() === "invalid token" || error?.response?.data?.message.toLowerCase() === "jwt expired")) {
      localStorage.clear()
      window.location.href = "/";
    }
    return Promise.reject(error);
  });

axios.interceptors.request.use(async function (config) {
  const token = localStorage.getItem("token")
  if (token && config.headers)
    config.headers.Authorization = "Bearer " + token
  return config;
}, function (error) {
  return Promise.reject(error);
});

export default axios;