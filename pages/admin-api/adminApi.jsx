import React from 'react';
import './style.css';
import { Grid, Box, Typography } from "@mui/material";
import rightIcon from "../../assets/right-arrow.svg";


function APIS(props) {
  // const {translate,history} = props;
  const API_DATA = [
    {
      name: "RIB",
      description: "Extraction of information on a RIB code",
      includeInPlan: true,
    },
    {
      name: "ID Card",
      description: "Extraction of information on a ID Card",
      includeInPlan: false,
    },
    {
      name: "TaxSlip",
      description: "Extraction of informations on a Tax declaration",
      includeInPlan: false,
    },
    {
      name: "PaySlip",
      description: "Extraction of informations on a payslip",
      includeInPlan: false,
    },
    {
      name: "Sirene",
      description: "Extraction of informations on a Sirene documents",
      includeInPlan: false,
    },
    {
      name: "Death certificate",
      description:
        "Extraction, verification and authentification from a death certificate",
      includeInPlan: true,
    },
    {
      name: "Diver licence",
      description: "Extraction and authentification from a driver license",
      includeInPlan: false,
    },
    {
      name: "Registration card",
      description:
        "Extraction, verification and authentification from a vehicule registration card",
      includeInPlan: false,
    },
    {
      name: "Vital Card",
      description:
        "Extration, verification and authentification from a vital card",
      includeInPlan: false,
    },
    {
      name: "K-bis",
      description: "Extract information kbis",
      includeInPlan: false,
    },
    {
      name: "CVEC",
      description: "Extract of informations on a CVEC document",
      includeInPlan: false,
    },
  ];
  return (
    <Box >
      <Typography variant="h3" marginLeft={4}>APIS</Typography>
      <Grid  mt={5}
        container
        // gap={1}
      >
        {API_DATA &&
          API_DATA.map((api, index) => {
            return (
              <Grid item mt={2} xs={12} sm={12} md={4} xl={4} sx={{ p: 2 }} key={Math.random()}>
                <Box
                  className="api-tile"
                  sx={{
                    height: 150,
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography sx={{fontFamily:'Larken',fontSize:20}}>{api.name}</Typography>
                    <Typography sx={{fontFamily:'Larken',fontSize:20}}>{api.description}</Typography>
                  </Box>
                  <Typography>
                    <Box className="document-button">
                      <img src={rightIcon} alt="icon" height="10" width="20" />
                    </Box>
                  </Typography>
                </Box>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
}

export default APIS