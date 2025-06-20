import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { ReactInfiniteCanvas } from "react-infinite-canvas";
import { COMPONENT_POSITIONS } from "../../assets/Helpers/constants";
import seedrandom from "seedrandom";
import MemorPicture from "../../Components/MemorPicture/MemorPicture";
import "./MemoryBoard.css";
import Loader from "../../Components/Loader/Loader";
import { useAuth } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";

// Icon components (same as before)
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.73-4.8 5.75-7.39C20.25 4.95 19.78 4 18.95 4H5.05c-.83 0-1.3.95-.8 1.61z"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
  </svg>
);

const CanvasIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const CenterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

const ResetIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
);

const SortIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

// Constants
const CANVAS_WIDTH = 3000;
const CANVAS_HEIGHT = 3000;
const CARD_WIDTH = 350;
const CARD_HEIGHT = 400;
const MIN_SPACING = 50;
const GRID_SPACING = 100;

const MemoryBoard = () => {
  const canvasRef = useRef(null);
  const { token, user } = useAuth();
  const gridViewRef = useRef(null);

  // Core state
  const [selectedMemor, setSelectedMemor] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  // Filter state
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [viewMode, setViewMode] = useState('canvas');
  const [selectedCompetition, setSelectedCompetition] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [minImages, setMinImages] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);

  // Data state
  const [competitions, setCompetitions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Navigation state
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Enhanced positioning algorithm with better dispersion and centering
  const generatePositions = useCallback((count) => {
    const positions = [];
    
    if (count === 0) return positions;
    
    // Enhanced constants for better dispersion
    const CARD_COLLISION_WIDTH = CARD_WIDTH + MIN_SPACING * 2; // More spacing
    const CARD_COLLISION_HEIGHT = CARD_HEIGHT + MIN_SPACING * 2;
    const MAX_ATTEMPTS = 100;
    const SPIRAL_INCREMENT = 120; // Much larger increments for more dispersion
    const MIN_RADIUS = 200; // Minimum distance from center
    
    // Seed the random number generator for consistent results
    const rng = seedrandom("memory-board-seed");
    
    // Helper function to check if two rectangles overlap (accounting for cascade)
    const checkCollision = (pos1, pos2) => {
      // Account for cascade effect - add extra padding
      const cascadePadding = 60; // Extra space for cascade visibility
      const dx = Math.abs(pos1.x - pos2.x);
      const dy = Math.abs(pos1.y - pos2.y);
      return dx < (CARD_COLLISION_WIDTH + cascadePadding) && dy < (CARD_COLLISION_HEIGHT + cascadePadding);
    };
    
    // Helper function to check if a position collides with any existing positions
    const hasCollision = (newPos, existingPositions) => {
      return existingPositions.some(existingPos => checkCollision(newPos, existingPos));
    };
    
    // Helper function to generate positions in a more dispersed pattern
    const generateDispersedPosition = (index, ringRadius) => {
      const circumference = 2 * Math.PI * ringRadius;
      const optimalSpacing = CARD_COLLISION_WIDTH + 80; // Extra spacing
      const pointsInRing = Math.max(4, Math.floor(circumference / optimalSpacing));
      const angleStep = (2 * Math.PI) / pointsInRing;
      const angle = (index % pointsInRing) * angleStep;
      
      // Add more randomness for organic dispersion
      const radiusVariation = (rng() - 0.5) * 80; // Larger radius variation
      const angleVariation = (rng() - 0.5) * 0.6; // More angle variation
      
      const finalRadius = Math.max(MIN_RADIUS, ringRadius + radiusVariation);
      const finalAngle = angle + angleVariation;
      
      return {
        x: finalRadius * Math.cos(finalAngle),
        y: finalRadius * Math.sin(finalAngle),
        rotation: (rng() - 0.5) * 20 // Slightly more rotation
      };
    };
    
    // Handle single item - place at center
    if (count === 1) {
      return [{ x: 0, y: 0, rotation: (rng() - 0.5) * 15 }];
    }
    
    // For multiple items, start from first ring (not center)
    for (let i = 0; i < count; i++) {
      let positioned = false;
      let attempts = 0;
      let currentRadius = MIN_RADIUS; // Start at minimum radius
      
      while (!positioned && attempts < MAX_ATTEMPTS) {
        // Calculate which ring we're trying
        const ringIndex = Math.floor(attempts / 6); // Fewer attempts per ring
        const radius = currentRadius + (ringIndex * SPIRAL_INCREMENT);
        
        const candidatePosition = generateDispersedPosition(i + attempts, radius);
        
        // Check for collisions
        if (!hasCollision(candidatePosition, positions)) {
          positions.push(candidatePosition);
          positioned = true;
        } else {
          attempts++;
          
          // If we've tried many positions in this ring, move to next ring
          if (attempts % 6 === 0) {
            currentRadius += SPIRAL_INCREMENT;
          }
        }
      }
      
      // Fallback: if we couldn't find a non-overlapping position
      if (!positioned) {
        const fallbackRadius = currentRadius + 150;
        const fallbackAngle = (i / count) * 2 * Math.PI + (rng() - 0.5) * 0.8;
        positions.push({
          x: fallbackRadius * Math.cos(fallbackAngle),
          y: fallbackRadius * Math.sin(fallbackAngle),
          rotation: (rng() - 0.5) * 20
        });
        console.warn(`Using fallback position for item ${i}`);
      }
    }
    
    console.log(`Generated ${positions.length} dispersed positions for ${count} items`);
    return positions;
  }, []);

  // Enhanced filtered posts with sorting
  const filteredPosts = useMemo(() => {
    let filtered = [...allPosts];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(query) ||
        post.description?.toLowerCase().includes(query) ||
        post.team?.toLowerCase().includes(query)
      );
    }

    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter(post => {
        const postDate = new Date(post.created_at || post.submittedDate);
        return postDate >= new Date(dateRange.start);
      });
    }

    if (dateRange.end) {
      filtered = filtered.filter(post => {
        const postDate = new Date(post.created_at || post.submittedDate);
        return postDate <= new Date(dateRange.end);
      });
    }

    // Filter by minimum images
    if (minImages > 1) {
      filtered = filtered.filter(post => post.image?.length >= minImages);
    }

    // Filter by tags (if implemented)
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        selectedTags.some(tag => 
          post.title?.toLowerCase().includes(tag.toLowerCase()) ||
          post.description?.toLowerCase().includes(tag.toLowerCase())
        )
      );
    }

    // Sort filtered results
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'date':
          const dateA = new Date(a.created_at || a.submittedDate);
          const dateB = new Date(b.created_at || b.submittedDate);
          compareValue = dateA - dateB;
          break;
        case 'title':
          compareValue = (a.title || '').localeCompare(b.title || '');
          break;
        case 'team':
          compareValue = (a.team || '').localeCompare(b.team || '');
          break;
        case 'images':
          compareValue = (a.image?.length || 0) - (b.image?.length || 0);
          break;
        default:
          compareValue = 0;
      }
      
      return sortDirection === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [allPosts, searchQuery, dateRange, minImages, selectedTags, sortBy, sortDirection]);

  // Generate positions for filtered posts
  const positionedPosts = useMemo(() => {
    const positions = generatePositions(filteredPosts.length);
    return filteredPosts.map((post, index) => ({
      ...post,
      ...positions[index]
    }));
  }, [filteredPosts, generatePositions]);

  // Statistics
  const stats = useMemo(() => {
    const totalMemors = allPosts.length;
    const filteredCount = filteredPosts.length;
    const uniqueTeams = new Set(allPosts.map(post => post.team)).size;
    const dateRange = allPosts.length > 0 ? {
      earliest: Math.min(...allPosts.map(p => new Date(p.created_at || p.submittedDate).getTime())),
      latest: Math.max(...allPosts.map(p => new Date(p.created_at || p.submittedDate).getTime()))
    } : null;

    return {
      total: totalMemors,
      filtered: filteredCount,
      teams: uniqueTeams,
      dateRange
    };
  }, [allPosts, filteredPosts]);

  // Initialize document title
  useEffect(() => {
    document.title = "Memor'us | Memory Board";
  }, []);

  // Fetch initial data
  useEffect(() => {
    if (!token || !user) return;

    const fetchInitialData = async () => {
      setLoading(true);

      try {
        // Fetch competitions
        const competitionsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/competitions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user?.tenant_subdomain || "",
            },
          }
        );

        if (competitionsResponse.ok) {
          const competitionsData = await competitionsResponse.json();
          setCompetitions(competitionsData);

          // Set default competition (active or first)
          const today = new Date().toISOString().split("T")[0];
          const activeCompetition = competitionsData.find(
            (comp) =>
              comp.is_active &&
              comp.start_date <= today &&
              comp.end_date >= today
          );

          if (activeCompetition) {
            setSelectedCompetition(activeCompetition.id.toString());
          } else if (competitionsData.length > 0) {
            setSelectedCompetition(competitionsData[0].id.toString());
          }
        }

        // Fetch teams
        const teamsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/teams`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user?.tenant_subdomain || "",
            },
          }
        );

        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json();
          setTeams([{ id: 'all', name: 'All Teams' }, ...teamsData]);

          // Set default team (user's team or all)
          if (user?.teamsId) {
            setSelectedTeam(user.teamsId.toString());
          } else {
            setSelectedTeam('all');
          }
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token, user]);

  // Fetch memor data when filters change
  useEffect(() => {
    if (!selectedCompetition || !selectedTeam || !token || !user?.tenant_subdomain) {
      return;
    }

    const fetchMemorData = async () => {
      setLoading(true);
      setAllPosts([]);

      try {
        let memorUrl;
        
        if (selectedTeam === 'all') {
          // Fetch all memors for the competition
          memorUrl = `${import.meta.env.VITE_API_URL}/api/memors/latest/all`;
        } else {
          // Fetch memors for specific team
          memorUrl = `${import.meta.env.VITE_API_URL}/api/memors/team/${selectedTeam}/competition/${selectedCompetition}/completed`;
        }

        const response = await fetch(memorUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant": user.tenant_subdomain,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch memor data: ${response.status}`);
        }

        const memorData = await response.json();

        if (memorData && memorData.length > 0) {
          const processedPosts = memorData
            .filter((item) => {
              // Handle different data structures
              const hasImages = item.pictures?.length > 0 || item.image?.length > 0;
              return hasImages;
            })
            .map((item) => {
              // Normalize the data structure
              let images = [];
              if (item.pictures?.length > 0) {
                images = item.pictures.map((pic) => ({
                  img_src: pic.img_src,
                  alt_text: pic.alt_text || `Image for ${item.title}`,
                }));
              } else if (item.image?.length > 0) {
                images = item.image.map((img) => ({
                  img_src: typeof img === 'string' ? img : img.img_src,
                  alt_text: typeof img === 'object' ? img.alt_text : `Image for ${item.title}`,
                }));
              }

              return {
                memorId: item.id || item.memorId,
                title: item.title,
                description: item.description || "",
                team: item.team || "Unknown Team",
                submittedDate: item.submittedDate || 
                  (item.created_at ? new Date(item.created_at).toLocaleDateString() : "Unknown date"),
                created_at: item.created_at || item.submittedDate,
                image: images,
              };
            })
            .filter((post) => post.image && post.image.length > 0);

          setAllPosts(processedPosts);
        }
      } catch (err) {
        console.error("Error fetching memor data:", err);
        setError("Failed to load memor data");
      } finally {
        setLoading(false);
      }
    };

    fetchMemorData();
  }, [selectedCompetition, selectedTeam, token, user]);

  // Image lazy loading observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.dataset.src) {
            setLoadedImages((prev) => new Set([...prev, entry.target.dataset.src]));
          }
        });
      },
      { root: null, rootMargin: "150px" }
    );

    const imageElements = document.querySelectorAll("[data-src]");
    imageElements.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [positionedPosts, viewMode]);

  // ULTRA HIGH-PERFORMANCE zoom and navigation - NO LAG
  useEffect(() => {
    let isUserInteracting = false;
    let lastWheelTime = 0;
    
    const handleWheel = (e) => {
      if (e.ctrlKey && viewMode === 'canvas') {
        e.preventDefault();
        e.stopPropagation();
        
        // IMMEDIATE response - no throttling
        const now = performance.now();
        if (now - lastWheelTime < 8) return; // Minimal 8ms throttle only
        lastWheelTime = now;

        const canvasState = canvasRef.current?.getCanvasState?.();
        if (canvasState) {
          isUserInteracting = true;
          
          const { currentPosition, d3Zoom, canvasNode } = canvasState;
          const { k: currentScale } = currentPosition || {};
          
          // Very small, precise zoom steps for smooth control
          const sensitivity = 0.05;
          const delta = e.deltaY > 0 ? -sensitivity : sensitivity;
          const newScale = Math.max(0.1, Math.min(8, currentScale + delta));
          
          // ZERO DELAY transform - instant response
          d3Zoom.scaleTo(canvasNode, newScale);
          setZoomLevel(newScale);
          
          // Quick reset of interaction flag
          clearTimeout(window.interactionTimeout);
          window.interactionTimeout = setTimeout(() => {
            isUserInteracting = false;
          }, 50);
        }
      }
    };

    // Minimal sync - only when NOT actively interacting
    const syncZoomLevel = () => {
      if (viewMode === 'canvas' && !isUserInteracting) {
        const canvasState = canvasRef.current?.getCanvasState?.();
        if (canvasState) {
          const { currentPosition } = canvasState;
          const { k: currentScale } = currentPosition || {};
          
          if (Math.abs(currentScale - zoomLevel) > 0.01) {
            setZoomLevel(currentScale);
          }
        }
      }
    };

    // High priority wheel event
    window.addEventListener("wheel", handleWheel, { 
      passive: false, 
      capture: true 
    });
    
    // Very infrequent sync to avoid performance impact
    const syncInterval = setInterval(syncZoomLevel, 1000);

    return () => {
      window.removeEventListener("wheel", handleWheel, true);
      clearInterval(syncInterval);
      clearTimeout(window.interactionTimeout);
    };
  }, [viewMode, zoomLevel]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode === 'canvas' && positionedPosts.length > 0) {
        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault();
            setFocusedIndex((prev) => (prev + 1) % positionedPosts.length);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            setFocusedIndex((prev) => (prev - 1 + positionedPosts.length) % positionedPosts.length);
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (positionedPosts[focusedIndex]) {
              openModal(0, focusedIndex);
            }
            break;
          case 'Escape':
            if (selectedMemor) {
              closeModal();
            } else if (showFilterPanel) {
              setShowFilterPanel(false);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, positionedPosts, focusedIndex, selectedMemor, showFilterPanel]);

  // INSTANT zoom buttons - no delays
  const handleZoom = useCallback((action = "out") => {
    if (viewMode !== 'canvas') return;
    
    const canvasState = canvasRef.current?.getCanvasState?.();
    if (!canvasState) return;

    const { canvasNode, currentPosition, d3Zoom } = canvasState;
    const { k: currentScale } = currentPosition || {};
    
    // Immediate zoom steps
    const step = action === "out" ? -0.2 : 0.2;
    const newScale = Math.max(0.1, Math.min(8, currentScale + step));
    
    // INSTANT transform - ZERO delay
    d3Zoom.scaleTo(canvasNode, newScale);
    setZoomLevel(newScale);
  }, [viewMode]);

  const handleCenterView = useCallback(() => {
    if (viewMode === 'canvas' && canvasRef.current) {
      // Calculate the bounding box of all positioned posts for better centering
      if (positionedPosts.length > 0) {
        const bounds = positionedPosts.reduce((acc, post) => {
          return {
            minX: Math.min(acc.minX, post.x - CARD_WIDTH / 2),
            maxX: Math.max(acc.maxX, post.x + CARD_WIDTH / 2),
            minY: Math.min(acc.minY, post.y - CARD_HEIGHT / 2),
            maxY: Math.max(acc.maxY, post.y + CARD_HEIGHT / 2),
          };
        }, {
          minX: positionedPosts[0].x,
          maxX: positionedPosts[0].x,
          minY: positionedPosts[0].y,
          maxY: positionedPosts[0].y,
        });

        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;
        
        // Center on the calculated center point
        const canvasState = canvasRef.current.getCanvasState();
        if (canvasState) {
          const { d3Zoom, canvasNode } = canvasState;
          d3Zoom.transform(
            canvasNode.transition().duration(800),
            d3Zoom.identity
              .translate(CANVAS_WIDTH / 2 - centerX, CANVAS_HEIGHT / 2 - centerY)
              .scale(0.6) // Better zoom level to see all collections
          );
        }
      } else {
        // Fallback to canvas center if no posts
        canvasRef.current.fitContentToView({ scale: 0.8 });
      }
    } else if (viewMode === 'grid' && gridViewRef.current) {
      gridViewRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [viewMode, positionedPosts]);

  const openModal = useCallback((imageIndex, postIndex) => {
    const post = positionedPosts[postIndex];
    if (!post) return;

    setSelectedMemor({
      images: post.image || [],
      currentIndex: imageIndex,
      title: post.title,
      submittedDate: post.submittedDate,
      team: post.team,
      postIndex,
      memorId: post.memorId,
    });
  }, [positionedPosts]);

  const closeModal = useCallback(() => {
    setSelectedMemor(null);
  }, []);

  const handleImageNavigation = useCallback((newIndex) => {
    setSelectedMemor((prev) => prev ? { ...prev, currentIndex: newIndex } : null);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setDateRange({ start: '', end: '' });
    setMinImages(1);
    setSelectedTags([]);
    setSortBy('date');
    setSortDirection('desc');
    // Don't clear competition and team as they're primary filters
  }, []);

  const handleFilterChange = useCallback((filterType, value) => {
    switch (filterType) {
      case 'competition':
        setSelectedCompetition(value);
        break;
      case 'team':
        setSelectedTeam(value);
        break;
      case 'search':
        setSearchQuery(value);
        break;
      case 'dateStart':
        setDateRange(prev => ({ ...prev, start: value }));
        break;
      case 'dateEnd':
        setDateRange(prev => ({ ...prev, end: value }));
        break;
      case 'sortBy':
        setSortBy(value);
        break;
      case 'sortDirection':
        setSortDirection(value);
        break;
      case 'minImages':
        setMinImages(parseInt(value) || 1);
        break;
    }
  }, []);

  const addTag = useCallback((tag) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
    }
  }, [selectedTags]);

  const removeTag = useCallback((tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  }, []);

  // Render loading state
  if (loading && allPosts.length === 0) {
    return (
      <>
        <Loader />
        <div className="memory-board-container">
          <div className="loading-container">
            <CircularProgress size={60} sx={{ color: "#d0bcfe" }} />
            <div className="loading-text">Loading memories...</div>
          </div>
        </div>
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <Loader />
        <div className="memory-board-container">
          <div className="empty-container">
            <p className="empty-message">
              {error}
            </p>
            <button 
              className="control-btn" 
              onClick={() => window.location.reload()}
            >
              <ResetIcon />
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Loader />
      <div className="memory-board-container">
        {/* Filter Toggle Button */}
        <button
          className={`filter-toggle-btn ${showFilterPanel ? 'active' : ''}`}
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          aria-label="Toggle filters"
          aria-expanded={showFilterPanel}
        >
          <FilterIcon />
        </button>

        {/* Filter Panel */}
        <div className={`filter-panel ${showFilterPanel ? 'open' : ''}`}>
          {/* View Mode Toggle */}
          <div className="filter-section">
            <label className="filter-label">View Mode</label>
            <div className="view-mode-toggle">
              <button
                className={`view-mode-btn ${viewMode === 'canvas' ? 'active' : ''}`}
                onClick={() => setViewMode('canvas')}
              >
                <CanvasIcon />
                Canvas
              </button>
              <button
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <GridIcon />
                Grid
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="filter-section">
            <label className="filter-label" htmlFor="search-input">
              Search Memors
            </label>
            <div className="search-container">
              <input
                id="search-input"
                type="text"
                className="filter-input search-input"
                placeholder="Search by title, description, or team..."
                value={searchQuery}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          {/* Competition Filter */}
          <div className="filter-section">
            <label className="filter-label" htmlFor="competition-select">
              Competition
            </label>
            <select
              id="competition-select"
              className="filter-select"
              value={selectedCompetition}
              onChange={(e) => handleFilterChange('competition', e.target.value)}
            >
              <option value="">Select Competition</option>
              {competitions.map((competition) => (
                <option key={competition.id} value={competition.id}>
                  {competition.name}
                </option>
              ))}
            </select>
          </div>

          {/* Team Filter */}
          <div className="filter-section">
            <label className="filter-label" htmlFor="team-select">
              Team
            </label>
            <select
              id="team-select"
              className="filter-select"
              value={selectedTeam}
              onChange={(e) => handleFilterChange('team', e.target.value)}
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting - Only show in Grid Mode */}
          {viewMode === 'grid' && (
            <div className="filter-section">
              <label className="filter-label">Sort & Order</label>
              <div className="sort-container">
                <select
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="team">Sort by Team</option>
                  <option value="images">Sort by Image Count</option>
                </select>
                <button
                  className={`sort-direction-btn ${sortDirection}`}
                  onClick={() => handleFilterChange('sortDirection', sortDirection === 'asc' ? 'desc' : 'asc')}
                  title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  <SortIcon />
                </button>
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          <div className="filter-section second">
            <label className="filter-label">Advanced Filters</label>
            <div className="filter-group">
              <div>
                <label className="filter-label" style={{ fontSize: '12px', marginBottom: '6px' }}>
                  Min Images
                </label>
                <select
                  className="filter-select"
                  value={minImages}
                  onChange={(e) => handleFilterChange('minImages', e.target.value)}
                >
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="5">5+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tags */}
          {selectedTags.length > 0 && (
            <div className="filter-section">
              <label className="filter-label">Active Filters</label>
              <div className="filter-tags">
                {selectedTags.map((tag, index) => (
                  <div key={index} className="filter-tag">
                    <TagIcon />
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Date Range */}
          <div className="filter-section">
            <label className="filter-label">Date Range</label>
            <div className="date-range-container">
              <input
                type="date"
                className="filter-input"
                placeholder="Start date"
                value={dateRange.start}
                onChange={(e) => handleFilterChange('dateStart', e.target.value)}
              />
              <input
                type="date"
                className="filter-input"
                placeholder="End date"
                value={dateRange.end}
                onChange={(e) => handleFilterChange('dateEnd', e.target.value)}
              />
            </div>
          </div>

          {/* Clear Filters */}
          <button className="clear-filters-btn" onClick={clearFilters}>
            🗑️ Clear Search & Advanced Filters
          </button>
        </div>

        {/* Main Content */}
        {filteredPosts.length === 0 ? (
          <div className="empty-container">
            <p className="empty-message">
              {searchQuery || dateRange.start || dateRange.end
                ? "No memors match your current filters"
                : "No memors found for this selection"}
            </p>
            {(searchQuery || dateRange.start || dateRange.end) && (
              <button className="control-btn" onClick={clearFilters}>
                <ResetIcon />
                Clear Filters
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid-view-container" ref={gridViewRef}>
            <div className="grid-container">
              {positionedPosts.map((post, postIndex) => (
                <div
                  key={`${post.memorId}-${postIndex}`}
                  className={`grid-card ${focusedIndex === postIndex ? 'focused' : ''}`}
                  onClick={() => openModal(0, postIndex)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openModal(0, postIndex);
                    }
                  }}
                >
                  <img
                    className="grid-card-image"
                    data-src={post.image[0]?.img_src}
                    src={loadedImages.has(post.image[0]?.img_src) ? post.image[0]?.img_src : ''}
                    alt={post.image[0]?.alt_text || `Image for ${post.title}`}
                    loading="lazy"
                  />
                  <div className="grid-card-content">
                    <h3 className="grid-card-title">{post.title}</h3>
                    <div className="grid-card-meta">
                      <span>{post.submittedDate}</span>
                      <span className="grid-card-team">{post.team}</span>
                    </div>
                    {post.description && (
                      <p className="grid-card-description">{post.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Canvas View with Enhanced Non-Overlapping Collections and Cascade Effect
          <ReactInfiniteCanvas
            ref={canvasRef}
            onCanvasMount={(mountFunc) => {
              // Initial view - center on collections with appropriate scale
              setTimeout(() => {
                if (positionedPosts.length > 0) {
                  handleCenterView();
                } else {
                  mountFunc.fitContentToView({ scale: 0.6 });
                }
              }, 100);
            }}
            backgroundType="none"
          >
            {positionedPosts.map((post, postIndex) => (
              <div
                key={`${post.memorId}-${postIndex}`}
                className="polaroid-container"
                style={{
                  position: "absolute",
                  top: post.y + CANVAS_HEIGHT / 2,
                  left: post.x + CANVAS_WIDTH / 2,
                  width: `${CARD_WIDTH + 30}px`, // Just enough for small cascade
                  height: `${CARD_HEIGHT + 24}px`, // Just enough for small cascade
                  zIndex: focusedIndex === postIndex ? 100 : 1,
                }}
              >
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  {post.image
                    .slice()
                    .reverse()
                    .map((image, cardIndex, reversedArray) => {
                      const imgSrc = typeof image === "string" ? image : image?.img_src || "";
                      const altText = image?.alt_text || `Image for ${post.title}`;
                      
                      // Subtle cascade - just a sliver of each card visible behind
                      const cascadeOffsetX = cardIndex * 8; // Small horizontal peek
                      const cascadeOffsetY = cardIndex * 6; // Small vertical peek
                      const rotationOffset = cardIndex * 2; // Slight rotation difference
                      const baseZIndex = reversedArray.length - cardIndex; // Fixed cascade order
                      
                      // Base transform
                      const baseTransform = `rotate(${post.rotation + rotationOffset}deg)`;
                      
                      // Hover transform - only slight lift, NEVER change z-index
                      const hoverLift = Math.max(3, 8 - cardIndex * 2); // Front cards lift more
                      const hoverTransform = `rotate(${post.rotation + rotationOffset}deg) translateY(-${hoverLift}px)`;

                      return (
                        <div
                          key={cardIndex}
                          className={`polaroid-card ${focusedIndex === postIndex ? 'focused' : ''}`}
                          onClick={() => {
                            const actualImageIndex = reversedArray.length - 1 - cardIndex;
                            openModal(actualImageIndex, postIndex);
                          }}
                          style={{
                            position: "absolute",
                            top: `${cascadeOffsetY}px`,
                            left: `${cascadeOffsetX}px`,
                            width: `${CARD_WIDTH}px`,
                            height: `${CARD_HEIGHT}px`,
                            cursor: "pointer",
                            transform: baseTransform,
                            transformOrigin: "center center",
                            zIndex: baseZIndex, // NEVER CHANGES
                            boxShadow: cardIndex === 0 ? 
                              "0 12px 40px rgba(0, 0, 0, 0.2)" :
                              `0 ${4 + cardIndex * 2}px ${8 + cardIndex * 3}px rgba(0, 0, 0, 0.15)`,
                            border: "4px solid white",
                            transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
                          }}
                          tabIndex={focusedIndex === postIndex ? 0 : -1}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              const actualImageIndex = reversedArray.length - 1 - cardIndex;
                              openModal(actualImageIndex, postIndex);
                            }
                          }}
                          onMouseEnter={(e) => {
                            // Only change transform, NEVER z-index
                            e.currentTarget.style.transform = hoverTransform;
                            e.currentTarget.style.boxShadow = `0 ${8 + hoverLift}px ${16 + hoverLift * 2}px rgba(0, 0, 0, 0.25)`;
                          }}
                          onMouseLeave={(e) => {
                            // Return to base state, NEVER change z-index
                            e.currentTarget.style.transform = baseTransform;
                            e.currentTarget.style.boxShadow = cardIndex === 0 ? 
                              "0 12px 40px rgba(0, 0, 0, 0.2)" :
                              `0 ${4 + cardIndex * 2}px ${8 + cardIndex * 3}px rgba(0, 0, 0, 0.15)`;
                          }}
                        >
                          <p className="card-date" style={{ 
                            margin: "16px 20px 10px",
                            fontSize: "12px",
                            pointerEvents: "none",
                            userSelect: "none"
                          }}>
                            {post.submittedDate}
                          </p>

                          <img
                            className="card-image"
                            data-src={imgSrc}
                            src={loadedImages.has(imgSrc) ? imgSrc : ""}
                            alt={altText}
                            loading="lazy"
                            draggable={false}
                            style={{
                              width: "calc(100% - 32px)",
                              height: "60%",
                              margin: "0 16px",
                              pointerEvents: "none",
                              userSelect: "none",
                            }}
                          />

                          {cardIndex === reversedArray.length - 1 && (
                            <p className="card-title" style={{
                              fontSize: "16px",
                              margin: "16px 20px",
                              pointerEvents: "none",
                              userSelect: "none"
                            }}>
                              {post.title}
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </ReactInfiniteCanvas>
        )}

        {/* Controls Panel */}
        <div className="controls-panel">
          {viewMode === 'canvas' && (
            <div className="zoom-controls">
              <button 
                className="zoom-btn" 
                onClick={() => handleZoom("out")}
                aria-label="Zoom out"
              >
                <span>−</span>
              </button>
              <span className="zoom-display">{Math.round(zoomLevel * 100)}%</span>
              <button 
                className="zoom-btn" 
                onClick={() => handleZoom("in")}
                aria-label="Zoom in"
              >
                <span>+</span>
              </button>
            </div>
          )}

          <button 
            className="control-btn" 
            onClick={handleCenterView}
            aria-label={viewMode === 'canvas' ? "Center view" : "Scroll to top"}
          >
            <CenterIcon />
            {viewMode === 'canvas' ? 'Center' : 'Top'}
          </button>
        </div>

        {/* Modal */}
        {selectedMemor && (
          <MemorPicture
            images={selectedMemor.images}
            currentIndex={selectedMemor.currentIndex}
            title={selectedMemor.title}
            submitDate={selectedMemor.submittedDate}
            teamName={selectedMemor.team}
            onClose={closeModal}
            onNavigate={handleImageNavigation}
            memorId={selectedMemor.memorId}
          />
        )}
      </div>
    </>
  );
};

export default MemoryBoard;

/* .zoom-btn:hover {
  background: #D0BCFE;
  color: black;
  transform: scale(1.1);
} */