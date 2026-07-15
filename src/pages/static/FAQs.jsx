import StaticPage from "../StaticPage";
import { motion } from "framer-motion";
import {
  LocalShippingOutlined,
  PaymentsOutlined,
  HelpOutline,
} from "@mui/icons-material";

const MotionBox = motion.div;

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const FAQs = () => {
  return (
    <StaticPage
      title="Frequently Asked Questions"
      description="Clear answers to common questions about shopping on Vastraa."
      sections={[
        {
          heading: "Is Cash on Delivery available? 💳",
          icon: <PaymentsOutlined color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Yes, Cash on Delivery (COD) is available for select locations and
              eligible products. Availability may vary based on your pin code
              and order value.
            </MotionBox>
          ),
        },
        {
          heading: "Do you ship across India? 🚚",
          icon: <LocalShippingOutlined color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              We deliver to most serviceable pin codes across India. Delivery
              timelines may vary depending on your location and seller dispatch.
            </MotionBox>
          ),
        },
        {
          heading: "Need more help? ❓",
          icon: <HelpOutline color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              If your question isn’t listed here, please visit our Support page
              or reach out to our customer support team. We’re here to help.
            </MotionBox>
          ),
        },
      ]}
    />
  );
};

export default FAQs;
