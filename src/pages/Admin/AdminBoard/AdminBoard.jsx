import {
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Checkbox,
  Button,
  Divider,
} from "@mui/material";
import background1 from "../../../assets/images/adminBackground1.svg";
import background3 from "../../../assets/images/adminBackground2.svg";
import background2 from "../../../assets/images/adminBackground3.svg";
import { useEffect, useState } from "react";
import CustomButton from "../../../Components/CustomButton/CustomButton";
import editIcon from "../../../assets/images/editIcon.svg";
import deleteIcon from "../../../assets/images/deleteIcon.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Search,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import ConfirmationModal from "../../../Components/ConfirmationModal/ConfirmationModal";
import FeedbackModal from "../../../Components/FeedbackModal/FeedbackModal";
import { useLocation } from "react-router-dom";
import Loader from "../../../Components/Loader/Loader";

const AdminBoard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get("tab") || "all";

  const [tab, setTab] = useState("memors");
  const [tab2, setTab2] = useState(tabParam);
  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };
  const handleTabChange2 = (_, newValue) => {
    setTab2(newValue);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [searchQuery3, setSearchQuery3] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editedMembers, setEditedMembers] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    action: "",
    memberName: "",
    memberEmail: "",
    teamName: "",
  });
  const [deleteTeamModalOpen, setDeleteTeamModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamThumbnail, setNewTeamThumbnail] = useState(null);
  const [newTeamMembers, setNewTeamMembers] = useState({});
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    type: "",
    title: "",
    description: "",
  });
  const [isCreateMemorModalOpen, setIsCreateMemorModalOpen] = useState(false);
  const [newMemorTitle, setNewMemorTitle] = useState("");
  const [newMemorDate, setNewMemorDate] = useState(null);
  const [newMemorDescription, setNewMemorDescription] = useState("");
  const [newMemorPoints, setNewMemorPoints] = useState(null);
  const [memors, setMemors] = useState([
    {
      title: "Coffee Break",
      description:
        "Join the coffee break, where you can share a cup and a story online. Make sure to have your favorite mug!",
      date: "02/25/2025",
      points: "+ 30 pts",
      teamsLeft: 5,
    },
    {
      title: "Fist Bump a Colleague",
      description:
        "Give a fist bump to a colleague and snap a quick photo. It's a simple gesture to boost team morale and promote connectivity.",
      date: "01/22/2025",
      points: "+ 20 pts",
      teamsLeft: 3,
    },
    {
      title: "Pet Showcase",
      description:
        "Take a photo with your pet during your workday to share with the team. Pets can be great stress relievers!",
      date: "01/17/2025",
      points: "+ 10 pts",
      teamsLeft: 2,
    },
    {
      title: "Team Lunch",
      description:
        "Organize a team lunch either in-office or virtually. Capture the moment of camaraderie and good food.",
      date: "01/13/2026",
      points: "+ 30 pts",
      teamsLeft: 4,
    },
    {
      title: "Office Decoration Challenge",
      description:
        "Decorate your workspace and showcase your creativity. The best decoration wins extra points!",
      date: "01/12/2025",
      points: "+ 20 pts",
      teamsLeft: 1,
    },
    {
      title: "Weekly Team Meeting",
      description:
        "Capture a moment from your weekly team meeting. It's about learning and growing together.",
      date: "01/11/2025",
      points: "+ 10 pts",
      teamsLeft: 2,
    },
    {
      title: "Karaoke Night",
      description:
        "Share a video or photo from a team karaoke session. Let’s see those singing skills and team spirit in action!",
      date: "01/10/2025",
      points: "+ 30 pts",
      teamsLeft: 5,
    },
    {
      title: "Team Picnic",
      description:
        "Have a relaxing day out with a team picnic. Capture the fun and outdoors as you bond over games and snacks.",
      date: "01/09/2025",
      points: "+ 20 pts",
      teamsLeft: 3,
    },
  ]);

  const [teams, setTeams] = useState({
    "Visual Voyagers": [
      "johndoe@abc.com",
      "janedoe@abc.com",
      "johnsmith@abc.com",
      "janesmith@abc.com",
    ],
    "The Debuggers": [
      "charliebrown@abc.com",
      "lucybrown@abc.com",
      "snoopybrown@abc.com",
      "woodstockbrown@abc.com",
    ],
    "Capital Crew": ["alice@abc.com", "bob@abc.com", "eve@abc.com"],
    "The Hackers": [
      "tonystark@abc.com",
      "pepperpotts@abc.com",
      "peterparker@abc.com",
    ],
    "The Coders": [
      "steverogers@abc.com",
      "natasharomanoff@abc.com",
      "brucebanner@abc.com",
    ],
    "The Programmers": [
      "thorodinson@abc.com",
      "perpos@abc.com",
      "abcdef@abc.com",
      "jklmno@abc.com",
      "lokilaufeyson@abc.com",
    ],
    "The Developers": [
      "harrypotter@abc.com",
      "hermionegranger@abc.com",
      "ronweasley@abc.com",
      "ginnyweasley@abc.com",
      "dracomalfoy@abc.com",
    ],
    "The Designers": [
      "bilbobaggins@abc.com",
      "frodobaggins@abc.com",
      "samwisegamgee@abc.com",
      "gandalfthewhite@abc.com",
      "legolasgreenleaf@abc.com",
    ],
  });

  const members = [
    {
      name: "John Doe",
      email: "johndoe@abc.com",
      team: "Visual Voyagers",
    },
    {
      name: "Jane Doe",
      email: "janedoe@abc.com",
      team: "Visual Voyagers",
    },
    {
      name: "John Smith",
      email: "johnsmith@abc.com",
      team: "Visual Voyagers",
    },
    {
      name: "Jane Smith",
      email: "janesmith@abc.com",
      team: "Visual Voyagers",
    },
    {
      name: "Charlie Brown",
      email: "charliebrown@abc.com",
      team: "Code Crushers",
    },
    {
      name: "Lucy Brown",
      email: "lucybrown@abc.com",
      team: "Code Crushers",
    },
    {
      name: "Snoopy Brown",
      email: "snoopybrown@abc.com",
      team: "Code Crushers",
    },
    {
      name: "Woodstock Brown",
      email: "woodstockbrown@abc.com",
      team: "Code Crushers",
    },
    {
      name: "Alice",
      email: "alice@abc.com",
      team: "Design Divas",
    },
    {
      name: "Bob",
      email: "bob@abc.com",
      team: "Design Divas",
    },
    {
      name: "Eve",
      email: "eve@abc.com",
      team: "Design Divas",
    },
    {
      name: "Tony Stark",
      email: "tonystark@abc.com",
      team: "Marketing Mavericks",
    },
    {
      name: "Pepper Potts",
      email: "pepperpotts@abc.com",
      team: "Marketing Mavericks",
    },
    {
      name: "Peter Parker",
      email: "peterparker@abc.com",
      team: "Marketing Mavericks",
    },
    {
      name: "Steve Rogers",
      email: "steverogers@abc.com",
      team: "Sales Superstars",
    },
    {
      name: "Natasha Romanoff",
      email: "natasharomanoff@abc.com",
      team: "Sales Superstars",
    },
    {
      name: "Bruce Banner",
      email: "brucebanner@abc.com",
      team: "Sales Superstars",
    },
    {
      name: "Thor Odinson",
      email: "thorodinson@abc.com",
      team: "HR Heroes",
    },
    {
      name: "Per Pos",
      email: "perpos@abc.com",
      team: "HR Heroes",
    },
    {
      name: "ABC DEF",
      email: "abcdef@abc.com",
      team: "HR Heroes",
    },
    {
      name: "JKL MNO",
      email: "jklmno@abc.com",
      team: "HR Heroes",
    },
    {
      name: "Loki Laufeyson",
      email: "lokilaufeyson@abc.com",
      team: "HR Heroes",
    },
    {
      name: "Harry Potter",
      email: "harrypotter@abc.com",
      team: "Finance Falcons",
    },
    {
      name: "Hermione Granger",
      email: "hermionegranger@abc.com",
      team: "Finance Falcons",
    },
    {
      name: "Ron Weasley",
      email: "ronweasley@abc.com",
      team: "Finance Falcons",
    },
    {
      name: "Ginny Weasley",
      email: "ginnyweasley@abc.com",
      team: "Finance Falcons",
    },
    {
      name: "Draco Malfoy",
      email: "dracomalfoy@abc.com",
      team: "Finance Falcons",
    },
    {
      name: "Bilbo Baggins",
      email: "bilbobaggins@abc.com",
      team: "Product Pioneers",
    },
    {
      name: "Frodo Baggins",
      email: "frodobaggins@abc.com",
      team: "Product Pioneers",
    },
    {
      name: "Samwise Gamgee",
      email: "samwisegamgee@abc.com",
      team: "Product Pioneers",
    },
    {
      name: "Gandalf the White",
      email: "gandalfthewhite@abc.com",
      team: "Product Pioneers",
    },
    {
      name: "Legolas Greenleaf",
      email: "legolasgreenleaf@abc.com",
      team: "Product Pioneers",
    },
    {
      name: "Elon Musk",
      email: "elonmusk@abc.com",
      team: "Tech Titans",
    },
    {
      name: "Mark Zuckerberg",
      email: "markzuckerberg@abc.com",
      team: "Tech Titans",
    },
    {
      name: "Steve Jobs",
      email: "stevejobs@abc.com",
      team: "Tech Titans",
    },
    {
      name: "Bill Gates",
      email: "billgates@abc.com",
      team: "Tech Titans",
    },
    {
      name: "Jeff Bezos",
      email: "jeffbezos@abc.com",
      team: "Tech Titans",
    },
    {
      name: "Warren Buffet",
      email: "warrenbuffet@abc.com",
      team: "Strategy Stars",
    },
    {
      name: "Ray Dalio",
      email: "raydalio@abc.com",
      team: "Strategy Stars",
    },
    {
      name: "Jamie Dimon",
      email: "jamiedimon@abc.com",
      team: "Strategy Stars",
    },
    {
      name: "Lloyd Blankfein",
      email: "lloydblankfein@abc.com",
      team: "Strategy Stars",
    },
    {
      name: "Henry Kravis",
      email: "henrykravis@abc.com",
      team: "Strategy Stars",
    },
    {
      name: "Rodrigo Silva",
      email: "rodrigosilva@abc.com",
      team: "",
    },
    {
      name: "Rui Silva",
      email: "rui@blip.com",
      team: "",
    },
    {
      name: "Nuno Matos",
      email: "nunomatos@abc.com",
      team: "",
    },
    {
      name: "Miguel Pereira",
      email: "miguelpereira@abc.com",
      team: "",
    },
    {
      name: "Tatiana Aires",
      email: "tatianaaires@abc.com",
      team: "",
    },
    {
      name: "Ana João",
      email: "anajoao@abc.com",
      team: "",
    },
  ];

  useEffect(() => {
    document.title = `Memor'us | Admin board`;
  }, []);

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filteredMemors = memors
    .filter((memor) =>
      memor.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((memor) => {
      if (tab2 === "all") return true;
      if (tab2 === "ongoing") return memor.timeLeft !== "0:00H";
      if (tab2 === "closed") return memor.timeLeft === "0:00H";
      return true;
    });

  const filteredMembers = Object.values(members).filter((member) =>
    member.name.toLowerCase().includes(searchQuery2.toLowerCase())
  );

  const startEditing = (teamName) => {
    setEditingTeam(teamName);
    const currentMembers = teams[teamName] || [];
    setEditedMembers(
      members.reduce((acc, member) => {
        acc[member.email] = currentMembers.includes(member.email);
        return acc;
      }, {})
    );
    setIsEditing(true);
  };

  const handleCheckboxToggle = (email, name, action) => {
    setModalData({
      action,
      memberName: name,
      memberEmail: email,
      teamName: editingTeam,
    });
    setModalOpen(true);
  };

  const handleModalConfirm = () => {
    const { memberEmail, action } = modalData;
    setEditedMembers((prev) => ({
      ...prev,
      [memberEmail]: action === "add",
    }));
    setModalOpen(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const saveChangesEditTeam = () => {
    setTeams((prevTeams) => {
      const updatedTeams = { ...prevTeams };
      updatedTeams[editingTeam] = Object.entries(editedMembers)
        .filter(([_, isSelected]) => isSelected)
        .map(([email]) => email);
      return updatedTeams;
    });
    setFeedbackModal({
      open: true,
      type: "success",
      title: "Team Updated",
      description: `The team "${editingTeam}" has been successfully updated.`,
    });
    setIsEditing(false);
    setEditingTeam(null);
    setEditedMembers({});
    setSearchQuery2("");
  };

  const saveChangesCreateTeam = () => {
    if (newTeamName.trim()) {
      setTeams((prevTeams) => ({
        ...prevTeams,
        [newTeamName]: Object.entries(newTeamMembers)
          .filter(([_, isSelected]) => isSelected)
          .map(([email]) => email),
      }));
      setFeedbackModal({
        open: true,
        type: "success",
        title: "Team Created",
        description: `The team "${newTeamName}" has been successfully created.`,
      });
      handleTeamModalClose();
      setNewTeamName("");
      setNewTeamThumbnail(null);
      setNewTeamMembers({});
    } else {
      alert("Please enter a team name.");
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingTeam(null);
    setEditedMembers({});
    setNewTeamThumbnail(null);
    setSearchQuery2("");
  };

  const getMemberTeam = (email) => {
    return Object.entries(teams).find(([_, members]) =>
      members.includes(email)
    )?.[0];
  };

  const confirmDeleteTeam = () => {
    setTeams((prevTeams) => {
      const updatedTeams = { ...prevTeams };
      delete updatedTeams[teamToDelete];
      return updatedTeams;
    });
    setFeedbackModal({
      open: true,
      type: "success",
      title: "Team Deleted",
      description: `The team "${teamToDelete}" has been successfully deleted.`,
    });

    setDeleteTeamModalOpen(false);
    setTeamToDelete(null);
  };

  const cancelDeleteTeam = () => {
    setDeleteTeamModalOpen(false);
    setTeamToDelete(null);
  };

  const filteredTeams = Object.entries(teams).filter(([teamName]) =>
    teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTeamModalClose = () => {
    setIsCreateModalOpen(false);
    setNewTeamThumbnail(null);
    setNewTeamMembers({});
    setNewTeamName("");
    setSearchQuery3("");
    document.body.style.overflow = "auto";
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewTeamThumbnail(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const unassignedMembers = members.filter((member) => member.team === "");

  const filteredUnassignedMembers = unassignedMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery3.toLowerCase())
  );

  const handleTeamModalOpen = () => {
    setIsCreateModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCreateMemor = () => {
    try {
      if (!newMemorTitle || !newMemorDate || !newMemorPoints) {
        alert("Please fill in all the fields.");
        return;
      }

      // Format the date using JavaScript's Date object
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const newMemor = {
        title: newMemorTitle,
        description: newMemorDescription,
        date: formatDate(newMemorDate),
        points: `+ ${newMemorPoints} pts`,
        timeLeft:
          calculateDaysLeft(newMemorDate) > 0
            ? `${calculateDaysLeft(newMemorDate)} days left`
            : "0:00H",
        teamsLeft: Object.keys(teams).length,
      };

      setMemors((prevMemors) => [...prevMemors, newMemor]);
      setFeedbackModal({
        open: true,
        type: "success",
        title: "Memor Created",
        description: `The memor "${newMemorTitle}" has been successfully created.`,
      });

      handleCreateMemorModalClose();
    } catch (error) {
      console.error("Error while creating a memor:", error);
    }
  };

  const handleCreateMemorModalOpen = () => {
    setIsCreateMemorModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCreateMemorModalClose = () => {
    setIsCreateMemorModalOpen(false);
    setNewMemorTitle("");
    setNewMemorDate(null);
    setNewMemorDescription("");
    setNewMemorPoints(null);
    document.body.style.overflow = "auto";
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [deleteMemorModalOpen, setDeleteMemorModalOpen] = useState(false);
  const [memorToDelete, setMemorToDelete] = useState(null);

  const confirmDeleteMemor = () => {
    setMemors((prevMemors) =>
      prevMemors.filter((memor) => memor !== memorToDelete)
    );
    setFeedbackModal({
      open: true,
      type: "success",
      title: "Memor Deleted",
      description: `The memor "${memorToDelete.title}" has been successfully deleted.`,
    });
    setDeleteMemorModalOpen(false);
    setMemorToDelete(null);
  };

  const cancelDeleteMemor = () => {
    setDeleteMemorModalOpen(false);
    setMemorToDelete(null);
  };

  const [isEditMemorModalOpen, setIsEditMemorModalOpen] = useState(false);
  const [memorToEdit, setMemorToEdit] = useState(null);
  const [confirmEditMemorModalOpen, setConfirmEditMemorModalOpen] =
    useState(false);

  const handleEditMemorModalOpen = (memor) => {
    setMemorToEdit(memor);
    setNewMemorTitle(memor.title);
    setNewMemorDescription(memor.description);
    setNewMemorDate(memor.date.split("/").reverse().join("-")); // Convert DD/MM/YYYY to YYYY-MM-DD
    setNewMemorPoints(
      parseInt(memor.points.replace("+ ", "").replace(" pts", ""), 10)
    );
    setIsEditMemorModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleEditMemorModalClose = () => {
    setIsEditMemorModalOpen(false);
    setMemorToEdit(null);
    setNewMemorTitle("");
    setNewMemorDescription("");
    setNewMemorDate(null);
    setNewMemorPoints(null);
    document.body.style.overflow = "auto";
  };

  const handleEditMemor = () => {
    if (!newMemorTitle || !newMemorDate || !newMemorPoints) {
      alert("Please fill in all the fields.");
      return;
    }
    setConfirmEditMemorModalOpen(true);
  };

  const confirmEditMemor = () => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const updatedMemor = {
      ...memorToEdit,
      title: newMemorTitle,
      description: newMemorDescription,
      date: formatDate(newMemorDate),
      points: `+ ${newMemorPoints} pts`,
    };

    setMemors((prevMemors) =>
      prevMemors.map((memor) => (memor === memorToEdit ? updatedMemor : memor))
    );

    setFeedbackModal({
      open: true,
      type: "success",
      title: "Memor Updated",
      description: `The memor "${newMemorTitle}" has been successfully updated.`,
    });

    handleEditMemorModalClose();
    setConfirmEditMemorModalOpen(false); // Close the confirmation modal
  };

  const cleanSearchQuery = () => {
    setSearchQuery("");
  };

  const [isCurrentCompetition, setIsCurrentCompetition] = useState(true);
  const [isEditCompetitionModalOpen, setIsEditCompetitionModalOpen] =
    useState(false);
  const [competitionToEdit, setCompetitionToEdit] = useState(null);
  const [newCompetitionTitle, setNewCompetitionTitle] = useState("");
  const [newCompetitionDescription, setNewCompetitionDescription] =
    useState("");
  const [newCompetitionStartDate, setNewCompetitionStartDate] = useState("");
  const [newCompetitionEndDate, setNewCompetitionEndDate] = useState("");
  const [confirmEditCompetitionModalOpen, setConfirmEditCompetitionModalOpen] =
    useState(false);

  const checkCompStatus = (startDate, endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (today >= start && today <= end) {
      return "Ongoing";
    } else {
      return "Closed";
    }
  };

  const [competitions, setCompetitions] = useState([
    {
      id: 9,
      title: "New Year New Us",
      description:
        "For this competition, focus on capturing moments that highlight our team's spirit and the memories we're creating together. Let your entries celebrate our collective growth, the bonds we're strengthening, and the journey we're sharing in striving to achieve our best. 🌟",
      startDate: "2025/02/01",
      endDate: "2025/05/31",
    },
    {
      id: 8,
      title: "Winter Wonderland",
      description:
        "December invites you to capture wintry scenes, holiday lights, and festive cheer. Let’s see your best winter wonderland moments as we approach the year's end. ❄️",
      startDate: "2024/12/01",
      endDate: "2024/12/31",
    },
    {
      id: 7,
      title: "Thanksgiving Gatherings",
      description:
        "For November's competition, submit photos that showcase Thanksgiving celebrations, family reunions, or expressions of gratitude. Highlight the warmth and joy of gathering with loved ones. 🦃",
      startDate: "2024/11/06",
      endDate: "2024/11/30",
    },
    {
      id: 6,
      title: "Halloween Haunts",
      description:
        "This October, show us your best Halloween-themed photos. From spooky decorations and costumes to creative pumpkin carvings, let's see how you celebrate this eerie, fun-filled holiday. 🎃",
      startDate: "2024/10/16",
      endDate: "2024/11/05",
    },
    {
      id: 5,
      title: "Autumn Colors",
      description:
        "Capture the essence of autumn with its rich colors and serene landscapes. We're looking for stunning photos that highlight the beauty of the season, from fall foliage to harvest festivals. Embrace the season's beauty! 🍂",
      startDate: "2024/09/01",
      endDate: "2024/10/15",
    },
    {
      id: 4,
      title: "Patriotic Celebrations",
      description:
        "In July, capture the spirit of patriotism with photos from national day celebrations, fireworks, parades, and family gatherings. Show us what pride in your country looks like! 🎆",
      startDate: "2024/07/01",
      endDate: "2024/07/31",
    },
    {
      id: 3,
      title: "Summer Solstice",
      description:
        "Celebrate the longest day of the year with photos that capture the essence of summer. Think beach days, barbecues, or festivals—anything that represents the heat and excitement of the season. ☀️",
      startDate: "2024/06/01",
      endDate: "2024/06/30",
    },
    {
      id: 2,
      title: "Spring Into Nature",
      description:
        "As spring transitions into summer, let's capture the explosion of life in nature. Focus on landscapes, wildlife, and plant growth that define this vibrant season. 🌼",
      startDate: "2024/04/20",
      endDate: "2024/05/20",
    },
    {
      id: 1,
      title: "Easter Spring Awakening",
      description:
        "Easter is a time of renewal and joy. For this competition, submit your best shots of Easter celebrations, spring flowers, or family gatherings. Let's see how you capture the essence of spring and rebirth. 🌷",
      startDate: "2024/03/15",
      endDate: "2024/04/15",
    },
  ]);

  const finishedCompetitions = competitions.filter((comp) => {
    const status = checkCompStatus(comp.startDate, comp.endDate);
    return status === "Closed";
  });

  const filteredCompetitions = finishedCompetitions.filter((comp) =>
    comp.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditCompetitionModalOpen = (competition) => {
    setCompetitionToEdit(competition);
    setNewCompetitionTitle(competition.title);
    setNewCompetitionDescription(competition.description);
    setNewCompetitionStartDate(competition.startDate);
    setNewCompetitionEndDate(competition.endDate);
    setIsEditCompetitionModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleEditCompetitionModalClose = () => {
    setIsEditCompetitionModalOpen(false);
    setCompetitionToEdit(null);
    setNewCompetitionTitle("");
    setNewCompetitionDescription("");
    setNewCompetitionStartDate("");
    setNewCompetitionEndDate("");
    document.body.style.overflow = "auto";
  };

  const handleEditCompetition = () => {
    if (
      !newCompetitionTitle ||
      !newCompetitionStartDate ||
      !newCompetitionEndDate
    ) {
      alert("Please fill in all the fields.");
      return;
    }
    setConfirmEditCompetitionModalOpen(true);
  };

  const confirmEditCompetition = () => {
    const updatedCompetition = {
      ...competitionToEdit,
      title: newCompetitionTitle,
      description: newCompetitionDescription,
      startDate: newCompetitionStartDate,
      endDate: newCompetitionEndDate,
    };

    setCompetitions((prevCompetitions) =>
      prevCompetitions.map((comp) =>
        comp === competitionToEdit ? updatedCompetition : comp
      )
    );

    setFeedbackModal({
      open: true,
      type: "success",
      title: "Competition Updated",
      description: `The competition "${newCompetitionTitle}" has been successfully updated.`,
    });

    // Close the confirmation modal
    setConfirmEditCompetitionModalOpen(false);
    handleEditCompetitionModalClose();
  };

  // Function to return the ongoing competition
  const ongoingCompetition = competitions.find((comp) => {
    const status = checkCompStatus(comp.startDate, comp.endDate);
    return status === "Ongoing";
  });

  // Function to calculate the days left for the ongoing competition
  const calculateDaysLeft = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const timeLeft = end - today;
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  function formatDate(dateStr) {
    const parts = dateStr.split("/");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  return (
    <>
      <Loader />

      <div className='container'>
        <img
          src={background1}
          alt='leaderboard-bg1'
          style={{
            position: "absolute",
            top: "2",
            right: "0",
            width: "15%",
            zIndex: "0",
          }}
        />
        <img
          src={background2}
          alt='leaderboard-bg2'
          style={{
            position: "absolute",
            top: "25%",
            left: "5%",
            width: "5%",
            zIndex: "0",
          }}
        />
        <img
          src={background3}
          alt='leaderboard-bg3'
          style={{
            position: "absolute",
            top: "35%",
            right: "6%",
            width: "5%",
            zIndex: "0",
          }}
        />
        <Typography
          variant='h4'
          sx={{
            fontWeight: "bold",
            color: "white",
            marginBottom: "30px",
            padding: "20px",
          }}
        >
          Admin Board
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Tabs
              value={tab}
              onChange={(event, newValue) => {
                handleTabChange(event, newValue);
                cleanSearchQuery();
              }}
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "14px",
                  color: "#CCE8E2",
                  padding: "6px 16px",
                  borderRadius: "40px",
                  border: "1px solid #938f99",
                  marginRight: "10px",
                  "&:hover": {
                    backgroundColor: "rgba(204, 232, 226, 0.08)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#384c44",
                    color: "#CCE8E2",
                  },
                },
              }}
            >
              <Tab value='memors' label='Manage Memors' />
              <Tab value='teams' label='Manage Teams' />
              <Tab value='competition' label='Manage Competition' />
            </Tabs>
            <TextField
              placeholder='Search'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant='outlined'
              size='small'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search fontSize='small' sx={{ color: "gray" }} />
                    </InputAdornment>
                  ),
                },
              }}
              inputProps={{
                "aria-label": "Search Memors",
              }}
              sx={{
                borderRadius: "40px",
                input: { color: "white" },
                width: "250px",
                border: "0.905px solid #88938F",
                "& fieldset": { border: "none" },
                "&:hover": { backgroundColor: "#2E2F30" },
              }}
            />
          </Box>

          {tab === "memors" && (
            <Box
              sx={{
                width: "100%",
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                borderRadius: "13.576px",
                border: "2.715px solid #333738",
                background: "#1E1F20",
                padding: "20px",
                backdropFilter: "blur(20px)",
                marginBottom: "50px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <CustomButton
                  text='Create a Memor'
                  onClick={() => handleCreateMemorModalOpen()}
                  sx={{
                    backgroundColor: "#B5EDE4",
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#A3DFD8",
                    },
                  }}
                  icon={
                    <Typography
                      component='span'
                      sx={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      +
                    </Typography>
                  }
                />

                <Tabs
                  value={tab2}
                  onChange={handleTabChange2}
                  TabIndicatorProps={{ style: { display: "none" } }}
                  sx={{
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontSize: "14px",
                      color: "#82D5C7",
                      padding: "6px 16px",
                      borderRadius: "40px",
                      border: "1px solid #938f99",
                      marginRight: "10px",
                      "&:hover": {
                        backgroundColor: "rgba(130, 213, 199, 0.08)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#88d4c4",
                        color: "#003731",
                      },
                    },
                  }}
                >
                  <Tab value='all' label='All Memors' />
                  <Tab value='ongoing' label='Ongoing' />
                  <Tab value='closed' label='Closed' />
                </Tabs>
              </Box>

              {/* Table Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  fontWeight: "bold",
                  color: "white",
                  marginTop: "20px",
                  width: "100%",
                }}
              >
                <Typography variant='body2' sx={{ flex: 2 }}>
                  Title
                </Typography>
                <Typography variant='body2' sx={{ flex: 4 }}>
                  Description
                </Typography>
                <Typography variant='body2' sx={{ flex: 1 }}>
                  Points
                </Typography>
                <Typography variant='body2' sx={{ flex: 1 }}>
                  Time Left
                </Typography>
                <Typography variant='body2' sx={{ flex: 1 }}>
                  Teams Left
                </Typography>
                <Typography variant='body2' sx={{ flex: 1 }}></Typography>
              </Box>

              {/* Table Rows */}
              {filteredMemors.map((memor, index) => (
                <Box
                  key={index}
                  onClick={() => toggleExpand(index)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px",
                    alignItems: "center",
                    color: "white",
                    marginBottom: "10px",
                    borderRadius: "10.861px",
                    border: "2.715px solid #333738",
                    background: "#272728",
                    cursor: "pointer",
                    width: "100%",
                    "&:hover": {
                      backgroundColor: "#3a3b3c",
                    },
                  }}
                >
                  <Box sx={{ flex: 2 }}>
                    <Typography variant='body2' sx={{ fontWeight: "bold" }}>
                      {memor.title}
                    </Typography>
                    {expandedIndex === index && (
                      <Typography variant='caption' sx={{ color: "#CBCBCB" }}>
                        {memor.date}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant='body2' sx={{ flex: 4 }}>
                    {expandedIndex === index
                      ? memor.description
                      : `${memor.description.substring(0, 50)} (...)`}
                  </Typography>
                  <Typography variant='body2' sx={{ flex: 1 }}>
                    {memor.points}
                  </Typography>
                  <Typography variant='body2' sx={{ flex: 1 }}>
                    {(() => {
                      const daysLeft = calculateDaysLeft(memor.date);
                      if (daysLeft > 0) {
                        return `${daysLeft} days left`;
                      } else if (daysLeft === 0) {
                        return (
                          <span style={{ color: "#d8504d" }}>
                            &lt; 1 day left
                          </span>
                        );
                      } else {
                        return (
                          <span style={{ opacity: 0 }}>
                            <span style={{ color: "#d8504d" }}>
                              0 days left
                            </span>
                          </span>
                        );
                      }
                    })()}
                  </Typography>
                  <Typography variant='body2' sx={{ flex: 1 }}>
                    {memor.teamsLeft}
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "right",
                      gap: "5px",
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditMemorModalOpen(memor);
                      }}
                      sx={{
                        display:
                          calculateDaysLeft(memor.date) < 0 ? "none" : "block",
                      }}
                    >
                      <img
                        src={editIcon}
                        alt='edit'
                        style={{ width: "20px" }}
                      />
                    </IconButton>

                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setMemorToDelete(memor);
                        setDeleteMemorModalOpen(true);
                      }}
                      sx={{
                        display:
                          calculateDaysLeft(memor.date) < 0 ? "none" : "block",
                      }}
                    >
                      <img
                        src={deleteIcon}
                        alt='delete'
                        style={{ width: "20px" }}
                      />
                    </IconButton>

                    <IconButton aria-label='expand'>
                      {expandedIndex === index ? (
                        <KeyboardArrowUp sx={{ color: "white" }} />
                      ) : (
                        <KeyboardArrowDown sx={{ color: "white" }} />
                      )}
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {tab === "teams" && (
            <Box
              sx={{
                width: "100%",
                marginTop: "20px",
                borderRadius: "13.576px",
                border: "2.715px solid #333738",
                background: "#1E1F20",
                padding: "20px",
                backdropFilter: "blur(20px)",
                marginBottom: "50px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <CustomButton
                  text='Create a Team'
                  onClick={() => handleTeamModalOpen()}
                  sx={{
                    backgroundColor: "#B5EDE4",
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "none",
                    marginBottom: "40px",
                    "&:hover": {
                      backgroundColor: "#80ccbc",
                    },
                  }}
                  icon={
                    <Typography
                      component='span'
                      sx={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      +
                    </Typography>
                  }
                />
              </Box>

              {filteredTeams.map(([teamName, teamMembers]) => (
                <Box
                  key={teamName}
                  sx={{
                    marginBottom: "15px",
                    borderRadius: "10.861px",
                    border: "2.715px solid #333738",
                    background: "#272728",
                    padding: "15px",
                  }}
                >
                  {!isEditing || editingTeam !== teamName ? (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 4fr 1fr",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant='body2'
                          sx={{ fontWeight: "bold", color: "white" }}
                        >
                          {teamName}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography>
                          Members:{" "}
                          {teamMembers
                            .slice(0, 3)
                            .map(
                              (email) =>
                                members.find((member) => member.email === email)
                                  ?.name
                            )
                            .join(", ")}
                          {teamMembers.length > 3 && "..."}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <IconButton onClick={() => startEditing(teamName)}>
                          <img
                            src={editIcon}
                            alt='Edit teams'
                            style={{ width: "20px" }}
                          />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setTeamToDelete(teamName);
                            setDeleteTeamModalOpen(true);
                          }}
                        >
                          <img
                            src={deleteIcon}
                            alt='Delete'
                            style={{ width: "20px" }}
                          />
                        </IconButton>
                      </Box>
                    </Box>
                  ) : (
                    // Edit mode
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 6fr",
                          gap: 5,
                        }}
                      >
                        <Typography variant='body1' sx={{ color: "white" }}>
                          Editing Team: {teamName}
                        </Typography>
                        <Box>
                          <Typography
                            variant='body2'
                            sx={{ color: "white", marginBottom: "10px" }}
                          >
                            Members
                          </Typography>
                          <TextField
                            placeholder='Search'
                            value={searchQuery2}
                            onChange={(e) => setSearchQuery2(e.target.value)}
                            variant='outlined'
                            size='small'
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position='start'>
                                    <Search
                                      fontSize='small'
                                      sx={{ color: "gray" }}
                                    />
                                  </InputAdornment>
                                ),
                              },
                            }}
                            inputProps={{
                              "aria-label": "Search Memors",
                            }}
                            sx={{
                              borderRadius: "40px",
                              input: { color: "white" },
                              width: "250px",
                              height: "40px",
                              border: "0.905px solid #88938F",
                              marginBottom: "10px",
                              "& fieldset": { border: "none" },
                            }}
                          />
                          <Box
                            sx={{
                              backgroundColor: "#181818",
                              padding: "10px",
                              borderRadius: "10.706px",
                              border: "0.892px solid #88938F",
                              background: "#181818",
                              maxHeight: "300px",
                              minHeight: "90px",
                              overflowY: "auto",
                              marginBottom: "10px",
                            }}
                          >
                            {filteredMembers
                              .sort((a, b) => {
                                const isInTeamA = teams[editingTeam]?.includes(
                                  a.email
                                );
                                const isInTeamB = teams[editingTeam]?.includes(
                                  b.email
                                );

                                const isUnassignedA = a.team === "";
                                const isUnassignedB = b.team === "";

                                if (isInTeamA && !isInTeamB) return -1;
                                if (!isInTeamA && isInTeamB) return 1;

                                if (isUnassignedA && !isUnassignedB) return -1;
                                if (!isUnassignedA && isUnassignedB) return 1;

                                return 0;
                              })
                              .map((member) => {
                                const memberTeam = getMemberTeam(member.email);
                                const isInAnotherTeam =
                                  memberTeam && memberTeam !== teamName;
                                const isInTeam = editedMembers[member.email];
                                const action = isInTeam ? "remove" : "add";

                                return (
                                  <Box
                                    key={member.email}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      padding: "10px",
                                      marginBottom: "10px",
                                      opacity: isInAnotherTeam ? 0.6 : 1,
                                      borderBottom: "1px solid #333738",
                                    }}
                                  >
                                    <Checkbox
                                      disabled={isInAnotherTeam}
                                      checked={isInTeam}
                                      onChange={() =>
                                        handleCheckboxToggle(
                                          member.email,
                                          member.name,
                                          action
                                        )
                                      }
                                      sx={{
                                        color: isInAnotherTeam
                                          ? "#888888"
                                          : "#82D5C7",
                                        "&.Mui-checked": {
                                          color: "#82D5C7",
                                        },
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        color: "#DDE4E1",
                                        flex: 1,
                                        marginLeft: "10px",
                                        textDecoration: isInAnotherTeam
                                          ? "line-through"
                                          : "none",
                                      }}
                                    >
                                      {member.name}
                                      {isInAnotherTeam &&
                                        ` (Team: ${member.team})`}
                                    </Typography>
                                    <Typography
                                      sx={{ color: "#BEC9C5" }}
                                      variant='body2'
                                    >
                                      {member.email}
                                    </Typography>
                                  </Box>
                                );
                              })}
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 2,
                        }}
                      >
                        <CustomButton
                          text='Cancel'
                          onClick={cancelEditing}
                          sx={{
                            backgroundColor: "transparent",
                            border: "1px solid #B5EDE4",
                            color: "#B5EDE4",
                            borderRadius: "50px",
                            "&:hover": {
                              backgroundColor: "rgba(181, 237, 228, 0.08)",
                            },
                          }}
                        />
                        <CustomButton
                          text='Confirm'
                          onClick={saveChangesEditTeam}
                          sx={{
                            borderRadius: "50px",
                            "&:hover": {
                              backgroundColor: "#80ccbc",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {tab === "competition" && (
            <Box
              sx={{
                width: "100%",
                marginTop: "20px",
                borderRadius: "13.576px",
                border: "2.715px solid #333738",
                background: "#1E1F20",
                padding: "20px",
                backdropFilter: "blur(20px)",
                marginBottom: "50px",
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {ongoingCompetition ? (
                    <CustomButton
                      text='Create a Competition'
                      disabled={true}
                      sx={{
                        backgroundColor: "rgba(49, 49, 49, 1)",
                        color: "rgba(26, 26, 26, 1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "10px 20px",
                        borderRadius: "20px",
                        border: "none",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "rgba(49, 49, 49, 1)",
                        },
                        cursor: "not-allowed",
                      }}
                      icon={
                        <Typography
                          component='span'
                          sx={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            display: "flex",
                            alignItems: "center",
                            color: "rgba(26, 26, 26, 1)",
                          }}
                        >
                          +
                        </Typography>
                      }
                    />
                  ) : (
                    <CustomButton
                      text='Create a Competition'
                      onClick={() => handleCreateCompetitionModalOpen()}
                      sx={{
                        backgroundColor: "#B5EDE4",
                        color: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "10px 20px",
                        borderRadius: "20px",
                        border: "none",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "#80ccbc",
                        },
                      }}
                      icon={
                        <Typography
                          component='span'
                          sx={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          +
                        </Typography>
                      }
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 4fr",
                    marginTop: "40px",
                  }}
                >
                  <Typography
                    variant='body1'
                    sx={{
                      fontWeight: "bold",
                      color: "#FFFFFF",
                      marginBottom: "20px",
                    }}
                  >
                    Ongoing Competition
                  </Typography>
                  {ongoingCompetition ? (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "25px",
                          fontWeight: "bold",
                          color: "white",
                          borderRadius: "10.861px",
                          border: "2.715px solid #333738",
                          background: "#272728",
                        }}
                      >
                        <Box
                          sx={{
                            flex: 2,
                            display: "flex",
                            gap: "15px",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            variant='body2'
                            sx={{ fontWeight: "bold" }}
                          >
                            {ongoingCompetition.title}
                          </Typography>
                          <Typography variant='body2'>
                            {ongoingCompetition.description}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            flex: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                          }}
                        >
                          <Typography variant='body2'>Duration</Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <Typography
                              variant='body2'
                              sx={{ color: "#9FE9E4" }}
                            >
                              {calculateDaysLeft(ongoingCompetition.endDate)}{" "}
                              days remaining
                            </Typography>
                            <Typography variant='body2'>
                              {formatDate(ongoingCompetition.startDate)} -{" "}
                              {formatDate(ongoingCompetition.endDate)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          {ongoingCompetition &&
                          competitions.some(
                            (comp) => comp.id === ongoingCompetition.id
                          ) ? (
                            competitions
                              .filter(
                                (comp) => comp.id === ongoingCompetition.id
                              )
                              .map((competition) => (
                                <IconButton
                                  onClick={() =>
                                    handleEditCompetitionModalOpen(competition)
                                  }
                                  key={competition.id}
                                >
                                  <img
                                    src={editIcon}
                                    alt='edit'
                                    style={{ width: "20px" }}
                                  />
                                </IconButton>
                              ))
                          ) : (
                            <p></p>
                          )}
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0px 25px 25px 25px",
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      <Box
                        sx={{
                          flex: 2,
                          display: "flex",
                          gap: "15px",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant='body2'
                          sx={{ fontWeight: "bold", color: "#C3AAAA" }}
                        >
                          No Ongoing Competition
                        </Typography>
                        <Typography variant='body2' sx={{ color: "#C3AAAA" }}>
                          It looks like there are no active competitions right
                          now. To get started, simply create a new competition
                          by clicking the button. You can define the rules and
                          set timelines.
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Divider */}
                <Divider
                  sx={{
                    backgroundColor: "gray",
                    marginTop: "40px",
                    marginBottom: "40px",
                  }}
                />

                {tab === "competition" && (
                  <Box>
                    {/* Competition History */}
                    <Typography
                      variant='body1'
                      sx={{
                        fontWeight: "bold",
                        color: "#FFFFFF",
                        marginBottom: "20px",
                      }}
                    >
                      Completed Competitions
                    </Typography>

                    {/* Table Header */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "15px",
                        fontWeight: "bold",
                        color: "white",
                        marginTop: "20px",
                        width: "100%",
                      }}
                    >
                      <Typography variant='body2' sx={{ flex: 2 }}>
                        Title
                      </Typography>
                      <Typography variant='body2' sx={{ flex: 4 }}>
                        Description
                      </Typography>
                      <Typography variant='body2' sx={{ flex: 2 }}>
                        Duration
                      </Typography>
                      <Typography variant='body2' sx={{ flex: 1 }}></Typography>
                    </Box>

                    {/* Table Rows */}
                    {filteredCompetitions.map((comp, index) => (
                      <Box
                        key={index}
                        onClick={() => toggleExpand(index)}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "15px",
                          alignItems: "center",
                          color: "white",
                          marginBottom: "10px",
                          borderRadius: "10.861px",
                          border: "2.715px solid #333738",
                          background: "#272728",
                          cursor: "pointer",
                          width: "100%",
                          "&:hover": {
                            backgroundColor: "#3a3b3c",
                          },
                        }}
                      >
                        <Box sx={{ flex: 2 }}>
                          <Typography
                            variant='body2'
                            sx={{ fontWeight: "bold" }}
                          >
                            {comp.title}
                          </Typography>
                        </Box>
                        <Typography variant='body2' sx={{ flex: 4 }}>
                          {expandedIndex === index
                            ? comp.description
                            : `${comp.description.substring(0, 50)} (...)`}
                        </Typography>
                        <Typography variant='body2' sx={{ flex: 2 }}>
                          {comp.startDate} - {comp.endDate}
                        </Typography>
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <IconButton>
                            {expandedIndex === index ? (
                              <KeyboardArrowUp sx={{ color: "white" }} />
                            ) : (
                              <KeyboardArrowDown sx={{ color: "white" }} />
                            )}
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Confirmation Modal */}
          <ConfirmationModal
            open={modalOpen}
            onClose={handleModalClose}
            onConfirm={handleModalConfirm}
            action={modalData.action}
            context='team'
            itemName={modalData.memberName}
            teamName={modalData.teamName}
            aria-labelledby='confirmation-modal-title'
            aria-describedby='confirmation-modal-description'
          />

          {/* Confirmation Modal for Deleting Team */}
          {deleteTeamModalOpen && (
            <ConfirmationModal
              open={deleteTeamModalOpen}
              onClose={cancelDeleteTeam}
              onConfirm={confirmDeleteTeam}
              action='delete'
              context='team'
              itemName={teamToDelete}
            />
          )}

          {/* Create Team Modal */}
          {isCreateModalOpen && (
            <div
              className='modal-overlay-submit-memor'
              role='dialog'
              aria-modal='true'
            >
              <div
                className='modal-container'
                style={{ padding: "20px", maxWidth: "600px" }}
                tabIndex={-1} // Make the modal focusable
              >
                <div className='modal-top' style={{ marginBottom: "20px" }}>
                  <Button
                    onClick={() => handleTeamModalClose()}
                    sx={{ minWidth: 0, p: 0, color: "#BEC9C5" }}
                    aria-label='Close modal'
                  >
                    <ArrowBackIcon />
                  </Button>
                  <Typography
                    variant='h6'
                    sx={{ marginLeft: "10px", color: "#BEC9C5" }}
                    id='create-team-modal-title'
                  >
                    Admin Board
                  </Typography>
                </div>
                <Typography
                  variant='h5'
                  sx={{
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    marginBottom: "20px",
                  }}
                >
                  Team Configuration
                </Typography>
                <TextField
                  label="Team's Name"
                  variant='outlined'
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  fullWidth
                  sx={{
                    marginBottom: "20px",
                    "& .MuiInputBase-input": { color: "#FFFFFF" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#888" },
                      "&:hover fieldset": { borderColor: "#AAA" },
                      "&.Mui-focused fieldset": { borderColor: "#CCC" },
                    },
                    "& .MuiInputLabel-root": { color: "#888" },
                  }}
                  inputProps={{
                    "aria-label": "Team's Name",
                  }}
                />
                <Typography
                  variant='body1'
                  sx={{ color: "#CAC4D0", marginBottom: "10px" }}
                >
                  Thumbnail
                </Typography>
                <div
                  style={{
                    border: "1px dashed #888",
                    borderRadius: "10px",
                    padding: "20px",
                    textAlign: "center",
                    marginBottom: "20px",
                    position: "relative",
                    background: "#1E1E1E",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {newTeamThumbnail ? (
                    <img
                      src={newTeamThumbnail}
                      alt='Uploaded Thumbnail'
                      style={{ borderRadius: "10px", height: "120px" }}
                      aria-label='Uploaded Thumbnail'
                    />
                  ) : (
                    <>
                      <label htmlFor='file-input' style={{ cursor: "pointer" }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={background3}
                            alt='Upload Thumbnail'
                            style={{
                              width: "50px",
                              height: "50px",
                              marginBottom: "10px",
                            }}
                          />
                          <Typography variant='body2' sx={{ color: "#888" }}>
                            Upload file from computer
                          </Typography>
                        </div>
                      </label>
                      <input
                        id='file-input'
                        type='file'
                        accept='image/*'
                        className='file-input'
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </>
                  )}
                </div>
                <Typography
                  variant='body1'
                  sx={{ color: "#CAC4D0", marginBottom: "10px" }}
                >
                  Members
                </Typography>
                <TextField
                  placeholder='Search Name'
                  value={searchQuery3}
                  onChange={(e) => setSearchQuery3(e.target.value)}
                  variant='outlined'
                  size='small'
                  sx={{
                    borderRadius: "40px",
                    input: { color: "white" },
                    width: "250px",
                    border: "0.905px solid #88938F",
                    "& fieldset": { border: "none" },
                    "&:hover": { backgroundColor: "#2E2F30" },
                    marginBottom: "20px",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Search sx={{ color: "#888" }} />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    "aria-label": "Search Members",
                  }}
                />
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    background: "#1E1E1E",
                    borderRadius: "10px",
                    padding: "10px",
                    border: "1px solid #333",
                  }}
                  role='listbox'
                  aria-label='Members List'
                >
                  {filteredUnassignedMembers.map((member) => (
                    <Box
                      key={member.email}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                        borderBottom: "1px solid #333",
                      }}
                    >
                      <Checkbox
                        checked={!!newTeamMembers[member.email]}
                        onChange={() =>
                          setNewTeamMembers((prev) => ({
                            ...prev,
                            [member.email]: !prev[member.email],
                          }))
                        }
                        sx={{ color: "#82D5C7" }}
                        inputProps={{
                          "aria-label": `Select ${member.name}`,
                        }}
                      />
                      <Typography sx={{ color: "#FFFFFF" }}>
                        {member.name}
                      </Typography>
                      <Typography variant='body2' sx={{ color: "#888" }}>
                        {member.email}
                      </Typography>
                    </Box>
                  ))}
                </div>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    marginTop: "20px",
                  }}
                >
                  <CustomButton
                    text='Cancel'
                    onClick={handleTeamModalClose}
                    sx={{
                      backgroundColor: "transparent",
                      border: "1px solid #B5EDE4",
                      color: "#B5EDE4",
                      borderRadius: "50px",
                      "&:hover": {
                        backgroundColor: "rgba(181, 237, 228, 0.08)",
                      },
                    }}
                    aria-label='Cancel'
                  />
                  <CustomButton
                    text='Confirm'
                    onClick={saveChangesCreateTeam}
                    sx={{
                      borderRadius: "50px",
                      "&:hover": {
                        backgroundColor: "#80ccbc",
                      },
                    }}
                    aria-label='Confirm'
                  />
                </Box>
              </div>
            </div>
          )}

          {/* Feedback Modal */}
          {feedbackModal.open && (
            <FeedbackModal
              type={feedbackModal.type}
              title={feedbackModal.title}
              description={feedbackModal.description}
              actions={[
                {
                  label: "Close",
                  onClick: () =>
                    setFeedbackModal({
                      open: false,
                      type: "",
                      title: "",
                      description: "",
                    }),
                  style: { backgroundColor: "#4caf50", color: "#fff" },
                },
              ]}
              aria-labelledby='feedback-modal-title'
              aria-describedby='feedback-modal-description'
            />
          )}

          {/* Create Memor Modal */}
          {isCreateMemorModalOpen && (
            <div
              className='modal-overlay-submit-memor'
              role='dialog'
              aria-modal='true'
            >
              <div
                className='modal-container'
                style={{ padding: "20px", maxWidth: "600px" }}
                tabIndex={-1}
              >
                <div className='modal-top' style={{ marginBottom: "20px" }}>
                  <Button
                    onClick={() => handleCreateMemorModalClose()}
                    sx={{ minWidth: 0, p: 0, color: "#BEC9C5" }}
                    aria-label='Close modal'
                  >
                    <ArrowBackIcon />
                  </Button>
                  <Typography
                    variant='h5'
                    sx={{ marginLeft: "10px", color: "#BEC9C5" }}
                  >
                    Admin Board
                  </Typography>
                </div>
                <Typography
                  variant='h5'
                  sx={{
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    marginBottom: "20px",
                  }}
                >
                  Memor Configuration
                </Typography>
                <TextField
                  label='Title'
                  variant='outlined'
                  value={newMemorTitle}
                  onChange={(e) => setNewMemorTitle(e.target.value)}
                  fullWidth
                  sx={{
                    marginBottom: "20px",
                    "& .MuiInputBase-input": { color: "#FFFFFF" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90948c" },
                      "&:hover fieldset": { borderColor: "#AAA" },
                      "&.Mui-focused fieldset": { borderColor: "#CCC" },
                    },
                    "& .MuiInputLabel-root": { color: "#888" },
                  }}
                />
                <TextField
                  type='date'
                  value={newMemorDate || ""}
                  onChange={(e) => setNewMemorDate(e.target.value)}
                  fullWidth
                  inputProps={{
                    min: getTodayDate(),
                    "aria-label": "Due Date",
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiInputBase-input": { color: "#FFFFFF" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90948c" },
                      "&:hover fieldset": { borderColor: "#AAA" },
                      "&.Mui-focused fieldset": { borderColor: "#CCC" },
                    },
                    "&hover": { backgroundColor: "#80ccbc" },
                    // Add these new styles for the calendar icon
                    "& .MuiSvgIcon-root": { color: "#FFFFFF" }, // This targets the calendar icon
                    "& .MuiInputAdornment-root": { color: "#FFFFFF" }, // This targets the container of the icon
                    // For older versions of Material UI, you might need this
                    "& input::-webkit-calendar-picker-indicator": {
                      filter: "invert(1)", // This will make the native calendar icon white
                    },
                  }}
                />
                <TextField
                  label='Description'
                  variant='outlined'
                  multiline
                  rows={4}
                  value={newMemorDescription}
                  onChange={(e) => setNewMemorDescription(e.target.value)}
                  fullWidth
                  sx={{
                    marginBottom: "20px",
                    "& .MuiInputBase-input": { color: "#FFFFFF" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90948c" },
                      "&:hover fieldset": { borderColor: "#AAA" },
                      "&.Mui-focused fieldset": { borderColor: "#CCC" },
                    },
                    "& .MuiInputLabel-root": { color: "#888" },
                  }}
                  inputProps={{
                    "aria-label": "memor description",
                  }}
                />
                <Typography variant='body1' sx={{ color: "#CAC4D0" }}>
                  Points
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    marginBottom: "20px",
                    justifyContent: "space-between",
                  }}
                >
                  {[5, 10, 20, 30, 50, 100].map((point) => (
                    <Button
                      key={point}
                      onClick={() => setNewMemorPoints(point)}
                      sx={{
                        backgroundColor:
                          newMemorPoints === point ? "#283434" : "#181c1c",
                        color: "#82D5C7",
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 0,
                        "&:hover": { backgroundColor: "#1f2c29" },
                      }}
                    >
                      {point}
                    </Button>
                  ))}
                </Box>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <CustomButton
                    text='Cancel'
                    onClick={() => handleCreateMemorModalClose()}
                    sx={{
                      backgroundColor: "transparent",
                      border: "1px solid #B5EDE4",
                      color: "#B5EDE4",
                      borderRadius: "50px",
                      "&:hover": {
                        backgroundColor: "rgba(181, 237, 228, 0.08)",
                      },
                    }}
                  />
                  <CustomButton
                    text='Submit'
                    onClick={handleCreateMemor}
                    sx={{
                      borderRadius: "50px",
                      "&:hover": { backgroundColor: "#80ccbc" },
                    }}
                  />
                </Box>
              </div>
            </div>
          )}

          {/* Confirmation Modal for Deleting Memor */}
          {deleteMemorModalOpen && (
            <ConfirmationModal
              open={deleteMemorModalOpen}
              onClose={cancelDeleteMemor}
              onConfirm={confirmDeleteMemor}
              action='delete'
              context='memor'
              itemName={memorToDelete?.title}
            />
          )}

          {/* Edit Memor Modal */}
          {isEditMemorModalOpen && (
            <div
              className='modal-overlay-submit-memor'
              role='dialog'
              aria-modal='true'
              aria-labelledby='edit-memor-modal-title'
              aria-describedby='edit-memor-modal-description'
            >
              <div
                className='modal-container'
                style={{ padding: "20px", maxWidth: "600px" }}
                tabIndex={-1}
              >
                <div className='modal-top' style={{ marginBottom: "20px" }}>
                  <Button
                    onClick={() => handleEditMemorModalClose()}
                    sx={{ minWidth: 0, p: 0, color: "#BEC9C5" }}
                  >
                    <ArrowBackIcon />
                  </Button>
                  <Typography
                    variant='h6'
                    sx={{ marginLeft: "10px", color: "#BEC9C5" }}
                  >
                    Admin Board
                  </Typography>
                </div>
                <Typography
                  variant='h5'
                  sx={{
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    marginBottom: "20px",
                  }}
                >
                  Edit Memor
                </Typography>
                <TextField
                  label='Title'
                  variant='outlined'
                  value={newMemorTitle}
                  onChange={(e) => setNewMemorTitle(e.target.value)}
                  fullWidth
                  sx={{
                    marginBottom: "20px",
                    "& .MuiInputBase-input": { color: "#FFFFFF" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90948c" },
                      "&:hover fieldset": { borderColor: "#AAA" },
                      "&.Mui-focused fieldset": { borderColor: "#CCC" },
                    },
                    "& .MuiInputLabel-root": { color: "#888" },
                  }}
                />
                <Typography variant='body1' sx={{ color: "#CAC4D0" }}>
                  Due Date
                </Typography>
                <TextField
                  type='date'
                  value={newMemorDate || ""}
                  onChange={(e) => setNewMemorDate(e.target.value)}
                  fullWidth
                  inputProps={{
                    min: getTodayDate(),
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiInputBase-input": { color: "#FFFFFF" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90948c" },
                      "&:hover fieldset": { borderColor: "#AAA" },
                      "&.Mui-focused fieldset": { borderColor: "#CCC" },
                    },
                    "&hover": { backgroundColor: "#80ccbc" },
                  }}
                />
                <TextField
                  label='Description'
                  variant='outlined'
                  multiline
                  rows={4}
                  value={newMemorDescription}
                  onChange={(e) => setNewMemorDescription(e.target.value)}
                  fullWidth
                  sx={{
                    marginBottom: "20px",
                    "& .MuiInputBase-input": { color: "#FFFFFF" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90948c" },
                      "&:hover fieldset": { borderColor: "#AAA" },
                      "&.Mui-focused fieldset": { borderColor: "#CCC" },
                    },
                    "& .MuiInputLabel-root": { color: "#888" },
                  }}
                />
                <Typography variant='body1' sx={{ color: "#CAC4D0" }}>
                  Points
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    marginBottom: "20px",
                    justifyContent: "space-between",
                  }}
                >
                  {[5, 10, 20, 30, 50, 100].map((point) => (
                    <Button
                      key={point}
                      onClick={() => setNewMemorPoints(point)}
                      sx={{
                        backgroundColor:
                          newMemorPoints === point ? "#283434" : "#181c1c",
                        color: "#82D5C7",
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 0,
                        "&:hover": { backgroundColor: "#1f2c29" },
                      }}
                    >
                      {point}
                    </Button>
                  ))}
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <CustomButton
                    text='Cancel'
                    onClick={() => handleEditMemorModalClose()}
                    sx={{
                      backgroundColor: "transparent",
                      border: "1px solid #B5EDE4",
                      color: "#B5EDE4",
                      borderRadius: "50px",
                      "&:hover": {
                        backgroundColor: "rgba(181, 237, 228, 0.08)",
                      },
                    }}
                  />
                  <CustomButton
                    text='Submit'
                    onClick={() => handleEditMemor()}
                    sx={{
                      borderRadius: "50px",
                      "&:hover": { backgroundColor: "#80ccbc" },
                    }}
                  />
                </Box>
              </div>
            </div>
          )}

          {/* New Confirmation Modal for Editing Memor */}
          {confirmEditMemorModalOpen && (
            <ConfirmationModal
              open={confirmEditMemorModalOpen}
              onClose={() => setConfirmEditMemorModalOpen(false)}
              onConfirm={confirmEditMemor}
              action='edit'
              context='memor'
              itemName={memorToEdit?.title}
            />
          )}

          {/* Edit Competition Modal */}
          {isEditCompetitionModalOpen && (
            <div
              className='modal-overlay-submit-memor'
              role='dialog'
              aria-modal='true'
              aria-labelledby='edit-competition-modal-title'
              aria-describedby='edit-competition-modal-description'
            >
              <div
                className='modal-container'
                style={{ padding: "20px", maxWidth: "600px" }}
                tabIndex={-1}
              >
                <div className='modal-top' style={{ marginBottom: "20px" }}>
                  <Button
                    onClick={() => handleEditCompetitionModalClose()}
                    sx={{ minWidth: 0, p: 0, color: "#BEC9C5" }}
                  >
                    <ArrowBackIcon />
                  </Button>
                  <Typography
                    variant='h6'
                    sx={{ marginLeft: "10px", color: "#BEC9C5" }}
                  >
                    Admin Board
                  </Typography>
                </div>
                <Typography
                  variant='h5'
                  sx={{
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    marginBottom: "20px",
                  }}
                >
                  Edit Competition
                </Typography>
                <Typography variant='body1' sx={{ color: "#CAC4D0" }}>
                  Title
                </Typography>
                <TextField
                  label='Title'
                  variant='outlined'
                  value={newCompetitionTitle}
                  onChange={(e) => setNewCompetitionTitle(e.target.value)}
                  fullWidth
                  sx={{
                    marginBottom: "20px",
                    "& .MuiInputBase-input": { color: "#FFFFFF" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90948c" },
                      "&:hover fieldset": { borderColor: "#AAA" },
                      "&.Mui-focused fieldset": { borderColor: "#CCC" },
                    },
                    "& .MuiInputLabel-root": { color: "#888" },
                  }}
                />

                <Typography variant='body1' sx={{ color: "#CAC4D0" }}>
                  End Date
                </Typography>
                <TextField
                  type='text'
                  value={newCompetitionEndDate || ""}
                  onChange={(e) => setNewCompetitionEndDate(e.target.value)}
                  fullWidth
                  inputProps={{
                    min: newCompetitionStartDate,
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiInputBase-input": { color: "#FFFFFF" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90948c" },
                      "&:hover fieldset": { borderColor: "#AAA" },
                      "&.Mui-focused fieldset": { borderColor: "#CCC" },
                    },
                    "&hover": { backgroundColor: "#80ccbc" },
                  }}
                />
                <TextField
                  label='Description'
                  variant='outlined'
                  multiline
                  rows={4}
                  value={newCompetitionDescription}
                  onChange={(e) => setNewCompetitionDescription(e.target.value)}
                  fullWidth
                  sx={{
                    marginBottom: "20px",
                    "& .MuiInputBase-input": { color: "#FFFFFF" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90948c" },
                      "&:hover fieldset": { borderColor: "#AAA" },
                      "&.Mui-focused fieldset": { borderColor: "#CCC" },
                    },
                    "& .MuiInputLabel-root": { color: "#888" },
                  }}
                />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <CustomButton
                    text='Cancel'
                    onClick={() => handleEditCompetitionModalClose()}
                    sx={{
                      backgroundColor: "transparent",
                      border: "1px solid #B5EDE4",
                      color: "#B5EDE4",
                      borderRadius: "50px",
                      "&:hover": {
                        backgroundColor: "rgba(181, 237, 228, 0.08)",
                      },
                    }}
                  />
                  <CustomButton
                    text='Submit'
                    onClick={() => handleEditCompetition()}
                    sx={{
                      borderRadius: "50px",
                      "&:hover": { backgroundColor: "#80ccbc" },
                    }}
                  />
                </Box>
              </div>
            </div>
          )}

          {confirmEditCompetitionModalOpen && (
            <ConfirmationModal
              open={confirmEditCompetitionModalOpen}
              onClose={() => setConfirmEditCompetitionModalOpen(false)}
              onConfirm={confirmEditCompetition}
              action='edit'
              context='competition'
              itemName={newCompetitionTitle}
            />
          )}
        </Box>
      </div>
    </>
  );
};

export default AdminBoard;
