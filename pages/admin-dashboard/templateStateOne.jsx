import React from "react";
import rightIcon from "../../assets/right-arrow.svg";
import { Grid, Box } from "@mui/material";
import "./style.css";
// Import Shared Component
import PrimaryButton from "../../common/primary-button";
import CheckIcon from "../../common/check-icon";

const MODEL_TYPE = [
  {
    type: "check",
    title: "check_validity_document",
    text: "create_one_file_per_doc",
  },
  {
    type: "classify",
    title: "classify_and_rename_documents",
    text: "create_one_file_per_doc",
  },
  { type: "extract", title: "extract_doc_text", text: "extract_analysis_text" },
];

const TemplateStateOne = ({ step, setStep, ...props }) => {
  const { translate, selectedTemplateType, setSelectedTemplateType,data } = props;

  return (
    <>
      <Box m={5}>
        <div className="step-two-text">
          <div className="step-two-text-heading">
            {translate?.t("template_one_heading")}
          </div>
          <div className="step-two-text-sub-heading">
            {translate?.t("template_one_subheading")}
          </div>
        </div>
        <Grid container>
          {MODEL_TYPE.map((elem, index) => (
            <Grid
              key={index}
              item
              xs={12}
              onClick={() => {
                if (selectedTemplateType.includes(elem.type)) {
                  let removeifExist = selectedTemplateType.filter(
                    (d) => d !== elem.type
                  );
                  setSelectedTemplateType(removeifExist);
                } else {
                  setSelectedTemplateType([...selectedTemplateType, elem.type]);
                }
              }}
            >
              <Box
                // className={`analysis-card`}
                sx={{
                  // height: 50,
                  borderRadius: 2,
                  p: 2,
                  // width: "80%",
                  border: "1px solid rgba(96, 95, 124, 0.1)",
                  mt: 2,
                  color: selectedTemplateType.includes(elem.type)
                    ? "#fff"
                    : "#605f7c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: selectedTemplateType.includes(elem.type)
                    ? "#8853cc"
                    : "",
                  cursor: "pointer",
                }}
              >
                <div style={{ width: "70%" }}>
                  <div> {translate.t(elem.title)}</div>
                  <p>{translate.t(elem.text)}</p>
                </div>
                {selectedTemplateType.includes(elem.type) && (
                  <div className="analysis-check">
                    <CheckIcon />
                  </div>
                )}
              </Box>
            </Grid>
          ))}
          <Grid item xs={12}>
            <PrimaryButton
              style={{ marginTop: "40px", color: "#FFF", height: "10px" }}
              endIcon={rightIcon}
              onClick={() => {
                setStep(2);
              }}
              disable={selectedTemplateType.length === 0 ? true : false}
            >
              {translate.t("next")}
            </PrimaryButton>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default TemplateStateOne;
