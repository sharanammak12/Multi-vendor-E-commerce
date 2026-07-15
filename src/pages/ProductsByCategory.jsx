import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "../api/axiosInstance";

import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Pagination,
  Stack,
  Drawer,
  IconButton,
  Checkbox,
  FormControlLabel,
  Divider,
  Rating,
  Button,
  Skeleton,
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { useWishlist } from "../context/WishlistContext";

/* ================= CONSTANTS ================= */

const PRODUCTS_PER_PAGE = 10;

const PRICE_OPTIONS = [
  { label: "Under ₹200", value: "lt200" },
  { label: "Under ₹500", value: "lt500" },
  { label: "Under ₹1000", value: "lt1000" },
  { label: "Above ₹500", value: "gt500" },
  { label: "Above ₹1000", value: "gt1000" },
];

/* ================= SKELETON ================= */

const ProductSkeleton = () => (
  <Card sx={{ borderRadius: 3 }}>
    <Skeleton variant="rectangular" height={220} />
    <CardContent>
      <Skeleton height={18} />
      <Skeleton width={80} />
    </CardContent>
  </Card>
);

/* ================= MAIN ================= */

const ProductsByCategory = () => {
  const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  const navigate = useNavigate();

  const { toggleWishlist, isInWishlist } = useWishlist();

  /* ================= STATE ================= */

  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const [openFilter, setOpenFilter] = useState(false);

  /* ================= DYNAMIC FILTERS ================= */

  const [availableSizes, setAvailableSizes] = useState([]);

  const [availableColors, setAvailableColors] = useState([]);

  /* ================= FILTER STATE ================= */

  const [priceRanges, setPriceRanges] = useState([]);

  const [sizes, setSizes] = useState([]);

  const [colors, setColors] = useState([]);

  const [rating, setRating] = useState(0);

  const [discount, setDiscount] = useState(0);

  /* ================= RESET PAGE ================= */

  useEffect(() => {
    setPage(1);
  }, [categoryName, searchQuery, sizes, colors, rating, discount, priceRanges]);

  /* ================= FETCH FILTER OPTIONS ================= */
  const normalizedCategory = categoryName?.toLowerCase();
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const params = {};

        if (["men", "women", "kids"].includes(normalizedCategory)) {
          params.category = normalizedCategory;
        } else {
          params.tag = categoryName;
        }

        const res = await axios.get("/user/products/filters", {
          params,
        });

        setAvailableSizes(res.data.sizes || []);

        setAvailableColors(res.data.colors || []);
      } catch (err) {
        console.error("Failed to fetch filters", err);
      }
    };

    fetchFilters();
  }, [categoryName]);

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        let minPrice;
        let maxPrice;

        /* PRICE FILTERS */

        if (priceRanges.includes("lt200")) {
          maxPrice = 200;
        }

        if (priceRanges.includes("lt500")) {
          maxPrice = 500;
        }

        if (priceRanges.includes("lt1000")) {
          maxPrice = 1000;
        }

        if (priceRanges.includes("gt500")) {
          minPrice = 500;
        }

        if (priceRanges.includes("gt1000")) {
          minPrice = 1000;
        }

        const params = {
          page,
          limit: PRODUCTS_PER_PAGE,

          minPrice,
          maxPrice,

          sizes: sizes.length ? sizes.join(",") : undefined,

          colors: colors.length ? colors.join(",") : undefined,

          rating: rating || undefined,

          discount: discount || undefined,
        };

        /* SEARCH */

        if (searchQuery) {
          params.search = searchQuery;
        } else if (["men", "women", "kids"].includes(normalizedCategory)) {
          /* CATEGORY */
          params.category = normalizedCategory;
        } else {
          /* TAG */
          params.tag = categoryName;
        }

        console.log("FRONTEND PARAMS =>", params);

        const res = await axios.get("/user/products", {
          params,
        });

        setProducts(res.data.products || []);

        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    categoryName,
    searchQuery,
    page,
    sizes,
    colors,
    rating,
    discount,
    priceRanges,
  ]);

  /* ================= UI ================= */

  return (
    <Box
      sx={{
        px: 2,
        pb: "80px",
        backgroundColor: "#eaeded",
        minHeight: "100vh",
      }}
    >
      {/* TITLE */}

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography fontWeight={800} fontSize={22}>
          {searchQuery
            ? `Results for "${searchQuery}"`
            : categoryName.toUpperCase()}
        </Typography>

        <IconButton onClick={() => setOpenFilter(true)}>
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* PRODUCTS GRID */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2,1fr)",
            sm: "repeat(3,1fr)",
            md: "repeat(4,1fr)",
            lg: "repeat(5,1fr)",
          },
          gap: {
            xs: 1.5,
            sm: 2,
          },
        }}
      >
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : products.length === 0 ? (
          /* EMPTY STATE */

          <Box
            sx={{
              gridColumn: "1/-1",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 420,
                p: 4,
                borderRadius: 4,
                textAlign: "center",
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography fontWeight={700} fontSize={22} mb={1}>
                No Products Found
              </Typography>

              <Typography color="text.secondary" lineHeight={1.7}>
                We couldn't find products matching your selected filters.
                <br />
                Try changing category or increasing the price range.
              </Typography>
            </Box>
          </Box>
        ) : (
          products.map((p) => (
            <Card
              key={p._id}
              sx={{
                position: "relative",
                cursor: "pointer",
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                transition: "0.3s",
                backgroundColor: "#fff",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.08)",
                },
              }}
              onClick={() => navigate(`/product/${p._id}`)}
            >
              {/* WISHLIST */}

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();

                  toggleWishlist(p._id);
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "#fff",
                  zIndex: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  "&:hover": {
                    bgcolor: "#fff",
                  },
                }}
              >
                {isInWishlist(p._id) ? (
                  <FavoriteIcon color="error" fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>

              {/* DISCOUNT */}

              {p.discount > 0 && (
                <Chip
                  label={`${p.discount}% OFF`}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    zIndex: 2,
                    bgcolor: "#16a34a",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                />
              )}

              {/* IMAGE */}

              <Box
                sx={{
                  overflow: "hidden",
                  backgroundColor: "#fff",
                }}
              >
                <CardMedia
                  component="img"
                  loading="lazy"
                  height="240"
                  image={p.images?.[0]?.url || "/placeholder.png"}
                  alt={p.name}
                  sx={{
                    objectFit: "contain",
                    p: 1,
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.04)",
                    },
                  }}
                />
              </Box>

              {/* CONTENT */}

              <CardContent sx={{ p: 2 }}>
                <Typography noWrap fontWeight={700} fontSize={15}>
                  {p.name}
                </Typography>

                {/* RATING */}

                <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                  <Rating
                    value={p.rating || 0}
                    precision={0.5}
                    readOnly
                    size="small"
                  />

                  <Typography variant="caption" color="text.secondary">
                    ({p.numReviews || 0})
                  </Typography>
                </Box>

                {/* PRICE */}

                {p.discount > 0 ? (
                  <>
                    <Typography
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                        fontSize: 13,
                        mt: 1,
                      }}
                    >
                      ₹{p.price}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography fontWeight={800} fontSize={18}>
                        ₹{Math.round(p.price * (1 - p.discount / 100))}
                      </Typography>

                      <Typography
                        fontSize={13}
                        fontWeight={700}
                        color="success.main"
                      >
                        SAVE {p.discount}%
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Typography fontWeight={800} fontSize={18} mt={1}>
                    ₹{p.price}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* PAGINATION */}

      {totalPages > 1 && (
        <Stack alignItems="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, v) => setPage(v)}
          />
        </Stack>
      )}

      {/* ================= FILTER DRAWER ================= */}

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        PaperProps={{
          sx: {
            width: 320,

            top: {
              xs: 112,
              md: 120,
            },

            height: {
              xs: "calc(100% - 112px)",
              md: "calc(100% - 120px)",
            },
          },
        }}
      >
        <Box p={2}>
          <Typography fontWeight={800}>Filters</Typography>

          <Divider sx={{ my: 2 }} />

          {/* PRICE */}

          <Typography fontWeight={600}>Price</Typography>

          {PRICE_OPTIONS.map((p) => (
            <FormControlLabel
              key={p.value}
              control={
                <Checkbox
                  checked={priceRanges.includes(p.value)}
                  onChange={() =>
                    setPriceRanges((prev) =>
                      prev.includes(p.value)
                        ? prev.filter((x) => x !== p.value)
                        : [...prev, p.value],
                    )
                  }
                />
              }
              label={p.label}
            />
          ))}

          <Divider sx={{ my: 2 }} />

          {/* SIZE */}

          {availableSizes.length > 0 && (
            <>
              <Typography fontWeight={600}>Size</Typography>

              {availableSizes.map((s) => (
                <FormControlLabel
                  key={s}
                  control={
                    <Checkbox
                      checked={sizes.includes(s)}
                      onChange={() =>
                        setSizes((prev) =>
                          prev.includes(s)
                            ? prev.filter((x) => x !== s)
                            : [...prev, s],
                        )
                      }
                    />
                  }
                  label={s}
                />
              ))}

              <Divider sx={{ my: 2 }} />
            </>
          )}

          {/* COLORS */}

          {availableColors.length > 0 && (
            <>
              <Typography fontWeight={600}>Colors</Typography>

              {availableColors.map((c) => (
                <FormControlLabel
                  key={c}
                  control={
                    <Checkbox
                      checked={colors.includes(c)}
                      onChange={() =>
                        setColors((prev) =>
                          prev.includes(c)
                            ? prev.filter((x) => x !== c)
                            : [...prev, c],
                        )
                      }
                    />
                  }
                  label={c}
                />
              ))}

              <Divider sx={{ my: 2 }} />
            </>
          )}

          {/* RATING */}

          <Typography fontWeight={600}>Rating</Typography>

          <Rating value={rating} onChange={(e, v) => setRating(v || 0)} />

          <Divider sx={{ my: 2 }} />

          {/* DISCOUNT */}

          <Typography fontWeight={600}>Discount</Typography>

          {[10, 20, 30, 40, 50].map((d) => (
            <FormControlLabel
              key={d}
              control={
                <Checkbox
                  checked={discount === d}
                  onChange={() => setDiscount(discount === d ? 0 : d)}
                />
              }
              label={`${d}% or more`}
            />
          ))}

          <Divider sx={{ my: 2 }} />

          {/* BUTTONS */}

          <Box display="flex" gap={1}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setPriceRanges([]);

                setSizes([]);

                setColors([]);

                setRating(0);

                setDiscount(0);
              }}
            >
              Clear
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={() => setOpenFilter(false)}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ProductsByCategory;
