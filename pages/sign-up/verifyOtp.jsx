import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import logo from "../../assets/logo.svg";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
// MUI Components
import { Grid, Typography, Box, TextField } from "@mui/material";
// Shared Commponent
import PrimaryButton from "../../common/primary-button";
import Notification from "../../common/Notification";
// Icon
import rightArrow from "../../assets/right-arrow.svg";
// Services
import { verifySignUpEmail, verifySignUpOTP } from "../../services/services";
import OTPInput, { ResendOTP } from "otp-input-react";
import ReplayIcon from "@mui/icons-material/Replay";

function VerifyOtp(props) {
  const { translate, history, email } = props;
    const [OTP, setOTP] = useState("");
  const [notifyData, setNotifyData] = useState({ open: false, msg: "" });

  const setNotificationClose = () => {
    setNotifyData({ ...notifyData, open: false });
  };

    const handleOtpVerification = async () => {
      let res = {
        email: email,
        otp: OTP,
      };
      let verifyOtpResponse = await verifySignUpOTP(res);
      if (verifyOtpResponse.status === 200) {
        setNotifyData({
          open: true,
          msg: verifyOtpResponse?.message,
        });
        setTimeout(() => {
          history?.navigate(`/signup/${btoa(email)}`, {
            state: { email: email },
          });
        }, 1000);
      } else {
        setNotifyData({
          open: true,
          msg: verifyOtpResponse?.response?.data?.message,
        });
      }
    };
  return (
    <>
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
     {/* Notifications */}
      <Notification
        open={notifyData?.open}
        msg={notifyData?.msg}
        handleClose={setNotificationClose}
      />
    </>

  );
}

export default VerifyOtp;
