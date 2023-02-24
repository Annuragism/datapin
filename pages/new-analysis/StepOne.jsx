import React, { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
//MUI Imports
import { Grid, IconButton, Typography, TextField, Box } from "@mui/material";
//Icon Imports
import fileIcon from "../../assets/file.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import addPlusSmallIcon from "../../assets/add-plus-small.svg";
import leftArrowDark from "../../assets/left-arrow-dark.svg";
import analysisEyeIcon from "../../assets/analysis-eye.svg";
import rightIcon from "../../assets/right-arrow.svg";
//Shared Component
import PrimaryButton from "../../common/primary-button";
import ErrorModal from "./errorModal";

//Utils
import {
  baseStyle,
  focusedStyle,
  acceptStyle,
  rejectStyle,
  niceBytes,
  groupByFolder,
  // mergePDF,
  runAnalysisApiCall,
} from "./utils";

const StepOne = ({ step, setStep, file, setFile, closeModal, ...props }) => {
  const { translate } = props;
  const [errorModal, setErrorModal] = useState({ open: false, data: '' });
  const [errorLimit, setErrorLimit] = useState(false)
  const [analysisName, setAnalysisName] = useState('');
  const [loading, setLoading] = useState(false)

  const {
    getRootProps,
    getInputProps,
    fileRejections,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    accept: { "image/*": [], "application/pdf": [] },
    maxFiles: 10
  });

  useEffect(() => {
    if (acceptedFiles.length !== 0) {
      setFile([...file, ...groupByFolder(acceptedFiles)]);
      if (!analysisName) {
        setAnalysisName(file[0]?.name?.split(".")[0]);
      }
    }
    // eslint-disable-next-line
  }, [acceptedFiles]);

  useEffect(() => {
    if (fileRejections.length > 1) setErrorLimit(true)
    else setErrorLimit(false)
  }, [fileRejections])

  useEffect(() => {
    if (file) {
      if (!analysisName) {
        setAnalysisName(file[0]?.name?.split(".")[0]);
      }
    }
  }, [file]);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const handleDelete = (elem) => {
    const filter = file.filter((item) => item.name !== elem.name);
    setFile(filter);
  };

  const handelErrorModal = () => {
    setErrorModal(!errorModal.open);
  };

  const handelErr = (status, errorData) => {
    setErrorModal({ open: status, data: errorData });
  }

  const ErrorLimit = () => (
    <div className="error-limit-div">{`${translate.t('file_limit')}`}</div>
  )

  const File = () => (
    <div className="file-container">
      <div className="file-container-text1">{translate.t("add_file")}:</div>
      <div className="file">
        {file.length > 0 &&
          file.map((elem) => (
            <React.Fragment>
              <div
                key={elem.name}
                style={{ width: "90%" }}
                className="file-select block"
              >
                <div>
                  <img className="m-35" src={fileIcon} alt={"file Icon"} />
                </div>
                <div className="file-name">
                  <div className="file-container-text2">{elem.name}</div>
                  <div className="file-container-text3">
                    {`${elem.count} documents, ${niceBytes(elem.size)}`}{" "}
                  </div>
                </div>
                <div className="file-delete-button">
                  <IconButton
                    onClick={() => handleDelete(elem)}
                    aria-label="delete"
                    size="medium"
                    style={{ textAlign: "end" }}
                  >
                    <img src={deleteIcon} alt={"delete"} />
                  </IconButton>
                </div>
              </div>
            </React.Fragment>
          ))}
      </div>
      <Grid
        className="add-file block"
        style={{ width: "90%" }}
        {...getRootProps()}
      >
        <input {...getInputProps()} directory="" webkitdirectory="" />
        <p className="add-file-icon m-35">
          <img src={addPlusSmallIcon} alt={"file Icon"} />
        </p>
        <div className="file-container-text4">
          {/* <Typography>{translate.t("add_file")}</Typography> */}
          {translate.t("add_file")}
        </div>
      </Grid>
      <Grid
        className="3"
        display={"flex"}
        justifyContent="center"
        alignItems={"center"}
      >
        <PrimaryButton
          disable={(file ? false : true) || (loading)}
          style={{ marginTop: "50px", width: "250px" }}
          endIcon={rightIcon}
          loading={loading}
          onClick={async () => {
            setLoading(true)
            const { data } = await runAnalysisApiCall(file, analysisName);
            if (data?.job_status?.code === 403) {
              handelErr(true, data?.job_status);
            } else {
              setLoading(false)
              setStep(3);
            }
          }}
          id="run-analysis"
        >
          {translate.t("next")}
        </PrimaryButton>
      </Grid>
    </div>
  );

  const AddFile = () => {
    return (
      <>
        <div className="card-container d-flex space-evenly">
          <div {...getRootProps({ style })} id="analysis-file-container">
            <input {...getInputProps()} id="analysis-file-upload" />
            <Typography id="file-upload">
              {translate.t("click_to_add_files")}
            </Typography>
          </div>
        </div>
        <div className="3">
          <PrimaryButton
            style={{ marginTop: "40px", width: "250px" }}
            endIcon={rightIcon}
            disable={true}
            onClick={() => {
              setFile(true);
            }}
          >
            {translate.t("next")}
          </PrimaryButton>
        </div>
      </>
    );
  };

  return (
    <div>
      <Grid
        container
        p={2}
        // className="analysis-header-container"
      >
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            className="analysis-back-btn"
            onClick={() => {
              step === 2 ? setStep(1) : closeModal();
            }}
          >
            <img src={leftArrowDark} alt="back icon" />
          </Box>
          <Typography ml={4} className="analysis-header-text">
            {translate.t("new_analysis")}
          </Typography>
        </Grid>
        <Grid
          item
          md={4}
          xs={0}
          sm={0}
          sx={{ 
            display: { xs: "none", sm: "none", md: "flex" },
            justifyContent:'flex-end'
          }}
        >
          <img src={analysisEyeIcon} alt="analysiseye icon" />
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          p: { xs: 2, md: 4 },
          height: "calc(100vh - 30vh)",
          width: "calc(100vw - 30vw)",
          overflow: "auto",
        }}
      >
        <Grid item xs={12} className="">
          <div className="step-text-heading">
            <Typography>{translate.t("load_document_to_analyze")}</Typography>
          </div>
          <div className="step-text-sub-heading">
            <Typography>{translate.t("new_analysis_upload_text")}</Typography>
          </div>
          {errorLimit && <ErrorLimit />}
          <>
            <Grid
              container
              display={{ sm: "", md: "flex" }}
              justifyContent={"space-between"}
              alignItems="center"
              sx={{ marginTop: "2rem" }}
            >
              <Grid item sm={4}>
                <div>{`${translate.t("analysis_name")}`}</div>
              </Grid>
              <Grid item sm={8}>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder={`${translate.t("analysis_name")}`}
                  value={analysisName}
                  onChange={(e) => {
                    setAnalysisName(e.target.value);
                  }}
                  id="analyis-name"
                />
              </Grid>
            </Grid>
          </>
          {file.length > 0 ? File() : AddFile()}
        </Grid>
      </Grid>
      {errorModal?.open && (
        <ErrorModal
          {...props}
          open={errorModal?.open}
          handelErrorModal={handelErrorModal}
          data={errorModal?.data}
        />
      )}
    </div>
  );
};

export default StepOne;
