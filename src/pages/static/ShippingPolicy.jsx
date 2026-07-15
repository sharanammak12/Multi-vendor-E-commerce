import StaticPage from "../StaticPage";
import { motion } from "framer-motion";
import {
  LocalShipping,
  AccessTime,
  TrackChanges,
  SupportAgent,
} from "@mui/icons-material";

const MotionBox = motion.div;

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const ShippingPolicy = () => {
  return (
    <StaticPage
      title="Shipping Policy"
      description="Learn how Vastraa processes, ships, and delivers your orders across India."
      sections={[
        {
          heading: "Order Processing 📦",
          icon: <LocalShipping color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Orders are processed within 24–48 hours after confirmation. Orders
              placed on weekends or holidays may be processed on the next
              working day.
            </MotionBox>
          ),
        },
        {
          heading: "Delivery Timeline ⏱️",
          icon: <AccessTime color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Delivery usually takes 2–4 days in metro cities and 3–7 days for
              other regions depending on the delivery location.
            </MotionBox>
          ),
        },
        {
          heading: "Track Your Order 📍",
          icon: <TrackChanges color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Once your order ships, you will receive a tracking link via email
              or SMS. You can also track orders from the Track Order page.
            </MotionBox>
          ),
        },
        {
          heading: "Shipping Support 🤝",
          icon: <SupportAgent color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              For shipping related issues or questions, please contact our
              support team at <strong>support@vastraa.com</strong>.
            </MotionBox>
          ),
        },
      ]}
    />
  );
};

export default ShippingPolicy;
