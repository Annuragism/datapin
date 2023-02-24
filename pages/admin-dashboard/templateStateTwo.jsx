import React, { useEffect,useState } from "react";
import rightIcon from "../../assets/right-arrow.svg";
import { Grid, Box } from "@mui/material";
import "./style.css";
// Import Shared Component
import PrimaryButton from "../../common/primary-button";
import CheckIcon from "../../common/check-icon";
import { getModelTypes } from "../../services/adminservices ";


const TemplateStateTwo = ({ step, setStep, ...props }) => {
  const { translate, selectedType, setSelectedType,data } = props;
  const [modelType,setModelType] = useState([])
  useEffect(() => {
      getModelTypesList();
  }, []);

  const getModelTypesList = async () => {
    if(data){
    setModelType(selectedType);
    }else{
      let response = await getModelTypes();
      console.log("response", response);
      setModelType(response.data?.model_type);
    }
    };
    console.log(modelType);
  return (
    <>
      <Box mt={5} className="step-two-content">
        <div className="step-two-text">
          <div className="step-two-text-heading">
            {translate?.t("select_type_of_doc_to_analyze")}
          </div>
        </div>
        <Grid container>
          {modelType?.map((elem, index) => (
            <Grid key={index} item xs={12}>
              <Box
                // className={`analysis-card d-flex-center space-between ${
                //   selectedAnalysis === elem.index ? "analysis-card-active" : ""
                // }`}
                sx={{
                  height: 50,
                  borderRadius: 2,
                  padding: 1,
                  width: "80%",
                  border: "1px solid rgba(96, 95, 124, 0.1)",
                  mt: 2,
                  color: selectedType?.includes(elem) ? "#fff" : "#605f7c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: selectedType?.includes(elem) ? "#8853cc" : "",
                  cursor: "pointer",
                }}
                onClick={() => {
                  console.log(selectedType);
                  if (selectedType.includes(elem)) {
                    let removeifExist = selectedType?.filter((d) => d !== elem);
                    console.log(removeifExist);
                    setSelectedType(removeifExist);
                  } else {
                    setSelectedType([...selectedType, elem]);
                  }
                }}
              >
                <div style={{ width: "70%" }}>
                  <div> {translate.t(elem)}</div>
                </div>
                {selectedType.includes(elem) && (
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
                setStep(3);
              }}
              disable={selectedType?.length === 0 ? true : false}
            >
              {translate.t("next")}
            </PrimaryButton>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default TemplateStateTwo;
