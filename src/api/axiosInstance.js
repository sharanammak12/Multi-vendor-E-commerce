// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL.endsWith("/api")
//     ? import.meta.env.VITE_API_URL
//     : `${import.meta.env.VITE_API_URL}/api`,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /* ================= REQUEST INTERCEPTOR ================= */
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token && token !== "undefined") {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // ngrok browser warning fix
//     config.headers["ngrok-skip-browser-warning"] = "true";

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;


 import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL.endsWith("/api")
    ? import.meta.env.VITE_API_URL
    : `${import.meta.env.VITE_API_URL}/api`,

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});


/* ================= REQUEST INTERCEPTOR ================= */

axiosInstance.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token && token !== "undefined") {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    config.headers[
      "ngrok-skip-browser-warning"
    ] = "true";

    return config;
  },

  (error) => Promise.reject(error)
);



/* ================= RESPONSE INTERCEPTOR ================= */

axiosInstance.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const res = await axios.post(
          `${
            import.meta.env.VITE_API_URL.endsWith("/api")
              ? import.meta.env.VITE_API_URL
              : `${import.meta.env.VITE_API_URL}/api`
          }/user/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken =
          res.data.accessToken;

        // KEEP SAME KEY NAME
        localStorage.setItem(
          "token",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);

      } catch (refreshError) {

        localStorage.removeItem("token");

       const publicRoutes = ["/", "/login", "/register"];

if (!publicRoutes.includes(window.location.pathname)) {
  window.location.href = "/login";
}

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;