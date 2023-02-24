import React, { useEffect, useState } from "react";
import TemplateStateOne from "./templateStateOne";
import TemplateStateTwo from "./templateStateTwo";
import TemplateStateThree from "./templateStateThree";
import TemplateStateFour from "./templateStateFour";

import { Grid, Box, Typography } from "@mui/material";
import "./style.css";
// Import Shared Component
import leftArrowDark from "../../assets/left-arrow-dark.svg";
import analysisEyeIcon from "../../assets/analysis-eye.svg";
import Notification from "../../common/Notification";
//Admin Services
import {
  createAnalysisTemplate,
  updateAnalysisTemplate,
} from "../../services/adminservices ";

const NewTemplate = (props) => {
  const { translate, closeModal,data,cb } = props;
  const [step, setStep] = useState(1);
  const [selectedTemplateType, setSelectedTemplateType] = useState([]);
  const [controlsData, setcontrolsData] = useState(null);
  const [selectedType, setSelectedType] = useState([]);
  const [templateName, setTemplateName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accessTemplate, setAccessTemplate] = useState("all_the_user");
  const [notifyData, setNotifyData] = useState({ open: false, msg: "" });
  const USER_DETAILS = JSON.parse(localStorage.getItem('user'));

  useEffect(()=>{
            if (data) {
              setSelectedType(data?.documentSelection?.name);
              setSelectedTemplateType(data?.steps);
              setTemplateName(data?.name);

            } 
  },[])


  const createAnalysisTemplateWithData = async () => {

    setLoading(true);
    if(data){
          let payload = {
            steps: selectedTemplateType,
            template_name: templateName,
            controls: controlsData,
            groupId: USER_DETAILS?.groupId,
            userId: USER_DETAILS?._id,
            template_id : data._id
          };
    let response = await updateAnalysisTemplate(payload);
    if (response?.status === 200) {
      setTimeout(() => {
        setLoading(false);
        setNotifyData({ open: true, msg: response?.message });
        closeModal();
      }, 1000);
    }
    }else{
         let payload = {
            steps: selectedTemplateType,
            template_name: templateName,
            controls: controlsData,
            groupId: USER_DETAILS?.groupId,
            userId: USER_DETAILS?._id,
          };
          let response = await createAnalysisTemplate(payload);
          if (response?.status === 200) {
            setTimeout(() => {
              setLoading(false);
              setNotifyData({ open: true, msg: response?.message });
            }, 1000);
          }
    }

  };

  const setNotificationClose = () => {
    setNotifyData({ ...notifyData, open: false });
  };

  return (
    <>
      <Box>
        <Grid
          container
          sx={{
            background: " #f6f6ff",
            p: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Grid item xs={12} md={8} className="d-flex align-center">
            <div
              className="analysis-back-btn"
              onClick={() => {
                step === 1 ? closeModal() : setStep(step - 1);
              }}
            >
              <img src={leftArrowDark} alt="back icon" />
            </div>
            <div className="ml-20">
              <div className="analysis-header-text">
                {translate.t("new_analysis_template")}
              </div>
              <Typography
                sx={{
                  fontFamily: "Larken",
                  color: "#3a3868",
                  fontSize: 20,
                }}
              >{`${translate.t("step")} ${step}/4`}</Typography>
            </div>
          </Grid>
          <Grid
            item
            md={4}
            xs={0}
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
            }}
          >
            <img src={analysisEyeIcon} alt="analysiseye icon" />
          </Grid>
        </Grid>
        {step === 1 && (
          <TemplateStateOne
            {...props}
            step={step}
            setStep={setStep}
            selectedTemplateType={selectedTemplateType}
            setSelectedTemplateType={setSelectedTemplateType}
          />
        )}
        {step === 2 && (
          <TemplateStateTwo
            {...props}
            step={step}
            setStep={setStep}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        )}
        {step === 3 && (
          <TemplateStateThree
            {...props}
            step={step}
            setStep={setStep}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            controlsData={controlsData}
            setcontrolsData={setcontrolsData}
          />
        )}
        {step === 4 && (
          <TemplateStateFour
            {...props}
            step={step}
            setStep={setStep}
            templateName={templateName}
            setTemplateName={setTemplateName}
            accessTemplate={accessTemplate}
            setAccessTemplate={setAccessTemplate}
            loading={loading}
            setLoading={setLoading}
            createAnalysisTemplate={createAnalysisTemplateWithData}
          />
        )}
      </Box>
      <Notification
        open={notifyData?.open}
        msg={notifyData?.msg}
        handleClose={setNotificationClose}
      />
    </>
  );
};

export default NewTemplate;
