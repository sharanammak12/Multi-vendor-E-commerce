import { useEffect, useState } from "react";
import { Box, Skeleton } from "@mui/material";
import HeroBanner from "../components/home/HeroBanner";
import DiscountSlider from "../components/home/BoxSlider";
import OfferGrid from "../components/home/OfferGrid";
import CategorySection from "../components/home/CategorySection";
import SalesSlider from "../components/home/SalesSlider";
import OffersSlider from "../components/home/OffersSlider";
import axiosInstance from "../api/axiosInstance";

const Home = () => {
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    const fetchHomePage = async () => {
      try {
        const res = await axiosInstance.get("/homepage");
        if (res.data.success) {
          setHomeData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching homepage:", err);
      }
    };

    fetchHomePage();
  }, []);

  /* ================= LOADING UI ================= */
  if (!homeData) {
    return (
      <Box sx={{ px: 2, py: 3 }}>
        <Skeleton variant="rectangular" height={260} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={200} />
      </Box>
    );
  }

  /* ================= DATA ================= */
  const heroBanner = homeData.heroBanners?.[0]
    ? {
        title: homeData.heroBanners[0].title,
        subtitle: homeData.heroBanners[0].subtitle,
        products: homeData.heroBanners[0].images?.map((img) => img.url),
      }
    : null;

  const offerGrid = homeData.offerGrid?.map((item) => ({
    ...item,
    images: item.images?.map((img) => img.url),
  }));

  const categories = homeData.categories?.map((cat) => ({
    ...cat,
    image: cat.image?.url,
  }));

  const offerBanners = homeData.offerBanners?.map((offer) => ({
    ...offer,
    image: offer.image?.url,
  }));

  const discountSlides = homeData.promotionBanners?.map((item) => ({
    image: item.image?.url,
  }));

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#f1f3f6", // 🔥 Flipkart style bg
        minHeight: "100vh",
      }}
    >
      {/* ================= HERO ================= */}
      {heroBanner && (
        <Box sx={{ px: { xs: 1.5, md: 3 }, pt: 2 }}>
          <Box
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              bgcolor: "#fff",
            }}
          >
            <HeroBanner banner={heroBanner} />
          </Box>
        </Box>
      )}

      {/* ================= OFFERS SLIDER ================= */}
      {offerBanners?.length > 0 && (
        <Box sx={{ px: { xs: 1.5, md: 3 }, mt: 2 }}>
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 3,
              p: 2,
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            }}
          >
            <OffersSlider offers={offerBanners} />
          </Box>
        </Box>
      )}

      {/* ================= OFFER GRID ================= */}
      {offerGrid?.length > 0 && (
        <Box sx={{ px: { xs: 1.5, md: 3 }, mt: 3 }}>
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 3,
              p: 2.5,
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            }}
          >
            <OfferGrid offers={offerGrid} />
          </Box>
        </Box>
      )}

      {/* ================= DISCOUNT ================= */}
      {discountSlides?.length > 0 && (
        <Box sx={{ px: { xs: 1.5, md: 3 }, mt: 3 }}>
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 3,
              p: 2,
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            }}
          >
            <DiscountSlider items={discountSlides} />
          </Box>
        </Box>
      )}

      {/* ================= CATEGORIES ================= */}
      {categories?.length > 0 && (
        <Box sx={{ px: { xs: 1.5, md: 3 }, mt: 3, pb: 4 }}>
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 3,
              p: 2.5,
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            }}
          >
            <CategorySection categories={categories} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Home;
