import React, { useEffect, useState } from "react"
import PrimaryButton from "../../common/primary-button";
import rightIcon from "../../assets/right-arrow.svg";
import analysisGotIcon from "../../assets/analysis-got-icon.svg";
import {getEstimatedTime} from './utils'


const StepThree = ({ setStep, closeModal, ...props }) => {
  const { translate,cb,file } = props
console.log(props)
const [estimatedTime,setEstimatedTime] = useState(null)

useEffect(()=>{
  let time = getEstimatedTime(file[0].size);
  console.log(time)
  setEstimatedTime(time);
},[])


  return (
    <div className="analysis-got-blocked">
      <div className="analysis-got-header">
        {/*analysis-got Header */}
        <div className="analysis-header-container d-flex space-between br">
          {" "}
          <div className="d-flex align-center">
            <div className="ml-20">
              <div className="analysis-header-text">
                {translate?.t("analysis_started")}
              </div>
            </div>
          </div>
          <div className="analysis-eye-icon">
            <img src={analysisGotIcon} alt="analysiseye icon" />
          </div>
        </div>
      </div>
      <div className="analysis-got-report">
        <div className="analysis-got-text">
          <div className="analysis-got-heading">
            {translate.t("email_sent_analysis_completed")}
          </div>
          <div className="analysis-got-sub-heading">
            {translate.t(
              "the_information_in_the_file_will_be_available_for_consultation_once_the_analysis_is_complete"
            )}
          </div>
        </div>
        <div className="analysis-estimated-time">
          {translate.t("analysis_time_estimate")} :{" "}
          {`${estimatedTime?.mins}
          ${translate.t("minutes")} ${estimatedTime?.sec}
          ${translate.t("seconds")}`}
        </div>
        <div className="analysis-got-btn">
          <PrimaryButton
            style={{ marginTop: "100px" }}
            endIcon={rightIcon}
            onClick={() => {
              closeModal(false);
              cb();
            }}
          >
            {translate.t("its_understood")}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default StepThree