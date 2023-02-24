/* eslint-disable */
import React, { useState } from "react";
import "./style.css";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";

// Main Component New Analysis
function NewAnalysis(props) {
  console.log(props);
  const { closeModal } = props;
  const [step, setStep] = useState(1);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [file, setFile] = useState([]);

  return (
    <>
      <div className="analysis-container">
        <div className="step-main-container">
          {step === 1 && (
            <StepOne
              step={step}
              setStep={setStep}
              file={file}
              setFile={setFile}
              closeModal={closeModal}
              {...props}
            />
          )}
          {step === 2 && (
            <StepTwo
              step={step}
              setStep={setStep}
              file={file}
              setFile={setFile}
              selectedAnalysis={selectedAnalysis}
              setSelectedAnalysis={setSelectedAnalysis}
              {...props}
            />
          )}
          {step === 3 && (
            <StepThree
              step={step}
              setStep={setStep}
              file={file}
              setFile={setFile}
              selectedAnalysis={selectedAnalysis}
              setSelectedAnalysis={setSelectedAnalysis}
              {...props}
            />
          )}
          {step === 4 && <StepFour />}
        </div>
      </div>
    </>
  );
}

export default NewAnalysis;

