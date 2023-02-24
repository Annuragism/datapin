import React, { useState, useRef, useEffect } from "react";
import { Grid, Typography, Box, TextField, Checkbox } from "@mui/material";
import logo from "../../assets/logo.svg";
import "./style.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
// MUI Components
// Shared Commponent
import PrimaryButton from "../../common/primary-button";
import Notification from "../../common/Notification";
// Icon
import rightArrow from "../../assets/right-arrow.svg";
// Services
import { signUpAdmin } from "../../services/services";
function SignUp(props) {
  const { history, translate } = props;
  let { e } = props?.history?.params();
  const USER_EMAIL = atob(e);

  const validation = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
    name: Yup.string().required("Name is required"),
    password: Yup.string()
      .min(8, "Password too short requires 8 digit minimum" )
      .required("Password is required.")
      .matches(/\d+/,"Password should contains number")
      .matches(/[a-z]+/, "Password should contains a lowercase")
      .matches(/[A-Z]+/,"Password should contains a uppercase")
      .matches(/[!@#$%^&*()-+]+/,"Password should contains special character"),
    company_name: Yup.string().required("Company Name is required"),
    accept: Yup.bool() // use bool instead of boolean
      .oneOf([true], "You must accept the terms and conditions"),
  });


  const handelAdminSignUp = async (values) => {
    let reqpayloadForSignUp = {
      firstName: values.name.split(" ")[0],
      lastName: values.name.split(" ")[1],
      email: values.email,
      password: values.password,
      companyName: values.company_name,
    };
    console.log(reqpayloadForSignUp);
    let response = await signUpAdmin(reqpayloadForSignUp);
    console.log(response);
    history?.navigate('login');
  };




  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          item
          xl={6}
          display={"flex"}
          justifyContent="space-between"
          onClick={() => {
            history?.navigate("/");
          }}
        >
          <img src={logo} alt="logo-datakeen" />
          <div className="logo-title" variant="h4">
            DATAKEEN
          </div>
        </Box>
        <Box
          sx={{
            background: "#fff",
            height: "calc(70vh - 25px)",
            width: "calc(70vw - 25px)",
            maxWidth: "770px",
            borderRadius: 6,
            color: "#000",
            display: "flex",
            overflow: "hidden",
            m: 2,
          }}
        >
          <Box sx={{ flex: 3, p: 2 }}>
            <Box>
              <div className="form-title"> {translate?.t("register")}</div>
              <Formik
                initialValues={{
                  email: USER_EMAIL,
                  name: "",
                  password: "",
                  company_name: "",
                  accept: false,
                }}
                validationSchema={validation}
                enableReinitialize={true}
                onSubmit={(values) => {
                handelAdminSignUp(values) 
                }}
              >
                {({ values, handleChange, errors, touched, handleBlur }) => {
                  return (
                    <Form>
                      <Box
                        className="form"
                        sx={{
                          maxHeight: "calc(65vh - 25px)",
                          overflow: "auto",
                        }}
                      >
                        <Box sx={{ m: 1, p: 1 }}>
                          <Typography className="label">
                            {translate?.t("name")}
                          </Typography>
                          <TextField
                            fullWidth
                            type="text"
                            helperText={touched.name && errors.name}
                            error={touched.name && errors.name}
                            placeholder={translate?.t("name")}
                            variant="outlined"
                            name={"name"}
                            value={values?.name}
                            onChange={handleChange("name")}
                            onBlur={handleBlur}
                          />
                        </Box>
                        <Box sx={{ m: 1, p: 1 }}>
                          <Typography className="label">
                            {translate?.t("password")}
                          </Typography>
                          <TextField
                            fullWidth
                            type="text"
                            helperText={touched.password && errors.password}
                            error={touched.password && errors.password}
                            placeholder={translate?.t("password")}
                            variant="outlined"
                            name={"password"}
                            value={values?.password}
                            onChange={handleChange("password")}
                            onBlur={handleBlur}
                          />
                        </Box>
                        <Box sx={{ m: 1, p: 1 }}>
                          <Typography className="label">Company</Typography>
                          <TextField
                            fullWidth
                            type="text"
                            helperText={
                              touched.company_name && errors.company_name
                            }
                            error={touched.company_name && errors.company_name}
                            placeholder="Company"
                            variant="outlined"
                            name={"company_name"}
                            value={values?.company_name}
                            onChange={handleChange("company_name")}
                            onBlur={handleBlur}
                          />
                        </Box>
                        <Box sx={{ m: 1, p: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Checkbox
                              helperText={touched.accept && errors.accept}
                              error={touched.accept && errors.accept}
                              value={values?.accept}
                              onChange={handleChange("accept")}
                            />
                            <Typography>
                              I accept the terms and conditions and privacy
                              policy
                            </Typography>
                          </Box>
                          {touched.accept && errors.accept && (
                            <Typography sx={{ color: "#d32f2f" }}>
                              Please accept the term and condition
                            </Typography>
                          )}
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
                          >
                            {translate?.t("start")}
                          </PrimaryButton>
                        </Grid>
                      </Box>
                    </Form>
                  );
                }}
              </Formik>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              background: "#672eaf",
              display: { xs: "none", sm: "none", md: "block" },
            }}
          >
            <Typography align="center">
              <img src={logo} alt="logo-datakeen" />
            </Typography>
            {/* <div className="logo-title">DATAKEEN</div> */}
          </Box>
        </Box>
      </Box>
    </>
  );
}
//localhost:3000/signup/bWFya2FkbWluQHlvcG1haWwuY29t

export default SignUp;
