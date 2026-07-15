import StaticPage from "../StaticPage";
import { motion } from "framer-motion";
import {
  FavoriteBorder,
  Storefront,
  VerifiedUser,
  Groups,
} from "@mui/icons-material";

/* Motion wrapper */
const MotionBox = motion.div;

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const About = () => {
  return (
    <StaticPage
      title="About Vastraa"
      description="Vastraa is an Indian fashion marketplace built to connect trusted sellers with customers seeking affordable, modern, and timeless clothing."
      sections={[
        {
          heading: "Our Mission ❤️",
          icon: <FavoriteBorder color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Our mission is to make quality fashion accessible to everyone
              across India — without compromising on style, comfort, or trust.
              We believe fashion should feel good, look good, and be fairly
              priced.
            </MotionBox>
          ),
        },
        {
          heading: "Our Story 🧵",
          icon: <Storefront color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Vastraa was founded by fashion and technology enthusiasts who saw
              a gap between traditional clothing values and modern shopping
              experiences. We built Vastraa to bridge that gap — blending Indian
              heritage with today’s digital convenience.
            </MotionBox>
          ),
        },
        {
          heading: "Why Choose Vastraa ✅",
          icon: <VerifiedUser color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              We focus on verified sellers, transparent pricing, reliable
              delivery, and customer-first policies. Every feature on Vastraa is
              designed to create a smooth, secure, and trustworthy shopping
              experience.
            </MotionBox>
          ),
        },
        {
          heading: "Meet the Team 👥",
          icon: <Groups color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Vastraa is powered by a small, passionate team of developers,
              designers, and product thinkers. We work closely with vendors and
              customers to continuously improve the platform and deliver
              meaningful fashion experiences.
            </MotionBox>
          ),
        },
      ]}
    />
  );
};

export default About;
