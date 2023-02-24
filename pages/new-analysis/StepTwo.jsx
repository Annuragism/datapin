import React from "react"
import rightIcon from "../../assets/right-arrow.svg";
import { Grid } from "@mui/material";
// Import Shared Component
import PrimaryButton from "../../common/primary-button";
import CheckIcon from "../../common/check-icon";

const MODEL_TYPE = [
  { type: "check", title: "check_validity_document", text: "create_one_file_per_doc", },
  { type: "classify", title: "classify_and_rename_documents", text: "create_one_file_per_doc" },
  { type: "extract", title: "extract_doc_text", text: "extract_analysis_text" }
]

const StepTwo = ({ step, setStep, file, setFile, selectedAnalysis, setSelectedAnalysis, ...props }) => {
  const { translate } = props;
  return (
    <div className="step-two-content">
      <div className="step-two-text">
        <div className="step-two-text-heading">
          {translate.t("load_document_to_analyze")}
        </div>
        <div className="step-two-text-sub-heading">
          {translate.t("new_analysis_upload_text")}
        </div>
      </div>
      <Grid container >
        {MODEL_TYPE.map((elem, index) => (
          <Grid
            key={index}
            item xs={12}
            onClick={() => setSelectedAnalysis(elem.type)}>
            <div className={`analysis-card d-flex-center space-between ${selectedAnalysis === elem.type ? "analysis-card-active" : ""}`}  >
              <div style={{ width: "70%" }}>
                <div> {translate.t(elem.title)}</div>
                <p>{translate.t(elem.text)}</p>
              </div>
              {selectedAnalysis === elem.type &&
                <div className="analysis-check">
                  <CheckIcon />
                </div>
              }
            </div>
          </Grid>
        ))}
        <Grid item xs={12}>
          <PrimaryButton
            style={{ marginTop: "40px", color: "#FFF", height: "10px" }}
            endIcon={rightIcon}
            onClick={async () => {
              setStep(4);
            }}
          >
            {`${translate.t("run")} ${translate.t("analyse")}`}
          </PrimaryButton>
        </Grid>
      </Grid >
    </div >
  );
};

export default StepTwo