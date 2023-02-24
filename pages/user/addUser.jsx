import React, { useState } from "react";
import {
  List,
  Typography,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  TextField,
  MenuItem,
  Select
} from "@mui/material";
//Icons
import BadgeIcon from "@mui/icons-material/Badge";
// import PasswordIcon from "@mui/icons-material/Password";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
//Shared Component
import PrimaryButton from "../../common/primary-button";
import Notification from "../../common/Notification";
//Forms
import { Formik, Form } from "formik";
import * as Yup from "yup";
//Services
import { createUser } from "../../services/adminservices ";


function AddUser(props) {
  const { translate } = props;
      const [notifyData, setNotifyData] = useState({ open: false, msg: "" });

 let userDetails = JSON.parse(localStorage.getItem("user"));
 let groupId = null;



 if(userDetails?.role?.toLowerCase() === 'admin')
 {
  groupId = userDetails.groupId;
 }

  const validation = Yup.object().shape({
    firstName: Yup.string().required("Please enter first name"),
    lastName: Yup.string().required("Please enter last name"),
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Please enter email"),
      role:Yup.string().required("Please enter role"),
    // password: Yup.string().required("Please enter user password"),
    // confirm_password: Yup.string()
    //   .required("Please confirm user password")
    //   .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

    const setNotificationClose = () => {
      setNotifyData({ ...notifyData, open: false });
    };

   const handelCreateAction = async(data)=>{
    let response = await createUser(data)
    console.log(response)
    if(response?.status === 200){
      setNotifyData({open:true,msg:response?.message});
    }else{

    }
   }


  return (
    <Box>
      <Box
        sx={{
          background: "#f6f6ff",
          height: 100,
          display: "flex",
          alignItems: "center",
          p: 2,
        }}
      >
        <PersonIcon />
        <Typography
          sx={{
            fontFamily: "Larken",
            fontSize: 22,
          }}
        >
          Add User
        </Typography>
      </Box>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          role:'user',
          // password: "",
          // confirm_password: "",
          groupId: groupId,
        }}
        validationSchema={validation}
        enableReinitialize={true}
        onSubmit={(values) => {
          console.log(values);
           handelCreateAction(values);


        }}
      >
        {({ values, handleChange, errors, touched, handleBlur }) => {
          return (
            <Box>
              <Form>
                <List sx={{ width: "90%", color: "#000", p: 2 }}>
                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ width: "30%" }}
                      id="switch-list-label-Name"
                      primary={translate?.t("settings_label_first_name")}
                    />
                    <TextField
                      style={{ width: "100%", margin: "5px" }}
                      type="text"
                      helperText={touched.firstName && errors.firstName}
                      error={touched.firstName && errors.firstName}
                      label={translate?.t("firstName")}
                      variant="outlined"
                      name={"firstName"}
                      value={values?.firstName}
                      onChange={handleChange("firstName")}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ width: "30%" }}
                      id="switch-list-label-Name"
                      primary={translate?.t("settings_label_last_name")}
                    />
                    <TextField
                      style={{ width: "100%", margin: "5px" }}
                      type="text"
                      helperText={touched.lastName && errors.lastName}
                      error={touched.lastName && errors.lastName}
                      label={translate?.t("lastName")}
                      variant="outlined"
                      name={"lastName"}
                      value={values?.lastName}
                      onChange={handleChange("lastName")}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ width: "30%" }}
                      id="switch-list-label-Name"
                      primary={translate?.t("business_email")}
                    />
                    <TextField
                      style={{ width: "100%", margin: "5px" }}
                      type="text"
                      helperText={touched.email && errors.email}
                      error={touched.email && errors.email}
                      label={translate?.t("business_email")}
                      variant="outlined"
                      name={"email"}
                      value={values?.email}
                      onChange={handleChange("email")}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ width: "30%" }}
                      id="switch-list-label-Name"
                      primary={translate?.t("role")}
                    />
                    <Select
                      style={{ width: "100%", margin: "5px" }}
                      type="text"
                      helperText={touched.groupId && errors.groupId}
                      error={touched.groupId && errors.groupId}
                      variant="outlined"
                      name={"role"}
                      value={values?.role}
                      onChange={handleChange("role")}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="reviewer">reviewer</MenuItem>
                      <MenuItem value="superviser">superviser</MenuItem>
                    </Select>
                  </ListItem>
                  {/* <ListItem>
                    <ListItemIcon>
                      <PasswordIcon />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ width: "30%" }}
                      id="switch-list-label-Name"
                      primary={translate?.t("settings_label_password")}
                    />
                    <TextField
                      style={{ width: "100%", margin: "5px" }}
                      type="text"
                      helperText={touched.password && errors.password}
                      error={touched.password && errors.password}
                      label={translate?.t("password")}
                      variant="outlined"
                      name={"password"}
                      value={values?.password}
                      onChange={handleChange("password")}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PasswordIcon />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ width: "30%" }}
                      id="switch-list-label-Name"
                      primary={translate?.t("confirm_password")}
                    />
                    <TextField
                      style={{ width: "100%", margin: "5px" }}
                      type="text"
                      helperText={
                        touched.confirm_password && errors.confirm_password
                      }
                      error={
                        touched.confirm_password && errors.confirm_password
                      }
                      label={translate?.t("confirm_password")}
                      variant="outlined"
                      name={"confirm_password"}
                      value={values?.confirm_password}
                      onChange={handleChange("confirm_password")}
                    />
                  </ListItem> */}
                </List>
                <PrimaryButton
                  style={{ width: "150px", height: 55 }}
                  text={translate?.t("save")}
                  type="submit"
                />
              </Form>
            </Box>
          );
        }}
      </Formik>

 {/* Notifications */}
      <Notification
        open={notifyData?.open}
        msg={notifyData?.msg}
        handleClose={setNotificationClose}
      />
    </Box>
  );
}

export default AddUser;
