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
import { login } from "../../services/services";
import { Typography } from "@mui/material";

function Login(props) {
  const { translate, history } = props;
  const [notifyData, setNotifyData] = useState({ open: false, msg: "" });

  const setNotificationClose = () => {
    setNotifyData({ ...notifyData, open: false });
  };

  const validation = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    //   .matches(
    //     /[0-9]{5}$/,
    //     "Password must contain 6 characters"
    //  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    //  "Password must contain 6 characters, one uppercase, one lowercase, one number and one special case Character"
    // ),
  });

  const handelLogin = async (value) => {
    let loginData = {
      email: value?.email,
      password: value?.password,
    };
    login(loginData).then((data) => {
      if (data?.status === 200 && data?.data) {
        // console.log(data.data)
        localStorage.setItem("token", data?.data?.token);
        localStorage.setItem("user", JSON.stringify(data?.data?.userDetail));
        localStorage.setItem("role", data?.data?.userDetail?.role);
        setNotifyData({ open: true, msg: translate?.t(data?.message) });
        setTimeout(() => {
          data?.data?.userDetail?.role === "admin"
            ? props?.history?.navigate("admin-dashboard")
            : props?.history?.navigate("user-dashboard");
        }, 1000);
      } else {
        setNotifyData({ open: true, msg: data?.response?.data?.message });
      }
    });
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
          <Grid
            item
            xl={6}
            md={4}
            className="logo-title"
           id="logo-title"
          >
            DATAKEEN
          </Grid>
        </Grid>
        <div className="login-card">
          <Box>
            <div className="form-title">{translate?.t("log_in")}</div>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validation}
              enableReinitialize={true}
              onSubmit={(values) => {
                handelLogin(values);
              }}
            >
              {({ values, handleChange, errors, touched, handleBlur }) => {
                return (
                  <Form>
                    <div className="form">
                      <div className="form-email feild">
                        <div className="label">
                          {translate?.t("login_email_text")}
                        </div>
                        <TextField
                          style={{ width: "100%", margin: "5px" }}
                          id="login-email"
                          type="text"
                          helperText={touched.email && errors.email}
                          // error={touched.email && errors.email}
                          placeholder={translate?.t("login_email_text")}
                          variant="outlined"
                          name={"email"}
                          value={values?.email}
                          onChange={handleChange("email")}
                        />
                      </div>
                      <div className="form-Password feild">
                        <div className="label">{translate?.t("password")}</div>
                        <TextField
                          id="login-password"
                          style={{ width: "100%", margin: "5px" }}
                          type="password"
                          placeholder={translate?.t("password")}
                          variant="outlined"
                          name={"password"}
                          helperText={touched.password && errors.password}
                          // error={touched.password && errors.password}
                          value={values?.password}
                          onChange={handleChange("password")}
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
                          id="login-submit-button"
                          type="submit"
                          onClick={() => {
                            // props?.history?.navigate("user-dashboard");
                          }}
                        >
                          {translate?.t("to_log_in")}
                        </PrimaryButton>
                      </Grid>
                      <Typography
                        sx={{
                          color: "rgb(120, 114, 226)",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        align="center"
                        mt={2}
                        onClick={(e) => {
                          e.preventDefault();
                          // history?.navigate("/signup");
                          window.location.href = "/verify-signup";
                        }}
                      >
                        {translate?.t("register")}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#7872E2",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        align="center"
                        mt={2}
                        onClick={(e) => {
                          e.preventDefault();
                          history?.navigate("/forgot-password");
                        }}
                      >
                        {translate?.t("forgot_password")}
                      </Typography>
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

export default Login;
