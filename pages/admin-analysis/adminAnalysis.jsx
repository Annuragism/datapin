import React,{useEffect} from 'react'
import './style.css';
//MUI IMPORTS
import { Grid, Box, Typography, Button } from "@mui/material";
//Import Shared Component
import PrimaryButton from "../../common/primary-button/";
import plusIcon from "../../assets/plus-grey.svg";
import rightIcon from "../../assets/right-arrow.svg";
//Services
import { getAdminAnalysis } from "../../services/adminservices ";

function AdminAnalysis(props) {
  const {translate} = props;
  return (
    <Box>
        <Grid container>
          <Grid
            item
            xs={6}
            md={6}
            xl={6}
            justifyContent="center"
            alignItems={"center"}
          >
            <Typography className="d-title">
             All Analysis
            </Typography>
            
          </Grid>
          <Grid item xs={6} md={6} xl={6} justifyContent="end" display="flex">
            {/* <PrimaryButton
              style={{ textTransform: "capitalize" }}
              startIcon={plusIcon}
              onClick={() => {
              }}
            >
              {translate?.t("new_template")}
            </PrimaryButton> */}
          </Grid>
        </Grid>
        

    </Box>
  );
}

export default AdminAnalysis