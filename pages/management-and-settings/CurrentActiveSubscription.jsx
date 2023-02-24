import {
  Box, Tab,
  Tabs,
  Typography
} from "@mui/material";
import React from "react";
import checkIcon from "../../assets/check1.svg";
import "./style.css";
//Components
import GetPackCardsDetails from "./GetPackCardsDetails";

//Services
import { loadStripe } from "@stripe/stripe-js";
import PrimaryButton from "../../common/primary-button";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const CurrentActiveSubscription = (props) => {
  const {
    translate,
    history,
    currentSubscription,
    packs,
    loading,
    setLoading,
    setShowPlans,
  } = props;

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setShowPlans(false);
  };
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };
  return (
    <>
      <Box
        sx={{
          background: "rgba(0,0,0,0.04)",
          borderRadius: 4,
          p: 2,
          // maxHeight: "70vh",
          // overflow: "auto",
          border: "1px solid #8853cc",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
        >
          <Tab label={translate?.t("plan")} {...a11yProps(0)} />
          <Tab label={translate?.t("pack")} {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:'space-between',
              flexWrap:'wrap'
            }}
          >
            <Typography variant="h5">
              {" "}
              {translate?.t("current_plan")}:-{" "}
              {currentSubscription?.isFree ? (
                <Typography variant="h6">
                  Free Trial (
                  {currentSubscription?.expired ? (
                    <Typography component="span" sx={{ color: "red" }}>
                      Expired
                    </Typography>
                  ) : (
                    <>{currentSubscription?.remainingDays}remaining days</>
                  )}
                  )
                </Typography>
              ) : (
                currentSubscription?.plan?.name
              )}
            </Typography>
            <PrimaryButton
              sx={{ height: 40 }}
              text={translate?.t("change")}
              onClick={() => {
                setShowPlans(true);
              }}
            />
          </Box>
          <Box
            mt={2}
            // sx={{
            //   mt: 2,
            // background: "rgba(0,0,0,0.04)",
            // borderRadius: 4,
            // maxHeight: "65vh",
            // overflow: "auto",
            // }}
          >
            {currentSubscription?.plan?.metadata?.description?.split(",")
              .length > 0 ? (
              <>
                {currentSubscription?.plan?.metadata?.description
                  ?.split(",")
                  .map((desc, ind) => (
                    <Typography
                      pt={1}
                      variant="body1"
                      key={ind}
                      sx={{
                        m: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          background:
                            "linear-gradient(90deg, #7872E2 0%, #AD6AD6 63.4%, #8853CC 100%)",
                          p: "2px",
                          borderRadius: 2,
                        }}
                        component={"span"}
                        key={ind}
                      >
                        <img src={checkIcon} alt={checkIcon} />
                      </Typography>{" "}
                      {desc}
                    </Typography>
                  ))}
                <Typography mt={2}>
                  Cost per document : 1.49€ - Want to buy at discount price ?{" "}
                  <u
                    style={{ color: "#7872E2", cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                      setValue(1);
                    }}
                  >
                    Get a pack !
                  </u>
                </Typography>
              </>
            ) : null}
          </Box>
          {currentSubscription?.packPurchase && (
            <GetNumberOfCredits
              translate={props?.translate}
              data={currentSubscription}
            />
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <GetPackCardsDetails
            packs={packs}
            loading={loading}
            setLoading={setLoading}
            currentSubscription={currentSubscription}
            {...props}
          />
        </TabPanel>
      </Box>
    </>
  );
};

export default CurrentActiveSubscription;
const GetNumberOfCredits = ({ translate, data }) => {
  return (
    <Box
      sx={{
        p: 2,
        mt: 2,
        background: "rgba(0,0,0,0.04)",
        borderRadius: 4,
        border: "1px solid #8853cc",
      }}
    >
      {data?.packPurchase && (
        <Typography pt={1} variant="h5">
          {data?.credits} {translate?.t("credit_left")}
        </Typography>
      )}
    </Box>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};