import React, { useEffect, useState } from "react";
import "./style.css";
//MUI Imports
import { Grid, Box, Typography } from "@mui/material";

//Icon Import
import copyIcon from "../../assets/copy.svg";
import rightIcon from "../../assets/right-arrow.svg";
import checkOutlineIcon from "../../assets/check-outline.svg";
import document from "../../assets/document.svg";
import search from "../../assets/search.svg";
import time from "../../assets/time.svg";

//Import Shared Component
import PrimaryButton from "../../common/primary-button/";
import Dailog from "../../common/dailog";
import { Loader } from "../../common/loader";
import Notification from "../../common/Notification";

// Component Import
import NewAnalysis from "../new-analysis";
import AnalysisTable from "./AnalysisTable"
// Services
import { getAllAnalysis } from "../../services/services";
//Admin Services
import {getAdminAnalysis} from "../../services/adminservices ";
//User Dashbaord
function UserDashboard(props) {
  const { socket } = props;
  //States
  const [open, setOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifyData, setNotifyData] = useState({
    open: false,
    msg: "",
    status:'',
  });
  const ROLE = localStorage.getItem("role");
  const DASHBOARD_TILE = [
    {
      title: "documents_analyzed",
      icon: document,
      value: dashboardData ? dashboardData?.allAnalysis : "--",
    },
    {
      title: "to_check",
      icon: search,
      value: dashboardData ? dashboardData?.verify : "--",
    },
    {
      title: "compliant_parts",
      icon: checkOutlineIcon,
      value: dashboardData ? dashboardData?.confirm : "--",
    },
    {
      title: "average_analysis_time",
      icon: time,
      value: dashboardData ? dashboardData?.averageTime : "--",
    },
  ];

  
  const getListOfAllanalaysis = async()=>{
    if (ROLE === "admin") {
      getAdminAnalysisData();
    } else {
      getDashboardAnalayisData();
    }
  }
    
    useEffect(() => {
      getListOfAllanalaysis();
    }, []);

  //Socket
  useEffect(() => {
    socket.on("anlysisComplete", (data) => {
      console.log(data);
  setNotifyData({ open: true, msg: data?.msg, status: data?.type });
getListOfAllanalaysis();
    });
  }, [socket]);
  //======================= |getAdminAnalysis |=================
  const getAdminAnalysisData = React.useCallback(
    async () => {
      let response = await getAdminAnalysis();
      setDashboardData(response?.data);
      setLoading(false);
    
  },[]) 
  //======================= |getDashboardAnalayisData |=================
  const getDashboardAnalayisData = async () => {
    let response = await getAllAnalysis();
    setDashboardData(response?.data);
    setLoading(false);
  };
  //======================= |setNotificationClose |=================

  const setNotificationClose = () => {
    setNotifyData({ ...notifyData, open: false });
  };

  return (
    <>
      <Box>
        {dashboardData?.analysis?.length === 0 ? (
          <EmptyDashboard {...props} open={open} setOpen={setOpen} />
        ) : (
          <Dashbaord
            {...props}
            tile={DASHBOARD_TILE}
            open={open}
            setOpen={setOpen}
            dashboardData={dashboardData}
            getAdminAnalysisData={getAdminAnalysisData}
          />
        )}
        <Dailog
          props={props}
          open={open}
          setOpen={setOpen}
          Component={NewAnalysis}
          cb={getListOfAllanalaysis}
        />
      </Box>
      <Loader loading={loading} />
      <Notification
        open={notifyData?.open}
        msg={notifyData?.msg}
        status={notifyData?.status}
        handleClose={setNotificationClose}
      />
    </>
  );
}

export default UserDashboard;

const EmptyDashboard = (props) => {
  const { translate, setOpen } = props;

  return (
    <div className="main">
      <div className="container">
        <div className="copy-img">
          <img src={copyIcon} alt={"icon-copy"} />
        </div>
        <div className="heading">
          {translate?.t("Welcome_to_your_document_analysis_center")}
        </div>
        <div className="sub-heading">
          {translate?.t("empty_dashbaord_subheading")}
        </div>
        <PrimaryButton
          style={{ marginTop: "50px" }}
          endIcon={rightIcon}
          onClick={() => {
            setOpen(true);
          }}
          id="add-analysis"
        >
          {translate?.t("begin")}
        </PrimaryButton>
      </div>
    </div>
  );
};

const Dashbaord = (props) => {
  const { translate, setOpen, tile, dashboardData, getAdminAnalysisData } =
    props;
  return (
    <div className="main-dashbaord">
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ display: { md: "flex" } }}
      >
        <Grid
          item
          sm={12}
          md={6}
          xl={6}
          justifyContent="center"
          alignItems={"center"}
        >
          <Typography className="d-title">
            Dashboard {translate?.t("Analysis")}
          </Typography>
          <Typography className="d-sub-title">
            {translate?.t("find_here_all_your_document_analyzes")}
          </Typography>
        </Grid>
        <Grid item sm={12} md={6} xl={6} justifyContent="end" display="flex">
          <PrimaryButton
            endIcon={rightIcon}
            onClick={() => {
              console.log(props);
              setOpen(true);
            }}
          >
            {translate?.t("new_analysis")}
          </PrimaryButton>
        </Grid>
      </Grid>
      <div className="dashboard-tile">
        <Grid
          container
          rowSpacing={{ xs: 6, sm: 6, md: 6 }}
          columnSpacing={{ xs: 1, sm: 2, md: 6 }}
        >
          {tile.length > 0 &&
            tile?.map((val, index) => {
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
                  </div>
                </Grid>
              );
            })}
        </Grid>
      </div>
      <AnalysisTable {...props} refreshTable={getAdminAnalysisData} />
    </div>
  );
};
