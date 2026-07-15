import StaticPage from "../StaticPage";
import { motion } from "framer-motion";
import { WorkOutline, Diversity3, MailOutline } from "@mui/icons-material";

const MotionBox = motion.div;

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Careers = () => {
  return (
    <StaticPage
      title="Careers at Vastraa"
      description="Be part of a growing team building a reliable and thoughtful online fashion marketplace."
      sections={[
        {
          heading: "Open Roles 💼",
          icon: <WorkOutline color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              We’re currently looking for passionate individuals across multiple
              roles, including Frontend Developer, Backend Developer, and
              Marketing Executive. Roles may evolve as Vastraa continues to
              grow.
            </MotionBox>
          ),
        },
        {
          heading: "Our Work Culture 🌱",
          icon: <Diversity3 color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              At Vastraa, we value clarity, ownership, and collaboration. We aim
              to create a flexible and inclusive work environment where ideas
              are encouraged and learning is continuous.
            </MotionBox>
          ),
        },
        {
          heading: "How to Apply ✉️",
          icon: <MailOutline color="primary" />,
          content: (
            <MotionBox
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              If you’re interested in joining us, please send your resume and a
              brief introduction to <strong>careers@vastraa.com</strong>. Our
              team will reach out if your profile matches our current
              requirements.
            </MotionBox>
          ),
        },
      ]}
    />
  );
};

export default Careers;
