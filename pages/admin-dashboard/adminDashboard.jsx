import React, { useEffect, useState } from "react";
import "./style.css";
//MUI IMPORTS
import { Grid, Box, Typography, Button } from "@mui/material";
//Import Shared Component
import PrimaryButton from "../../common/primary-button/";
import plusIcon from "../../assets/plus-grey.svg";
import rightIcon from "../../assets/right-arrow.svg";
import copyIcon from "../../assets/copy-icon.svg";
import documentationIcon from "../../assets/analysis-eye.svg";
import AddUser from "../user/addUser";
import Notification from "../../common/Notification";

//Components
import DashbaordTile from "./dashboardTile";
import DataChart from "./chart";
import NewTemplate from "./newTemplate";
import Dailog from "../../common/dailog";

//Services
import {
  getAdminDashboardData,
  getActivePlan,
} from "../../services/adminservices ";
import FreeTrialPopUp from "../free-trial-pop-up/freeTrailEndPopUp";

function AdminDashboard(props) {
  const { translate, history, sidebarOption } = props;
  const [revealSecrectKey, setRevealSecretKey] = useState(false);
  const [secrectKey, setSecretKey] = useState("");
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openTemplates, setOpenTemplates] = useState(false);
  const [dashbaordKPI, setDashbaordKPI] = useState(null);
  const [activePlanData, setActivePlanData] = useState(null);
  const [notifyData, setNotifyData] = useState({ open: false, msg: "" });
  const [expiryPopup, setExpiryPopup] = useState(false);

  const USER_DETAILS = JSON.parse(JSON.stringify(localStorage.getItem('user')))
  const DOCUMENTATION_TYPE = [
    { index: 1, title: "upload_via_ftp" },
    { index: 2, title: "upload_via_api" },
    { index: 3, title: "anlysis_parameter" },
  ];

  useEffect(() => {
    getDahbaordData();
    getDetailsOfPlan();
  }, []);

  const getDahbaordData = async () => {
    let response = await getAdminDashboardData();
    setDashbaordKPI(response?.data);
  };

    const getDetailsOfPlan = async () => {
      let planResponse = await getActivePlan();
      if (planResponse?.data === null){
        sidebarOption?.setDisbleOptions(true);
         history?.navigate("mangement-settings?t=3");
      }
      setActivePlanData(planResponse?.data);
      setExpiryPopup(planResponse?.data?.expired ? true : false);
    setSecretKey(planResponse?.data?.groupId?.secretKey);

    };

  const setNotificationClose = () => {
    setNotifyData({ ...notifyData, open: false });
  };

  return (
    <>
      {activePlanData?.isFree && activePlanData?.expired && (
        <FreeTrialPopUp
          {...props}
          view={expiryPopup}
          setView={setExpiryPopup}
        />
      )}

      <Box className="admin-dahboard-container">
        <Grid container>
          <Grid
            item
            xs={6}
            md={6}
            xl={6}
            justifyContent="center"
            alignItems={"center"}
          >
            <Typography className="d-title">
              {translate?.t("welcome")}
              {}
            </Typography>
            <Typography className="d-sub-title">
              {translate?.t("admin_dashbaord_subheading")}
            </Typography>
          </Grid>
          <Grid item xs={6} md={6} xl={6} justifyContent="end" display="flex">
            <PrimaryButton
              style={{ textTransform: "capitalize" }}
              startIcon={plusIcon}
              onClick={() => {
                setOpenTemplates(true);
              }}
            >
              {translate?.t("new_template")}
            </PrimaryButton>
          </Grid>
        </Grid>
        <Grid>
          <DashbaordTile {...props} data={dashbaordKPI} />
        </Grid>
        <Box mt={4}>
          <Grid
            container
            columnSpacing={{ xs: 6, md: 2, xl: 5 }}
            columns={{ xs: 3, sm: 3, md: 12 }}
            item
          >
            <Grid item xs={12} md={6} xl={12} sx={{ mt: 5 }}>
              <Grid
                item
                sx={{
                  backgroundColor: "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  p: 6,
                }}
                className="template-card"
                onClick={() => {
                  setOpenTemplates(true);
                }}
              >
                <Box>
                  <Typography className="template-card-title">
                    {translate?.t("create_analysis")}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 3,
                    }}
                    className="template-card-subheading"
                  >
                    {translate?.t("choose_analysis")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    color: "#000",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src={plusIcon} alt="add" height="25" width="25px" />
                </Box>
              </Grid>
              <Grid
                item
                sx={{
                  backgroundColor: "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  p: 6,
                  mt: 4,
                }}
                className="template-card"
                onClick={() => setOpenAddUser(true)}
              >
                <Box>
                  <Typography className="template-card-title">
                    {translate?.t("add_user")}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 3,
                    }}
                    className="template-card-subheading"
                  >
                    {translate?.t("user_access_text")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    color: "#000",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src={plusIcon} alt="add" height="25" width="25px" />
                </Box>
              </Grid>
              <Grid
                className="template-card-status"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  p: 5,
                  mt: 5,
                }}
              >
                <Typography sx={{ fontFamily: "Larken", fontSize: 25 }}>
                  {translate?.t("service_status")}
                </Typography>
                <Box mt={3}>
                  <Typography> {translate?.t("subscription")}</Typography>
                  <Typography>
                    {activePlanData?.isFree
                      ? `Free`
                      : `${activePlanData?.plan?.name}(${activePlanData?.plan?.price?.unit_amount}${activePlanData?.plan?.price?.currency})`}
                    <Typography
                      component="span"
                      style={{ textDecoration: "underline", marginLeft: 5 }}
                      onClick={()=>history?.navigate('mangement-settings?t=3')}
                    >
                      {translate?.t("parameters")}
                    </Typography>
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Typography> API Public Key</Typography>
                  <Typography
                    align="center"
                    display={"flex"}
                    justifyContent="start"
                    alignContent={"center"}
                  >
                    {revealSecrectKey ? (
                      <span>{secrectKey}</span>
                    ) : (
                      <span> **************</span>
                    )}
                    <Typography
                      sx={{
                        ml: 1,
                        display: "flex",
                        opacity: "0.3",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(secrectKey);
                        setNotifyData({
                          open: true,
                          msg: "Seceret key copied to clipboard",
                        });
                      }}
                    >
                      <img src={copyIcon} alt="Copy" />
                      <Typography sx={{ ml: 1 }}>
                        {" "}
                        {translate?.t("copy")}
                      </Typography>
                    </Typography>
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    sx={{ p: 1.5, borderColor: "#3A3868", }}
                    onClick={() => {
                      setRevealSecretKey(true);
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: "600", textTransform: "capitalize" }}
                    >
                      Reveal secret API key
                    </Typography>
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={6} md={6} xl={12}>
              <Grid
                sx={{
                  backgroundColor: "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  p: 5,
                  mt: 5,
                }}
              >
                <DataChart chartData={dashbaordKPI?.chartData} />
              </Grid>
              <Box
                className="card-documentation"
                sx={{
                  borderRadius: 6,
                  p: 5,
                  mt: 5,
                }}
              >
                <Grid
                  display={"flex"}
                  justifyContent="space-between"
                  alignItems={"center"}
                >
                  <Typography sx={{ fontFamily: "Larken", fontSize: 25 }}>
                    {translate?.t("documentation")}
                  </Typography>
                  <img
                    src={documentationIcon}
                    alt="document-icon"
                    height="15%"
                    width="15%"
                  />
                </Grid>
                {DOCUMENTATION_TYPE.map((d, index) => (
                  <Typography
                    sx={{ fontFamily: "Larken", fontSize: 18, mt: 1 }}
                  >
                    {translate?.t(d?.title)}
                    <Typography component="span" sx={{ ml: 2 }}>
                      <Box className="document-button">
                        <img
                          src={rightIcon}
                          alt="icon"
                          height="10"
                          width="20"
                        />
                      </Box>{" "}
                    </Typography>
                  </Typography>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {openTemplates === true && (
        <Dailog
          props={props}
          open={openTemplates}
          setOpen={setOpenTemplates}
          Component={NewTemplate}
          cb={() => console.log("callback Called")}
        />
      )}
      {openAddUser && (
        <Dailog
          props={props}
          open={openAddUser}
          setOpen={setOpenAddUser}
          Component={AddUser}
          cb={() => console.log("callback Called")}
        />
      )}
      {/* Notifications */}
      <Notification
        open={notifyData?.open}
        msg={notifyData?.msg}
        handleClose={setNotificationClose}
      />
    </>
  );
}
export default AdminDashboard;