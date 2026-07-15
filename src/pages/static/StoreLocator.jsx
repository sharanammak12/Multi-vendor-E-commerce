import StaticPage from "../StaticPage";
import { motion } from "framer-motion";
import { LocationOnOutlined, StoreOutlined } from "@mui/icons-material";

const MotionBox = motion.div;

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const StoreLocator = () => {
  return (
    <StaticPage
      title="Store Locator"
      description="Discover Vastraa partner stores and upcoming offline locations across India."
      sections={[
        {
          heading: "Currently Available Locations 📍",
          icon: <LocationOnOutlined color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Vastraa partner stores are currently available in select cities,
              including Bangalore, Mumbai, Pune, and Hyderabad. Availability may
              vary based on seller participation in each region.
            </MotionBox>
          ),
        },
        {
          heading: "Offline Expansion Plans 🏬",
          icon: <StoreOutlined color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              We are actively working on expanding our offline presence across
              major Indian cities. More partner stores and experience centers
              will be added as Vastraa continues to grow.
            </MotionBox>
          ),
        },
      ]}
    />
  );
};

export default StoreLocator;
