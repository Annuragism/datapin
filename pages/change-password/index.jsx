import React, { useState } from "react";
import "./style.css";
import logo from "../../assets/logo.svg";
import TextField from "@mui/material/TextField";
import { Formik, Form } from "formik";
import * as Yup from "yup";
// MUI Components
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// Shared Commponent
import PrimaryButton from "../../common/primary-button";
import Notification from "../../common/Notification";
// Icon
import rightArrow from "../../assets/right-arrow.svg";
// Services
import { ChangePasswordCall } from "../../services/services";

function ChangePassword(props) {
  let {d} = props?.history?.params()
  const USER_EMAIL = atob(d);
  console.log(USER_EMAIL);
  const { translate, history } = props;
  const [notifyData, setNotifyData] = useState({ open: false, msg: "" });

  const setNotificationClose = () => {
    setNotifyData({ ...notifyData, open: false });
  };

  const validation = Yup.object().shape({
    new_password: Yup.string().required("Password is required"),
    confirm_password: Yup.string().oneOf(
      [Yup.ref("new_password"), null],
      "Passwords must match"
    ),
  });


  const handelChangePassword = async (value) => {
    if (!USER_EMAIL) {
      console.error("something went wrong");
    }
    let res = {
      password: value.new_password,
      email: USER_EMAIL,
    };
    
    let changePasswordResponse = await ChangePasswordCall(res);
    console.log(changePasswordResponse);
    if(changePasswordResponse.status === 200){
      setNotifyData({ open: true, msg: changePasswordResponse?.message});
      setTimeout(()=>{
        history?.navigate("/");
      },1000)
    }
    else{
          setNotifyData({ open: true, msg: changePasswordResponse?.response?.data?.message });
    }

  };

  return (
    <>
      <div className="login-container">
        <Grid
          item
          xl={6}
          md={4}
          className="logo-div"
          display={"flex"}
          justifyContent="space-between"
        >
          <Grid item xl={6} md={4} className="logo-img">
            <img src={logo} alt="logo-datakeen" />
          </Grid>
          <Grid item xl={6} md={4} className="logo-title">
            DATAKEEN
          </Grid>
        </Grid>
        <div className="login-card">
          <Box>
            <div className="form-title">{translate?.t("change_password")}</div>
            <Formik
              initialValues={{ new_password: "", confirm_password: "" }}
              validationSchema={validation}
              onSubmit={(values) => {
                handelChangePassword(values);
              }}
            >
              {({ values, handleChange, errors, touched, handleBlur }) => {
                return (
                  <Form>
                    <div className="form">
                      <div className="form-email feild">
                        <div className="label">
                          {translate?.t("new_password")}
                        </div>
                        <TextField
                          style={{ width: "100%", margin: "5px" }}
                          type="text"
                          helperText={touched.email && errors.email}
                          // error={touched.email && errors.email}
                          placeholder={translate?.t("new_password")}
                          variant="outlined"
                          name={"new_password"}
                          value={values?.new_password}
                          onChange={handleChange("new_password")}
                        />
                      </div>
                      <div className="form-Password feild">
                        <div className="label">
                          {translate?.t("new_password")}
                        </div>
                        <TextField
                          style={{ width: "100%", margin: "5px" }}
                          type="confirm_password"
                          placeholder={translate?.t("confirm_password")}
                          variant="outlined"
                          name={"confirm_password"}
                          helperText={
                            touched.confirm_password && errors.confirm_password
                          }
                          // error={touched.password && errors.password}
                          value={values?.confirm_password}
                          onChange={handleChange("confirm_password")}
                        />
                      </div>
                      <Grid
                        // className="submit-btn"
                        display={"flex"}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <PrimaryButton
                          style={{ color: "#FFF" }}
                          endIcon={rightArrow}
                          disable={false}
                          type="submit"
                        >
                          {translate?.t("change_password")}
                        </PrimaryButton>
                      </Grid>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </div>
      </div>
      {/* Notifications */}
      <Notification
        open={notifyData?.open}
        msg={notifyData?.msg}
        handleClose={setNotificationClose}
      />
    </>
  );
}

export default ChangePassword;
