import axiosInstance from "./axiosInstance";

export const fetchBanners = () => {
  return axiosInstance.get("/banners");
};

export const fetchOffers = () => {
  return axiosInstance.get("/home-offers");
};

export const fetchCategories = () => {
  return axiosInstance.get("/categories");
};
export const fetchFeaturedProducts = () => {
  return axiosInstance.get("/products?featured=true");
};
