import StaticPage from "../StaticPage";
import { motion } from "framer-motion";
import { Security, DataUsage, Cookie, ContactMail } from "@mui/icons-material";

const MotionBox = motion.div;

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const PrivacyPolicy = () => {
  return (
    <StaticPage
      title="Privacy Policy"
      description="Your privacy is important to us. Learn how Vastraa collects, uses, and protects your information."
      sections={[
        {
          heading: "Information We Collect 🔐",
          icon: <DataUsage color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Vastraa may collect information such as your name, email address,
              phone number, shipping address, and order details when you create
              an account or place an order on our platform.
            </MotionBox>
          ),
        },
        {
          heading: "How We Use Your Data 📊",
          icon: <Security color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              The information we collect is used to process orders, provide
              customer support, personalize your shopping experience, and
              improve our website and services.
            </MotionBox>
          ),
        },
        {
          heading: "Cookies & Tracking 🍪",
          icon: <Cookie color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Vastraa uses cookies and similar technologies to remember your
              preferences, analyze traffic, and enhance overall website
              performance.
            </MotionBox>
          ),
        },
        {
          heading: "Contact Us 📩",
          icon: <ContactMail color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              If you have questions about our privacy practices, please contact
              us at <strong>support@vastraa.com</strong>.
            </MotionBox>
          ),
        },
      ]}
    />
  );
};

export default PrivacyPolicy;
