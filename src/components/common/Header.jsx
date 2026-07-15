import { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Paper,
} from "@mui/material";
import { Divider } from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";

import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";

const Header = () => {
  const navigate = useNavigate();

  /* ================= LOGIN STATE ================= */
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token")),
  );

  /* ================= SEARCH STATE ================= */
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [openSearch, setOpenSearch] = useState(false);

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const debounceRef = useRef(null);

  /* ================= VOICE SEARCH ================= */
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const startVoiceSearch = () => {
    if (!SpeechRecognition) {
      alert("Voice search not supported in this browser");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;

        setQuery(transcript);
        setListening(false);

        // Stop recognition immediately
        recognition.stop();

        // Close dropdown
        closeSearch();

        // Navigate directly to search page
        navigate(`/search?q=${transcript}`);
      };

      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);

      recognitionRef.current = recognition;
    }

    if (!listening) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  /* ================= LOCATION (UNCHANGED) ================= */
  const [location, setLocation] = useState("India");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const fetchUserLocation = () => {
    if (!navigator.geolocation) return;

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
          );
          const data = await res.json();
          setLocation(
            data.address.city ||
              data.address.town ||
              data.address.state ||
              "India",
          );
        } catch {
          setLocation("India");
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        setLocation("India");
        setLoadingLocation(false);
      },
    );
  };

  /* ================= AUTH SYNC ================= */
  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    window.addEventListener("storage", handleAuthChange);
    handleAuthChange();

    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

  /* ================= BACKEND SEARCH (DEBOUNCED) ================= */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpenSearch(false);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get("/user/products", {
          params: {
            search: query,
            limit: 10,
          },
        });

        setResults(res.data.products || []);
        setOpenSearch(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 100);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  /* ================= KEYBOARD NAV ================= */
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }

    if (e.key === "Enter") {
      e.preventDefault(); // ✅ prevent default behavior

      // CLOSE DROPDOWN FIRST
      closeSearch();

      if (activeIndex >= 0 && results[activeIndex]) {
        navigate(`/product/${results[activeIndex]._id}`);
      } else {
        navigate(`/search?q=${query}`);
      }
    }

    if (e.key === "Escape") {
      closeSearch();
    }
  };

  const closeSearch = () => {
    setOpenSearch(false);
    setResults([]);
    setActiveIndex(-1);
  };

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopSearchRef.current?.contains(e.target) ||
        mobileSearchRef.current?.contains(e.target)
      )
        return;

      closeSearch();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= HIGHLIGHT MATCH ================= */
  const highlightText = (text) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "ig");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={i} style={{ color: "#f3a847" }}>
          {part}
        </strong>
      ) : (
        part
      ),
    );
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#131921",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      {/* ================= TOP ROW ================= */}
      <Toolbar
        sx={{
          minHeight: { xs: 56, md: 70 },
          px: { xs: 1.5, md: 3 },
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* LEFT SIDE */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              cursor: "pointer",
              fontSize: { xs: 18, md: 22 },
            }}
            onClick={() => navigate("/")}
          >
            Vastraa
          </Typography>

          {/* Hide location on very small screens */}
          <Box
            onClick={fetchUserLocation}
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} />
            <Typography fontSize={13} fontWeight={600}>
              {loadingLocation ? "Detecting..." : location}
            </Typography>
          </Box>
        </Box>

        {/* CENTER : DESKTOP SEARCH */}
        <Box
          ref={desktopSearchRef}
          sx={{
            flexGrow: 1,
            mx: 4,
            position: "relative",
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 3,
              height: 46,
            }}
          >
            <InputBase
              placeholder="Search products or say it 🎤"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query && setOpenSearch(true)}
              sx={{ flex: 1, px: 2, fontSize: 15 }}
            />

            <IconButton sx={{ backgroundColor: "#f3a847", borderRadius: 0 }}>
              <SearchIcon />
            </IconButton>

            <IconButton
              onClick={startVoiceSearch}
              sx={{
                ml: 0.5,
                backgroundColor: listening ? "#ff5252" : "#e0e0e0",
              }}
            >
              <MicIcon sx={{ color: listening ? "#fff" : "#000" }} />
            </IconButton>
          </Box>

          {/* DESKTOP DROPDOWN */}
          {openSearch && results.length > 0 && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 1,
                zIndex: 2000,
                maxHeight: 320,
                overflowY: "auto",
              }}
            >
              {results.map((item, index) => (
                <Box
                  key={item._id}
                  onClick={() => {
                    navigate(`/product/${item._id}`);
                    closeSearch();
                  }}
                  sx={{
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    backgroundColor:
                      activeIndex === index ? "#f5f5f5" : "transparent",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  {highlightText(item.name)}
                </Box>
              ))}
            </Paper>
          )}
        </Box>

        {/* RIGHT SIDE */}
        <Box sx={{ ml: "auto" }}>
          <IconButton
            onClick={() => navigate(isLoggedIn ? "/account" : "/login")}
            sx={{ color: "#fff" }}
          >
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* ================= MOBILE SEARCH ROW ================= */}
      <Box
        ref={mobileSearchRef}
        sx={{
          px: 1.5,
          pb: 1.5,
          display: { xs: "block", md: "none" },
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 2,
            height: 44,
          }}
        >
          <InputBase
            placeholder="Search or tap mic 🎤"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setOpenSearch(true)}
            sx={{ flex: 1, px: 2 }}
          />

          <IconButton sx={{ backgroundColor: "#f3a847", borderRadius: 0 }}>
            <SearchIcon />
          </IconButton>

          <IconButton
            onClick={startVoiceSearch}
            sx={{
              ml: 0.5,
              backgroundColor: listening ? "#ff5252" : "#e0e0e0",
            }}
          >
            <MicIcon sx={{ color: listening ? "#fff" : "#000" }} />
          </IconButton>
        </Box>

        {/* MOBILE DROPDOWN */}
        {openSearch && results.length > 0 && (
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              mt: 1,
              zIndex: 2000,
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {results.map((item, index) => (
              <Box
                key={item._id}
                onClick={() => {
                  navigate(`/product/${item._id}`);
                  closeSearch();
                }}
                sx={{
                  px: 2,
                  py: 1.5,
                  cursor: "pointer",
                  backgroundColor:
                    activeIndex === index ? "#f5f5f5" : "transparent",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                {highlightText(item.name)}
              </Box>
            ))}
          </Paper>
        )}
      </Box>
    </AppBar>
  );
};

export default Header;
