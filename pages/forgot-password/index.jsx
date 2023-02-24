import React, { useState } from 'react'
import './style.css';
import logo from '../../assets/logo.svg'
import TextField from '@mui/material/TextField';
import { Formik, Form } from "formik";
import * as Yup from 'yup';
// MUI Components
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// Shared Commponent
import PrimaryButton from '../../common/primary-button';
import Notification from '../../common/Notification';
// Icon
import rightArrow from '../../assets/right-arrow.svg'
// Services
import { forgotPassword, verifyOtp } from "../../services/services";
import OTPInput, { ResendOTP } from "otp-input-react";
import ReplayIcon from '@mui/icons-material/Replay';

function ForgotPassword(props) {
  const { translate, history } = props;
  const [notifyData, setNotifyData] = useState({ open: false, msg: "" });
  const [enterOtp, setenterOtp] = useState(false);
 const [OTP, setOTP] = useState("");
 const [email,setEmail] = useState(null);
 function handleChange(OTP) {
   setOTP(OTP);
 }
  const setNotificationClose = () => {
    setNotifyData({ ...notifyData, open: false });
  };

const renderButton = (buttonProps) => {
  return (
    <div {...buttonProps} className="d-flex-center" style={{ color: "#000" }}>
      <ReplayIcon />
    </div>
  );
};
const renderTime = (remainingTime) => {

  return <span style={{color:'#000'}}>{remainingTime} seconds remaining</span>;
};


  const validation = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
  });

  const handelForgotPassword = async (value) => {
    setEmail(value.email);
    let response = await forgotPassword(value);
    if(response.status===200){
      localStorage.setItem('temp_token',response?.data?.token);
      setenterOtp(true);
    }else{
       setNotifyData({
         open: true,
         msg: response?.response?.data?.message,
       });
    }
  };

  const handleOtpVerification = async () => {
    let res = {
      email: email,
      otp:OTP
    };
    let verifyOtpResponse = await verifyOtp(res);
    console.log(verifyOtpResponse)
    if (verifyOtpResponse.status === 200) {
       setNotifyData({
         open: true,
         msg: verifyOtpResponse?.message,
       });
        setTimeout(() => {
          history?.navigate(
            `/change-password/${btoa(email)}`,
            { state: { email: email } }
          );
        }, 1000);
    } else {
      setNotifyData({
        open: true,
        msg: verifyOtpResponse?.response?.data?.message,
      });
    }
  }

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
          onClick={() => {
            history?.navigate("/");
          }}
        >
          <Grid item xl={6} md={4} className="logo-img">
            <img src={logo} alt="logo-datakeen" />
          </Grid>
          <Grid item xl={6} md={4} className="logo-title">
            DATAKEEN
          </Grid>
        </Grid>
        <div className="login-card">
          {enterOtp ? (
            <Box>
              <div className="form-title">{translate?.t("enter_otp")}</div>
              <Grid display={"flex"} justifyContent="center" sx={{ mt: 4 }}>
                <OTPInput
                  value={OTP}
                  onChange={setOTP}
                  autoFocus
                  OTPLength={4}
                  otpType="number"
                  disabled={false}
                  secure
                />
              </Grid>
              {/* <ResendOTP
                style={{color:'#000',display:'flex',justifyContent:'space-evenly',alignItems:'center',marginTop:20}}
                  maxTime={10}
                  renderButton={renderButton}
                  onResendClick={() => console.log("Resend clicked")}
                /> */}
              <PrimaryButton
                style={{ color: "#FFF", marginTop: "40px" }}
                endIcon={rightArrow}
                onClick={() => {
                  handleOtpVerification();
                }}
                disable={OTP?.length > 3 ? false : true}
              >
                Verify
              </PrimaryButton>
            </Box>
          ) : (
            <Box>
              <div className="form-title">
                {" "}
                {translate?.t("forget_password")}
              </div>
              <Formik
                initialValues={{ email: "" }}
                validationSchema={validation}
                enableReinitialize={true}
                onSubmit={(values) => {
                  handelForgotPassword(values);
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
                            type="text"
                            helperText={touched.email && errors.email}
                            // error={touched.email && errors.email}
                            placeholder={translate?.t("email_placeholder")}
                            variant="outlined"
                            name={"email"}
                            value={values?.email}
                            onChange={handleChange("email")}
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
                            {translate?.t("send")}
                          </PrimaryButton>
                        </Grid>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
              <div className="forgot-pwd">
                <a
                  style={{ color: "#7872E2" }}
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    history?.navigate("/login");
                  }}
                >
                  {translate?.t("log_in")}
                </a>
              </div>
            </Box>
          )}
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

export default ForgotPassword;