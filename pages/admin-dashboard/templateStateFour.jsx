import React, { useState } from "react";
import { Grid, Box, Typography, TextField } from "@mui/material";
import "./style.css";
// Import Shared Component
import PrimaryButton from "../../common/primary-button";
import rightIcon from "../../assets/right-arrow.svg";

const BUTTON_TYPE = [
  {
    index: 1,
    title: "all_the_user",
  },
  { index: 2, title: "choose" },
];

const TemplateStateFour = (props) => {
  const {
    translate,
    step,
    setStep,
    createAnalysisTemplate,
    templateName,
    setTemplateName,
    accessTemplate,
    setAccessTemplate,
    loading,
    setLoading,
  } = props;
  return (
    <>
      <Box m={2} p={4}>
        <Typography
          sx={{
            fontFamily: "Suisse Int",
            fontStyle: "normal",
            fontSize: 20,
            fontWeight: 450,
            color: "#3A3868",
          }}
        >
          {translate?.t("template_settings")}
        </Typography>
        <Box>
          <Typography
            sx={{
              fontFamily: "Suisse Int",
              fontStyle: "normal",
              fontSize: 16,
              fontWeight: 450,
              color: "#3A3868",
            }}
          >
            {translate?.t("template_name")}
          </Typography>
          <TextField
            placeholder="Analyse assurés pro"
            value={templateName}
            onChange={(e) => {
              if (e.target.value === "") {
                setTemplateName(null);
              } else {
                setTemplateName(e.target.value);
              }
            }}
          />
        </Box>
        <Box mt={4}>
          <Typography
            sx={{
              fontFamily: "Suisse Int",
              fontStyle: "normal",
              fontSize: 16,
              fontWeight: 450,
              color: "#3A3868",
            }}
          >
            {translate?.t("access_to_templates")}
          </Typography>
          <Grid display="flex" mt={4}>
            {BUTTON_TYPE?.map((b, i) => (
              <PrimaryButton
                style={{
                  background:
                    accessTemplate === b?.title
                      ? "#7872E2"
                      : "rgba(9, 6, 66, 0.2)",
                  marginRight: 25,
                }}
                text={translate?.t(b?.title)}
                onClick={() => {
                  console.log(b?.title);
                  setAccessTemplate(b?.title);
                }}
              />
            ))}
          </Grid>
        </Box>
      </Box>

      <PrimaryButton
        text={translate?.t("publish")}
        endIcon={rightIcon}
        onClick={() => {
          createAnalysisTemplate();
        }}
        disable={templateName == null || loading ? true : false}
        loading={loading}
      />
    </>
  );
};

export default TemplateStateFour;
