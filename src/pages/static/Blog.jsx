import StaticPage from "../StaticPage";
import { motion } from "framer-motion";
import { TrendingUp, Checkroom, LightbulbOutlined } from "@mui/icons-material";

const MotionBox = motion.div;

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Blog = () => {
  return (
    <StaticPage
      title="Vastraa Blog"
      description="Insights, trends, and practical styling guidance to help you dress with confidence — every day."
      sections={[
        {
          heading: "Latest Fashion Trends 👗",
          icon: <TrendingUp color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Stay updated with seasonal trends curated by fashion experts. From
              everyday essentials to festive wear, we highlight what’s relevant,
              wearable, and worth your attention.
            </MotionBox>
          ),
        },
        {
          heading: "Styling Tips & Guides ✨",
          icon: <Checkroom color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Practical advice on how to style ethnic and western outfits
              effortlessly. Learn how to mix, match, and layer pieces to suit
              different occasions, body types, and personal styles.
            </MotionBox>
          ),
        },
        {
          heading: "Fashion Advice You Can Trust 💡",
          icon: <LightbulbOutlined color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Our blog focuses on clarity over clutter — no gimmicks, no
              over-selling. Just honest fashion insights designed to help you
              make informed choices while shopping on Vastraa.
            </MotionBox>
          ),
        },
      ]}
    />
  );
};

export default Blog;
