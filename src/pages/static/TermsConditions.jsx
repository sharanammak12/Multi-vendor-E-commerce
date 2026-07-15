import StaticPage from "../StaticPage";
import { motion } from "framer-motion";
import {
  Description,
  AccountCircle,
  Payments,
  Gavel,
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

const TermsConditions = () => {
  return (
    <StaticPage
      title="Terms & Conditions"
      description="These terms outline the rules and guidelines for using the Vastraa website and services."
      sections={[
        {
          heading: "Use of Website 📜",
          icon: <Description color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              By accessing Vastraa, you agree to follow these terms and comply
              with all applicable laws and regulations while using our website.
            </MotionBox>
          ),
        },
        {
          heading: "User Accounts 👤",
          icon: <AccountCircle color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Users are responsible for maintaining the confidentiality of their
              account credentials and ensuring all information provided is
              accurate.
            </MotionBox>
          ),
        },
        {
          heading: "Payments & Orders 💳",
          icon: <Payments color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              All payments must be completed through our secure payment
              gateways. Vastraa reserves the right to cancel orders in case of
              pricing errors or suspected fraudulent activity.
            </MotionBox>
          ),
        },
        {
          heading: "Legal Compliance ⚖️",
          icon: <Gavel color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              By using Vastraa, you agree to comply with applicable laws and
              regulations governing online commerce and digital platforms.
            </MotionBox>
          ),
        },
      ]}
    />
  );
};

export default TermsConditions;
