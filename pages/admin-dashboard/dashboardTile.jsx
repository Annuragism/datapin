import React from 'react'
import "./style.css";
//MUI IMPORTS
import { Grid, Box, Typography } from "@mui/material";
//Import Shared Component
import redDotIcon from "../../assets/red.svg";
import checkOutlineIcon from "../../assets/check-outline.svg";
import document from "../../assets/document.svg";
import search from "../../assets/search.svg";
import time from "../../assets/time.svg";
import PersonIcon from "@mui/icons-material/Person";

function DashbaordTile(props) {
  const { translate, history,data } = props;

    const DASHBOARD_TILE = [
      {
        key: 1,
        title: "error_to_correct",
        icon: search,
        value: data?.errors_documents ? data?.errors_documents : "--",
        path: null,
      },
      {
        key: 2,
        title: "document_analysis",
        icon: document,
        value: data?.all_documents_count ? data?.all_documents_count : "--",
        path: null,
      },
      {
        key: 3,
        title: "pieces_confirm",
        icon: checkOutlineIcon,
        value: data?.confirm_document_count
          ? data?.confirm_document_count
          : "--",
        path: null,
      },
      {
        key: 4,
        title: "user",
        icon: time,
        value: data?.all_user ? data?.all_user : "--",
        path: "user-list",
      },
    ];

  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 6 }}>
      {DASHBOARD_TILE.length > 0 &&
        DASHBOARD_TILE?.map((val, index) => {
          return (
            <Grid item xs={12} md={6} xl={3} key={index} sx={{ mt: 4 }}>
              <Box
                className="tile-container "
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  val?.path && history?.navigate(val?.path);
                }}
              >
                <Box className="tile-img">
                  {index === 3 ? (
                      <PersonIcon/>
                  ) : (
                    <img src={val?.icon} alt="document" />
                  )}
                </Box>
                <Box className="tile-content">
                  {index === 0 && (
                    <Typography component="span" className="tile-dot-icon">
                      <img src={redDotIcon} alt="icon" />
                    </Typography>
                  )}
                  <Typography sx={{ fontFamily: "Larken", fontSize: 28 }}>
                    {val?.value}
                  </Typography>
                  <Typography sx={{ fontFamily: "Larken", fontSize: 20 }}>
                    {translate?.t(val?.title)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          );
        })}
    </Grid>
  );
}

export default DashbaordTile