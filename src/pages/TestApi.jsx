import { useEffect } from "react";
import axios from "axios";

function TestApi() {

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/test`)
      .then(res => console.log("Backend response:", res.data))
      .catch(err => console.error("API error:", err));
  }, []);

  return <h2>Check console for backend response</h2>;
}

export default TestApi;
