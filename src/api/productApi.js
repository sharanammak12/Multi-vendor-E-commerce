import axiosInstance from "./axiosInstance";

export const fetchProductsApi = async (params) => {
  const { data } = await axiosInstance.get("/user/products", {
    params,
  });
  return data;
};
