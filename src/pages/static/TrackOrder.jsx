import StaticPage from "../StaticPage";
import { motion } from "framer-motion";
import { LocalShippingOutlined, ScheduleOutlined } from "@mui/icons-material";

const MotionBox = motion.div;

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const TrackOrder = () => {
  return (
    <StaticPage
      title="Track Your Order"
      description="Order tracking will be available soon as we complete payment and logistics integration."
      sections={[
        {
          heading: "Order Tracking – Coming Soon 🚧",
          icon: <ScheduleOutlined color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Once enabled, you’ll be able to track your order status in real
              time using your Order ID directly from your account or order
              confirmation page.
            </MotionBox>
          ),
        },
        {
          heading: "What to Expect 📦",
          icon: <LocalShippingOutlined color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Order tracking will include confirmation, dispatch, in-transit,
              and delivery updates, helping you stay informed at every step.
            </MotionBox>
          ),
        },
      ]}
    />
  );
};

export default TrackOrder;
