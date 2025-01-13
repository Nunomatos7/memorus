import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "./App";
import "swiper/css";

const theme = createTheme({
  typography: {
    fontFamily: "Exo 2, sans-serif",
  },
});

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
