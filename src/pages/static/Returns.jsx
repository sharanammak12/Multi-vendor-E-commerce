import StaticPage from "../StaticPage";
import { motion } from "framer-motion";
import {
  AssignmentReturnOutlined,
  PaymentsOutlined,
  InfoOutlined,
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

const Returns = () => {
  return (
    <StaticPage
      title="Returns & Refunds"
      description="A clear and transparent return and refund policy designed to ensure a smooth post-purchase experience."
      sections={[
        {
          heading: "Return Window ⏳",
          icon: <AssignmentReturnOutlined color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Products are eligible for return within 7 days of delivery,
              provided they remain unused, unwashed, and in their original
              condition with all tags and packaging intact.
            </MotionBox>
          ),
        },
        {
          heading: "Refund Process 💳",
          icon: <PaymentsOutlined color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Once the returned item successfully passes quality verification,
              the refund will be initiated to the original payment method used
              at checkout. Processing time may vary based on your bank or
              payment provider.
            </MotionBox>
          ),
        },
        {
          heading: "Important Information ℹ️",
          icon: <InfoOutlined color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Certain products may be excluded from returns due to hygiene
              reasons or seller-specific policies. Please review individual
              product details carefully before placing an order.
            </MotionBox>
          ),
        },
      ]}
    />
  );
};

export default Returns;
