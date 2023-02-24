import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import logo from "../../assets/logo.svg";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
// MUI Components
import { Grid, Box, TextField } from "@mui/material";
// Shared Commponent
import PrimaryButton from "../../common/primary-button";
import Notification from "../../common/Notification";
import { AnalysisLoader } from "../../common/loader";
// Icon
import rightArrow from "../../assets/right-arrow.svg";
// Services
import { verifySignUpEmail, verifySignUpOTP } from "../../services/services";
import OTPInput, { ResendOTP } from "otp-input-react";
import ReplayIcon from "@mui/icons-material/Replay";
import VerifyOtp from "./verifyOtp";

function VeriySignUp(props) {
  const { translate, history } = props;
  const captchaRef = useRef(null);
  const [notifyData, setNotifyData] = useState({ open: false, msg: "",status:'success' });
  const [enterOtp, setenterOtp] = useState(false);

  const [captchaShow, setCaptchaShow] = useState(false);
  const [email, setEmail] = useState(null);
  const [human, isHuman] = useState(false);
  const [loading,setLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setCaptchaShow(true);
    }, 1500);
  }, []);
  const setNotificationClose = () => {
    setNotifyData({ ...notifyData, open: false,status:'success' });
  };

  const renderButton = (buttonProps) => {
    return (
      <div {...buttonProps} className="d-flex-center" style={{ color: "#000" }}>
        <ReplayIcon />
      </div>
    );
  };
  const renderTime = (remainingTime) => {
    return (
      <span style={{ color: "#000" }}>{remainingTime} seconds remaining</span>
    );
  };

  const validation = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
  });

  const handelSignUp = async (value) => {
    setLoading(true)
    setEmail(value.email);
    const token = captchaRef.current.getValue();
    captchaRef.current.reset();
    console.log(value);
    let response = await verifySignUpEmail(value);
    setLoading(false)
    if (response.status === 200) {
      setenterOtp(true);
      setNotifyData({
        open: true,
        msg: response?.message,
        status:'success'
      });
    } else {
      setNotifyData({
        open: true,
        msg: response?.response?.data?.message,
        status: "error",
      });
    }
  };

   const validateCaptcha = async(token)=>{
    //   let headers = new Headers();
    // headers.append("Access-Control-Allow-Origin", "http://localhost:3000");
      const rawResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.REACT_APP_CAPTCHA_SECRET_KEY}&response=${token}`, {
    method: 'POST',
    mode:'no-cors',
    // headers:headers
  });
  if(rawResponse){
    isHuman(true);
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
        <div className="login-card" style={{ position: "relative" }}>
          <AnalysisLoader
            loading={loading}
            style={{
              position: "absolute",
              top: "calc(50% - 25px)",
              left: "calc(50% - 25px)",
              transform: "translate(-50%,-50%)",
              zIndex: 111,
            }}
          />

          {enterOtp ? (
            <VerifyOtp {...props} email={email} />
          ) : (
            <Box>
              <div className="form-title"> {translate?.t("register")}</div>
              <Formik
                initialValues={{ email: "" }}
                validationSchema={validation}
                enableReinitialize={true}
                onSubmit={(values) => {
                  handelSignUp(values);
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
                            error={touched.email && errors.email}
                            placeholder={translate?.t("email")}
                            variant="outlined"
                            name={"email"}
                            value={values?.email}
                            onChange={handleChange("email")}
                          />
                        </div>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <>
                            <ReCAPTCHA
                              ref={captchaRef}
                              sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
                              onChange={(value) => {
                                validateCaptcha(value);
                              }}
                              onErrored={(err) => {
                                console.log("Captcha Error:", err);
                              }}
                            />
                          </>
                        </Box>

                        <Grid
                          // className="submit-btn"
                          display={"flex"}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <PrimaryButton
                            sx={{ color: "#FFF", height: 30, mt: 2 }}
                            endIcon={rightArrow}
                            type="submit"
                            loading={loading}
                            disable={!human ? true : false}
                          >
                            {translate?.t("send")}
                          </PrimaryButton>
                        </Grid>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </Box>
          )}
        </div>
      </div>
      {/* Notifications */}
      <Notification
        open={notifyData?.open}
        msg={notifyData?.msg}
        status={notifyData?.status}
        handleClose={setNotificationClose}
      />
    </>
  );
}

export default VeriySignUp;
