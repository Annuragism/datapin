import React, { useState, useEffect } from "react";
import "./style.css";
//MUI Imports
import Grid from "@mui/material/Grid";
import EntityAnalysisTable from "./entityAnalysisTable";

//Icon Import
import checkOutlineIcon from "../../assets/check-outline.svg";
import document from "../../assets/document.svg";
import search from "../../assets/search.svg";
import eyeIcon from "../../assets/eye.svg";
import greenDotIcon from "../../assets/green.svg";
import redDotIcon from "../../assets/red.svg";
import yellowDotIcon from "../../assets/yellow.svg";
//Import Shared Component
import { BackButtonRound } from "../../common/back-button-round";
import moment from "moment";
// Redux & Reducer Imports
// import { useSelector, useDispatch } from "react-redux";
// import { addAnalysis } from "../../reducers/analysisReducer";
import { useSearchParams } from "react-router-dom";
// Services
import { getAllEntitiesWithAnalysisid } from "../../services/services";

function Analysis(props) {
  //  PROPS
  const { translate, setOpen, history } = props;
  // const analysis = useSelector((state) => state?.analysis);
  let [searchParams, setSearchParams] = useSearchParams();
  const ANALYSIS_ID = searchParams.get("id");

  // STATES
  const [tabIndex, setTabindex] = useState(1);
  const [analysis, setanalysis] = useState({});
  const [selectedCase, setSelectedCase] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [caseData, setCasedata] = useState([]);
  const dashbaordTile = [
    {
      title: "non_compliant_files",
      icon: eyeIcon,
      value: analysis ? analysis?.not_confirm : "--",
      status: "not_confirm",
    },
    {
      title: "to_check",
      icon: search,
      value: analysis ? analysis?.verify : "--",
      status: "verify",
    },
    {
      title: "compliant_parts",
      icon: checkOutlineIcon,
      value: analysis ? analysis?.confirm : "--",
      status: "confirm",
    },
    {
      title: "analysis_time",
      icon: document,
      value: analysis?.analysisTime?analysis?.analysisTime:"--:--",
    },
  ];

  useEffect(() => {
getEntityList();

  }, []);

  const getEntityList = async()=>{
    let response = await getAllEntitiesWithAnalysisid(ANALYSIS_ID);
    if(response?.status === 200){
            let refinedEntityData = response?.data?.entityData?.map(
              (entity, index) => {
                return {
                  caseIndex: index + 1,
                  uuuid: entity?.uuuid,
                  name: `${entity.firstName} ${entity.lastName}`,
                  new: true,
                  no_of_docs: entity?.documentTypes?.length,
                  documents: entity?.documentTypes?.length,
                  type_of_documents: entity?.document?.map((v) => {
                    return { name: translate.t(v?.type), status: v?.status };
                  }),
                  status: entity?.status,
                  date: moment(entity.createdAt).format("DD-MM-YYYY"),
                  id: entity?._id,
                };
              }
            );
            setCasedata(refinedEntityData);
            setanalysis(response?.data);
    }
  }

  // Function Block Start

  // handelSelectAllCheckBox
  const handelSelectAllCheckBox = (checked) => {
    if (checked === true) setSelectedCase(caseData);
    else setSelectedCase([]);
  };

  // Function Block End

  // Render
  return (
    <div>
      <div className="dashboard-header"></div>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid
          item
          xs={12}
          md={12}
          xl={12}
          justifyContent="center"
          alignItems={"center"}
        >
          <div className="d-flex">
            <BackButtonRound
              onClick={() => {
                history?.navigate("user-dashboard");
              }}
            />
            <div className="d-title" style={{ marginLeft: "1rem" }}>
              {translate?.t("Analysis")} : {analysis?.analysisData?.name}
            </div>
          </div>
          <div className="d-sub-title">
            {/* {translate?.t("find_here_all_your_document_analyzes")} */}
            {analysis && analysis?.analysisData?.numberOfDocuments}{" "}
            {translate?.t("identified_documents")}
          </div>
        </Grid>
        <Grid item xs={6} md={6} xl={6} justifyContent="end" display="flex">
          {/* <PrimaryButton
            style={{ margin: "0px" }}
            endIcon={rightIcon}
            onClick={() => {
              // console.log(props);
              setOpen(true);
            }}
          >
            {translate?.t("export")}
          </PrimaryButton> */}
        </Grid>
      </Grid>
      <div className="dashboard-tile">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 6 }}>
          {dashbaordTile?.length > 0 &&
            dashbaordTile?.map((val, index) => {
              return (
                <Grid item xs={12} md={6} xl={3} key={index}>
                  <div className="tile-container d-flex align-center ">
                    <div className="tile-img">
                      <img src={val?.icon} alt="document" />
                    </div>
                    <div className="tile-content">
                      <div className="dash">{val?.value}</div>
                      <div>{translate?.t(val?.title)}</div>
                    </div>
                    {val?.status && (
                      <div className="tile-dot-icon">
                        <img
                          src={
                            val?.status === "confirm"
                              ? greenDotIcon
                              : val?.status === "not_confirm"
                              ? redDotIcon
                              : val?.status === "verify"
                              ? yellowDotIcon
                              : null
                          }
                          alt="icon"
                        />
                      </div>
                    )}
                  </div>
                </Grid>
              );
            })}
        </Grid>
      </div>
      <EntityAnalysisTable
        {...props}
        tabIndex={tabIndex}
        setTabindex={setTabindex}
        analysis={analysis}
        selectedCase={selectedCase}
        setSelectedCase={setSelectedCase}
        caseData={caseData}
        setCasedata={setCasedata}
        handelSelectAllCheckBox={handelSelectAllCheckBox}
        selectedAnalysis={selectedAnalysis}
        setSelectedAnalysis={setSelectedAnalysis}
        refreshData={getEntityList}
      />
    </div>
  );
}

export default Analysis;

