import BadgeIcon from "@mui/icons-material/Badge";
import {
  Box, Grid, Tab,
  Tabs, TextField, Tooltip, Typography
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./style.css";
import Subscription from "./subscription";
import Invoices from "./Invoices";
import BillingDetails from "./BillingDetails";


function ManagementAndSettings(props) {
  const { history, translate } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(0);
  const [session, setSession] = useState(null);
  const success = searchParams.get("success");

  useEffect(() => {
    const currentTab = searchParams?.get("t")
  setValue(currentTab!==null?parseInt(currentTab):0);
  }, []);

  //TABS FUCTIONS
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);

  };



  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
        style={{width: '100%'}}
      >
        {value === index && (
          <Box
            sx={{
              p: 2,
              color: "#000",
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              position:'relative'
            }}
          >
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  return (
    <Box>
      <Grid display="flex" justifyContent={"space-between"}>
        <Grid>
          <Typography style={{ fontFamily: "Larken", fontSize: 26 }}>
            {translate?.t("management_settings")}
          </Typography>
        </Grid>
      </Grid>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "column",
            xl: "row",
            lg: "row",
          },
          mt: 4,
          borderRadius: 2,
          minHeight: "70vh",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider", p: 1 }}
        >
          <Tab
            sx={{ textTransform: "capitalize" }}
            label={translate?.t("group_information")}
            {...a11yProps(0)}
          />
          <Tab
            sx={{ textTransform: "capitalize" }}
            label={translate?.t("billing_information")}
            {...a11yProps(1)}
          />
          <Tab
            sx={{ textTransform: "capitalize" }}
            label={translate?.t("invoices")}
            {...a11yProps(2)}
          />
          <Tab
            sx={{ textTransform: "capitalize" }}
            label={translate?.t("subscription")}
            {...a11yProps(3)}
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Grid container spacing={2} maxWidth={"100%"}>
            <Grid display={"flex"} item xs={10}>
              <Box
                sx={{
                  flex: "1",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  width: "max-content",
                  marginRight: "15px",
                }}
              >
                <Typography>Name</Typography>
                <Typography>Company Registration</Typography>
                <Typography>VAT Number</Typography>
              </Box>
              <Box
                sx={{
                  flex: "1",
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "200px",
                }}
              >
                <TextField
                  sx={{
                    mt: 2,
                  }}
                  fullWidth
                />
                <TextField
                  sx={{
                    mt: 2,
                  }}
                  fullWidth
                />
                <TextField
                  sx={{
                    mt: 2,
                  }}
                  fullWidth
                />
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box display="none">
            <Fragment>
              <div>
                <BadgeIcon />
                <Typography>Add Debit / Credit Card</Typography>
              </div>
              <Grid
                alignItems="center"
                className="collectGrid"
                // justifyContent="space-around"
                container
                direction="row"
                spacing={3}
              >
                <Grid item>
                  <TextField
                    className="postalCodeAdd"
                    id="filled-basic"
                    label="Card Holder's Name"
                    variant="filled"
                  />
                </Grid>

                <Grid item>
                  <TextField
                    className="postalCodeAdd"
                    id="filled-basic"
                    label="Card Number"
                    variant="filled"
                  />
                </Grid>
              </Grid>
              <div style={{ padding: "1rem 0 1rem " }}>
                <h5 className="collectHead">Expiry Date</h5>
              </div>
              <Grid
                alignItems="center"
                className="collectField"
                // justifyContent="center"
                container
                direction="row"
                spacing={3}
              >
                <Grid item>
                  <TextField
                    className="nameField"
                    id="filled-basic"
                    label="Month"
                    variant="filled"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    className="nameField"
                    id="filled-basic"
                    label="Year"
                    variant="filled"
                  />
                </Grid>
              </Grid>
              <Grid
                alignItems="center"
                className="secCodeGrid"
                container
                direction="row"
                spacing={3}
              >
                <Grid item>
                  <TextField
                    className="nameField"
                    id="filled-basic"
                    label="Security Code"
                    variant="filled"
                  />
                </Grid>
                <Grid item>
                  <Tooltip aria-label="Help" title="Help Tooltip Here">
                    <BadgeIcon />
                  </Tooltip>
                </Grid>
              </Grid>
            </Fragment>
          </Box>
          <BillingDetails {...props} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Invoices {...props} />
        </TabPanel>
        <TabPanel
          value={value}
          index={3}
          style={{ width: "100%", position: "relative" }}
        >
          <Subscription {...props} />
        </TabPanel>
      </Box>
    </Box>
  );
}

export default ManagementAndSettings;
