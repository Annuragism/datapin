/* eslint-disable */
import React, { useEffect, useState } from "react";
import "./style.css";
import { useParams, useSearchParams } from "react-router-dom";
//MUI Imports
import { Grid, Typography, Box,Popover } from "@mui/material";
import { YesButton, NoButton } from "../../common/validation-button/";

//Icon Import
import rightIcon from "../../assets/right-arrow.svg";
import deleteIcon from "../../assets/delete-icon.svg";

//Import Shared Component
import BackButton from "../../common/back-button";
import { BackButtonRound } from "../../common/back-button-round";
import PrimaryButton from "../../common/primary-button/";
import StatusIcon from "../../common/status-icon/";
import { AnalysisLoader } from "../../common/loader";
import Notification from "../../common/Notification";
// eslint-disable-next-line
import DocumentsViewer from "../../components/documents-viewer";
// Redux Imports
import { useSelector, useDispatch } from "react-redux";
import { addSelectedAnalysis } from "../../reducers/analysisReducer";
// Services
import {
  fetchDocumentByEntityId,
  fetchFileDataByEntityId,
} from "../../services/services";
import { deleteDocument } from "../../services/adminservices ";
const USER_ROLE = localStorage.getItem("role")?.toLowerCase();


function DetailedAnalysis(props) {
  const { history } = props;
  // const { id } = useParams();
  // const id = "63a58111f20ee226c5e3b943";
  let [searchParams, setSearchParams] = useSearchParams();
  // const id = history?.location?.pathname?.split('/').pop();
  const id = searchParams.get("id");
  // const id = history?.location?.state?.docId;
  // States
  const [document, setDocumnet] = useState([]);
  const [entity, setEntity] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [draw, setDraw] = useState(false);


  useEffect(() => {
    getRequestsData();
  }, []);

  const getRequestsData = async () => {
    let getDoc = await fetchDocumentByEntityId(id);
    setDocumnet(getDoc?.data?.documentdata);
    setEntity(getDoc?.data?.entityData);
    let getfileWithEntityId = await fetchFileDataByEntityId(id);
    setFileData(getfileWithEntityId?.data);
  };

  try {
    return (
      <div className="">
        <PageHeader {...props} entity={entity} docLength={document?.length} />
        <div className="detailed-analysis d-flex">
          <div className="pdf-viewer w-60">
            <DocumentsViewer
              data={fileData}
              draw={draw}
              cb={() => {
                getRequestsData();
              }}
            />
          </div>
          <div className="document-content w-40">
            <DocumentContainer
              {...props}
              doc={document}
              setDoc={setDocumnet}
              entity={entity}
              cb={() => {
                getRequestsData();
              }}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <ErrorHandler error={error} />;
  }
}

export default DetailedAnalysis;

const DocumentContainer = (props) => {
  const { history, translate, doc, entity,cb } = props;
  const [deletePopup, setDeletePopup] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [notifyData, setNotifyData] = useState({
    open: false,
    msg: "",
  });
  const { analysis } = useSelector((state) => state?.analysis);
  const dispatch = useDispatch();

  const handelDeleteDocument = async (value) => {
    let deleteResponse = await deleteDocument(value._id);
    console.log(deleteResponse);
    if (deleteResponse?.status === 200) {
      setNotifyData({ open: true, msg: deleteResponse?.message });
      setAnchorEl(null);
      setDeletePopup(false)
      cb();
      setTimeout(()=>{
        setDraw(true);
      },500)
    }
  };

  const setNotificationClose = () => {
    setNotifyData({ ...notifyData, open: false });
  };
  try {
    return (
      <>
        <Grid xs={12} xl={6}>
          <div className="document-container-header">
            <Typography sx={{ fontFamily: "Larken", fontSize: 20 }}>
              {entity?.firstName}, {entity?.lastName}
            </Typography>
            <Typography sx={{ fontFamily: "Larken", fontSize: 18 }}>
              {doc?.length !== 0 ? doc?.length : null}{" "}
              {translate?.t("pieces_legales")} {translate?.t("identified")}
            </Typography>
          </div>

          <Popover
            id={"simple-popover"}
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={() => {
              setAnchorEl(null);
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            sx={{
              borderRadius: 15,
            }}
          >
            <Box
              p={2}
              sx={{
                color: "#000",
                // background: "rgba(255, 188, 30, 0.48)",
                borderRadius: 5,
              }}
            >
              <Typography>
                Are you sure want to delete{" "}
                {translate?.t(selectedDocument?.type)} ?
              </Typography>
              <Grid mt={2} display="flex" justifyContent="space-evenly">
                <Box>
                  <YesButton
                    text={translate?.t("yes")}
                    onClick={() => {
                       handelDeleteDocument(selectedDocument);
                    }}
                  />
                </Box>
                <Box>
                  {" "}
                  <NoButton
                    text={translate?.t("no")}
                    onClick={() => {
                      setAnchorEl(null);
                    }}
                  />
                </Box>
              </Grid>
            </Box>
          </Popover>

          <div className="document-analysis">
            {doc?.length > 0 ? (
              doc?.map((val, index) => {
                return (
                  <div className="document-tile" key={index}>
                    <Grid
                      style={{ padding: "5%" }}
                      container
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid
                        item
                        xs={6}
                        md={6}
                        xl={8}
                        justifyContent="center"
                        alignItems={"center"}
                      >
                        <div className="doc-name capitalize">
                          {translate?.t(val?.type)}
                        </div>
                        <div className="doc-status">
                          <StatusIcon
                            status={val?.status}
                            text={translate?.t(val?.status)}
                          />
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        md={6}
                        xl={4}
                        display="flex"
                        justifyContent="center"
                        alignItems={"center"}
                      >
                        <BackButton
                          color="light"
                          onClick={() => {
                            dispatch(addSelectedAnalysis(val));
                            history?.navigate(
                              `analysis-verification?id=${val?._id}`
                            );
                            //  history?.navigate("analysis-verification", {
                            //    state: { docId: val?._id },
                            //  });
                          }}
                        />
                        {USER_ROLE === "admin" && (
                          <div
                            className="delete-icon"
                            style={{ marginLeft: 15 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setAnchorEl(e.currentTarget);

                              setDeletePopup(true);
                              setSelectedDocument(val);
                            }}
                          >
                            <img
                              src={deleteIcon}
                              alt="delete-icon"
                              title="delete"
                            />
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  </div>
                );
              })
            ) : (
              <Typography sx={{ color: "#000" }} align="center">
                {translate?.t("no_data")}
              </Typography>
            )}
          </div>
        </Grid>
        {/* Notifications */}
        <Notification
          open={notifyData?.open}
          msg={notifyData?.msg}
          handleClose={setNotificationClose}
        />
        ;
      </>
    );
  } catch (error) {
    return <ErrorHandler error={error} />;
  }
};

const PageHeader = (props) => {
  const { history, translate, entity, docLength } = props;
  try {
    return (
      <div className="detailed-verification-analysis-header">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid
            item
            xs={12}
            md={12}
            xl={12}
            justifyContent="center"
            alignItems={"center"}
          >
            <div className="d-flex ">
              <BackButtonRound
                onClick={() => {
                  // history.navigate("detailed-analysis");
                  history?.navigate(`/analysis?id=${entity?.analysisId}`);
                }}
              />
              <div className="da-title" style={{ marginLeft: "1rem" }}>
                {translate?.t("Analysis")}: {entity?.firstName},{" "}
                {entity?.lastName}
              </div>
            </div>
            <div className="d-sub-title ml-20">
              {/* {translate?.t("find_here_all_your_document_analyzes")} */}
              <span>
                {docLength} {translate?.t("documents")}
              </span>
            </div>
          </Grid>
          <Grid item xs={6} md={6} xl={6} justifyContent="end" display="flex">
            {/* <PrimaryButton
            style={{ margin: "0px" }}
            endIcon={rightIcon}
            onClick={() => {}}
          >
            {translate?.t("export")}
          </PrimaryButton> */}
          </Grid>
        </Grid>
      </div>
    );
  } catch (error) {
    return <ErrorHandler error={error} />;
  }
};

function ErrorHandler({ error }) {
  return (
    <div role="alert" style={{color:'#000'}}>
      <p>An error occurred:</p>
      <pre>{error.message}</pre>
    </div>
  );
}


  {/* {deletePopup === true && ( */}
         //   <Box p={2} sx={{ color: "#000" }}>
          //     <Box
          //       p={2}
          //       sx={{
          //         background: "rgba(255, 188, 30, 0.48)",
          //         borderRadius: 5,
          //       }}
          //     >
          //       <Typography>{translate?.t(selectedDocument?.type)}</Typography>
          //       <Typography>Are you sure want to Delete</Typography>
          //       <Grid mt={2} display="flex" justifyContent="space-evenly">
          //         <Box>
          //           <YesButton
          //             text={translate?.t("yes")}
          //             onClick={() => {
          //               handelDeleteDocument(selectedDocument);
          //             }}
          //           />
          //         </Box>
          //         <Box>
          //           {" "}
          //           <NoButton
          //             text={translate?.t("no")}
          //             onClick={(e) => {
          //               setAnchorEl(null);
          //               setDeletePopup(false);
          //               setSelectedDocument(null);
          //             }}
          //           />
          //         </Box>
          //       </Grid>
          //     </Box>
          //   </Box>
          // )}
