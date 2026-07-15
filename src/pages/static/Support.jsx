import StaticPage from "../StaticPage";
import { motion } from "framer-motion";
import {
  EmailOutlined,
  PhoneOutlined,
  AccessTimeOutlined,
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

const Support = () => {
  return (
    <StaticPage
      title="Contact Us"
      description="Need assistance? Our support team is here to help you with your orders and inquiries."
      sections={[
        {
          heading: "Email Support 📧",
          icon: <EmailOutlined color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              You can reach us anytime at <strong>support@vastraa.com</strong>.
              We aim to respond to all queries as quickly as possible.
            </MotionBox>
          ),
        },
        {
          heading: "Phone Support 📞",
          icon: <PhoneOutlined color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Call us at <strong>+91 9380639997</strong> for immediate
              assistance during our working hours.
            </MotionBox>
          ),
        },
        {
          heading: "Working Hours ⏰",
          icon: <AccessTimeOutlined color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Our support team is available Monday to Saturday, from 10:00 AM to
              6:00 PM (IST), excluding public holidays.
            </MotionBox>
          ),
        },
      ]}
    />
  );
};

export default Support;
