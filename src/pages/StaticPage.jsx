import { Box, Typography, Container, Stack, Divider } from "@mui/material";

const StaticPage = ({ title, description, sections = [] }) => {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
      {/* Page Title */}
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
        sx={{ letterSpacing: 0.3 }}
      >
        {title}
      </Typography>

      {/* Page Description */}
      {description && (
        <Typography
          sx={{
            color: "text.secondary",
            mb: 5,
            maxWidth: "90%",
          }}
        >
          {description}
        </Typography>
      )}

      {/* Sections */}
      {sections.map((item, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            {item.icon && item.icon}

            <Typography fontWeight={600} sx={{ fontSize: 16 }}>
              {item.heading}
            </Typography>
          </Stack>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 14,
              lineHeight: 1.7,
              pl: item.icon ? 4 : 0, // aligns text nicely when icon exists
            }}
          >
            {item.content}
          </Typography>

          {index !== sections.length - 1 && <Divider sx={{ mt: 3 }} />}
        </Box>
      ))}
    </Container>
  );
};

export default StaticPage;
