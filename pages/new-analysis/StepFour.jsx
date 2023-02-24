import React, { useEffect } from "react"
import AnalyseinProgressIcon from "../../assets/AnalyseinProgress.svg";
import {Loader} from "../../common/loader";
import { useNavigate } from "react-router-dom";

const StepFour = (props) => {
  const {translate}  = props
  console.log(props)
  return (
    <div className="single-analysis">
      <div div className="single-analysis-header">
        <div className=" d-flex-center space-between">
          <div>
            <h3>{translate?.t("analysis_in_progress")}</h3>
          </div>
          <div>
            <img src={AnalyseinProgressIcon} alt="analysis-icon" />
          </div>
        </div>
      </div>
      <div style={{ padding: 30 }}>
        <div className="single-analysis-text1">
          {translate?.t("document_processing")}...
        </div>
        <div className="d-flex analysis-single-card-container">
          <div className="d-flex-center analysis-single-card">
            <div className="mr-10">
              <Loader loading={true} size={20} />
            </div>
            <div>
              <div className="single-analysis-text2">
                {translate?.t("unbundling_the_document")}
              </div>
              <div className="single-analysis-text3">
                {/* 4 {translate?.t("types_of_documents_detected")} */}
              </div>
            </div>
          </div>
          <div className="d-flex-center analysis-single-card">
            <div className="mr-10">
              <Loader loading={true} size={20} />
            </div>
            <div>
              <div className="single-analysis-text2">
                {translate?.t("validity_check")}
              </div>
              <div className="single-analysis-text3">
                {/* 3 {translate?.t("compliant_documents")} */}
              </div>
            </div>
          </div>
          <div className="d-flex-center analysis-single-card">
            <div className="mr-10">
              <Loader loading={true} size={20} />
            </div>
            <div>
              <div className="single-analysis-text2">
                {translate?.t("information_extraction")}
              </div>
              <div className="single-analysis-text3">
                {/* 1 {translate?.t("non_compliant_documents")} */}
              </div>
            </div>
          </div>
        </div>
        <div className="analysis-loader-analysis"></div>
      </div>
    </div>
  );
}

export default StepFour