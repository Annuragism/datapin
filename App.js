import "./App.css";
import React, { useEffect, useState } from "react";
import Redirection from "./routes/route";
import "../src/i18n/i18n";
import middleware from "./middleware/axiosMiddleware";
import { socket } from "./services/socket.js";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { purple } from "@mui/material/colors";

// import io from "socket.io-client";

//For Translations
import { useTranslation } from "react-i18next";

function App() {
  //  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  !localStorage.getItem("theme") && localStorage.setItem("theme", "light");
  !localStorage.getItem("lng") && localStorage.setItem("lng", "fr");

  const createMUITheme = createTheme();

  createMUITheme.typography.h3 = {
    fontSize: "1.2rem",
    "@media (min-width:600px)": {
      fontSize: "1.5rem",
    },
    [theme.breakpoints?.up("md")]: {
      fontSize: "2rem",
    },
  };
  createMUITheme.components = {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "#ff0505",
        },
      },
    },
  };
  return (
    <div data-theme={theme}>
      <ThemeProvider theme={createMUITheme}>
        <Redirection
          translation={useTranslation}
          setTheme={setTheme}
          socket={socket}
        />
      </ThemeProvider>
    </div>
  );
}

export default App;
