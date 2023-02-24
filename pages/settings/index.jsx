import React, { useState, useEffect } from "react";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import {
  Select,
  Container,
  List,
  Divider,
  MenuItem,
  OutlinedInput,
  InputLabel,
  Typography,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  Button,
  Grid,
  Box,
  ListSubheader,
  Collapse,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Formik, Form } from "formik";
import LanguageIcon from "@mui/icons-material/Language";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./style.css";
import Notification from "../../common/Notification";

// Services
import { changePassword, updateProfile } from "../../services/services";

function Setting(props) {
  const { setTheme, translate, setNotify } = props;
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifyData, setNotifyData] = useState({ open: false, msg: "" });
  const [data, setData] = useState(localStorage.getItem("theme") || "light");
  const [open, setOpen] = useState(false);
  const [fname, setFname] = useState(user.firstName);
  const [lname, setLname] = useState(user.lastName);
  const [selectedLang, setselectedLang] = useState(localStorage.getItem("lng"));

  const [togglePassword, setTogglePassword] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handelChangeTheme = (e) => {
    localStorage.setItem("theme", e.target.value);
    setTheme(e.target.value);
  };

  const handelChangeLanguage = (e) => {
    localStorage.setItem("lng", e.target.value);
    console.log(e.target.value);
    translate?.i18n.changeLanguage(e.target.value);
  };

  const togglePasswordHide = () => {
    setTogglePassword(!togglePassword);
  };

  const chnagePasswordAPiCall = async (payload) => {
    let response = await changePassword(payload);
    console.log(response);
    if (response.status === 200) {
      setOpen(false);
      setNotifyData({ open: true, msg: response?.message });
    } else {
      setNotifyData({ open: true, msg: response?.response?.data?.message });
    }
  };

  const handlefirstNameChange = async (e) => {
    let result = await updateProfile({ firstName: e.target.value });
    console.log(result);
    if (result?.status === 200) {
      setNotifyData({ open: true, msg: result?.message });
    }

  };
  const handleLastNameChange = async (e) => {
    let result = await updateProfile({ lastName: e.target.value });
    console.log(result);
    if (result?.status === 200) {
      setNotifyData({ open: true, msg: result?.message });
    }

  };
  const setNotificationClose = () => {
    setNotifyData({ ...notifyData, open: false });
  };

  return (
    <>
      <Container
        maxWidth="md"
        sx={{ padding: 5, borderRadius: 10, bgcolor: "background.paper" }}
      >
        <Typography variant="h4" mb={3} color={"#000"} component="h2">
          {translate?.t("settings")}
        </Typography>
        <List sx={{ width: "100%", color: "#000" }}>
          <ListItem>
            <ListItemIcon>
              <BadgeIcon />
            </ListItemIcon>
            <ListItemText
              sx={{ width: "50%" }}
              id="switch-list-label-Name"
              primary={translate?.t("settings_label_first_name")}
            />
            <FormControl sx={{ width: "30%" }}>
              <InputLabel id="demo-simple-select-label">
                {translate?.t("settings_label_first_name")}
              </InputLabel>
              <OutlinedInput
                label={"Name"}
                value={`${fname}`}
                onChange={(e) => {
                  setFname(e.target.value);
                  const updatedUser = { ...user, firstName: e.target.value };
                  localStorage.setItem("user", JSON.stringify(updatedUser));
                }}
                onBlur={(e) => {
                  handlefirstNameChange(e);
                }}
              />
            </FormControl>
            <Divider />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BadgeIcon />
            </ListItemIcon>
            <ListItemText
              sx={{ width: "50%" }}
              id="switch-list-label-Name"
              primary={translate?.t("settings_label_last_name")}
            />
            <FormControl sx={{ width: "30%" }}>
              <InputLabel id="demo-simple-select-label">
                {" "}
                {translate?.t("settings_label_last_name")}
              </InputLabel>
              <OutlinedInput
                label={"Name"}
                value={`${lname}`}
                onChange={(e) => {
                  setLname(e.target.value);
                  const updatedUser = { ...user, lastName: e.target.value };
                  localStorage.setItem("user", JSON.stringify(updatedUser));
                }}
                onBlur={(e) => {
                  handleLastNameChange(e);
                }}
              />
            </FormControl>
            <Divider />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText
              id="switch-list-label-Email"
              primary={translate?.t("settings_label_email")}
            />
            <FormControl sx={{ width: "30%" }}>
              <InputLabel id="demo-simple-select-label">
                {translate?.t("settings_label_email")}
              </InputLabel>
              <OutlinedInput
                readOnly
                label={"Email"}
                value={`${user?.email}`}
              />
            </FormControl>
          </ListItem>
          <Divider />

          <ListItem>
            {open ? (
              <ListSubheader component="div" id="nested-list-subheader">
                {translate?.t("change_password")}
              </ListSubheader>
            ) : (
              <>
                <ListItemIcon>
                  <PasswordIcon />
                </ListItemIcon>
                <ListItemText
                  id="switch-list-label-Password"
                  primary="Password"
                />
              </>
            )}
            <Box sx={{ width: "30%" }}>
              {open ? (
                ""
              ) : (
                <Button
                  onClick={handleClick}
                  fullWidth
                  sx={{ padding: "10px" }}
                  variant="outlined"
                  color="primary"
                >
                  {translate?.t("change_password")}
                </Button>
              )}
            </Box>
          </ListItem>
          <Divider />
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{
              paddingTop: 2,
              paddingBottom: 2,
              backgroundColor: "#fff",
            }}
          >
            <Box p={2} m={2} backgroundColor="white">
              <Formik
                initialValues={{ current_password: "", new_password: "" }}
                enableReinitialize={true}
                onSubmit={(values) => {
                  console.log(values);
                  chnagePasswordAPiCall(values);
                }}
              >
                {({ values, handleChange }) => {
                  return (
                    <Form>
                      <ListItem>
                        <ListItemIcon>
                          <PasswordIcon />
                        </ListItemIcon>
                        <ListItemText
                          id="switch-list-label-Current-Password"
                          primary={translate?.t("current_password")}
                        />
                        <FormControl sx={{ width: "60%" }}>
                          <TextField
                            type={togglePassword ? "text" : "password"}
                            label={translate?.t("current_password")}
                            name="current_password"
                            onChange={handleChange("current_password")}
                            value={values.current_password}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {" "}
                                  {togglePassword ? (
                                    <Visibility
                                      className="cursor_pointer"
                                      onClick={togglePasswordHide}
                                    />
                                  ) : (
                                    <VisibilityOff
                                      onClick={togglePasswordHide}
                                    />
                                  )}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </FormControl>
                      </ListItem>
                      {/* <Divider /> */}
                      <ListItem>
                        <ListItemIcon>
                          <PasswordIcon />
                        </ListItemIcon>
                        <ListItemText
                          id="switch-list-label-New-Password"
                          primary={translate?.t("new_password")}
                        />
                        <FormControl sx={{ width: "60%" }}>
                          <TextField
                            type={togglePassword ? "text" : "password"}
                            label={translate?.t("new_password")}
                            name="new_password"
                            onChange={handleChange("new_password")}
                            value={values.new_password}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {" "}
                                  {togglePassword ? (
                                    <Visibility
                                      className="cursor_pointer"
                                      onClick={togglePasswordHide}
                                    />
                                  ) : (
                                    <VisibilityOff
                                      onClick={togglePasswordHide}
                                    />
                                  )}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </FormControl>
                      </ListItem>
                      {/* <Divider /> */}
                      <ListItem
                        fullWidth
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                        }}
                      >
                        <Button
                          // onClick={handleClick}
                          sx={{ padding: "10px 40px" }}
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          Submit
                        </Button>
                      </ListItem>
                    </Form>
                  );
                }}
              </Formik>
            </Box>
          </Collapse>
          <Divider />

          <ListItem>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText
              id="switch-list-label-language"
              primary={translate?.t("settings_label_language")}
            />
            <FormControl sx={{ width: "30%" }}>
              <InputLabel id="demo-simple-select-label">
                {translate?.t("settings_label_language")}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={localStorage.getItem("lng")}
                label="Language"
                onChange={(e) => {
                  handelChangeLanguage(e);
                }}
              >
                <MenuItem value={"en"}>{translate?.t("lng_english")}</MenuItem>
                <MenuItem value={"fr"}>{translate?.t("lng_french")}</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemIcon>
              <AutoAwesomeIcon />
            </ListItemIcon>
            <ListItemText
              id="switch-list-label-theme"
              primary={translate?.t("settings_label_theme")}
            />
            <FormControl sx={{ width: "30%" }}>
              <InputLabel id="demo-simple-select-label">
                {translate?.t("settings_label_theme")}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={localStorage.getItem("theme")}
                label="Theme"
                onChange={(e) => {
                  handelChangeTheme(e);
                }}
              >
                <MenuItem value={"dark"}>{translate?.t("theme_dark")}</MenuItem>
                <MenuItem value={"light"}>
                  {translate?.t("theme_light")}
                </MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        </List>
      </Container>

      {/* Notifications */}
      <Notification
        open={notifyData?.open}
        msg={notifyData?.msg}
        handleClose={setNotificationClose}
        autoClose={true}
      />
    </>
  );
}

export default Setting;
