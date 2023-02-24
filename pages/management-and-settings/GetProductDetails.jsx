import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box, Card, CardContent,
  Container, Grid, Typography
} from "@mui/material";
import React, { useState } from "react";
import "./style.css";
//Components
import FetauresPopOver from "./FeaturePopOver";
//Services
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PrimaryButton from "../../common/primary-button";
import CheckoutForm from "./checkout";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

//Services
const GetProductDetails = (props) => {
  const { plans, getItemsDetails, currentSubscription, translate } = props;
  const [checkout, setCheckout] = useState(false);
  const [selectedPlanData, setSelectedPlanData] = useState(null);
  const [popAnchorEl, setPopAnchorEl] = useState(null);
  return (
    <Box mb={5}>
      {!checkout ? (
        <>
          {/* {setShowPlans && (
            <PrimaryButton
              text="hide"
              sx={{ m: 2, height: 15, justifyContent: "flex-end" }}
              onClick={() => {
                setShowPlans(false);
              }}
            />
          )} */}
          <Box p={5}>
            <Grid container alignItems="stretch" spacing={3}>
              {plans?.map((pc) => (
                <>
                  <Grid
                    item
                    md={6}
                    xl={4}
                    lg={4}
                    sm={12}
                    xs={12}
                    // mb={{ xl: 1, lg: 1,md:5,sm:5,xs:5 }}
                    sx={{ height: "100%" }}
                  >
                    <Card
                      classes={{
                        root: "price_card",
                      }}
                      className={
                        currentSubscription?.itemId === pc?.id && "selected"
                      }
                      // sx={{
                      //   width: {xl:250,md:190,sm:180},
                      // }}
                    >
                      <CardContent
                        classes={{
                          root: "price_card_content",
                        }}
                      >
                        {currentSubscription?.itemId === pc?.id && (
                          <div
                            style={{
                              position: "absolute",
                              right: "-20px",
                              top: "10px",
                              width: 80,
                              transform: "rotate(45deg)",
                              background: "#8853cc",
                              padding: 5,
                              borderRadius: 6,
                              color: "#fff",
                              fontSize: 11,
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            Purchased
                          </div>
                        )}
                        {pc?.metadata?.ribbinDisplay == "true" && (
                          <Typography color="text.secondary" gutterBottom>
                            {pc?.metadata?.ribbinTitle}
                          </Typography>
                        )}
                        <Typography
                          variant="h5"
                          fontWeight="medium"
                          component="h5"
                        >
                          {pc?.name}
                        </Typography>
                        <Typography
                          variant="body1"
                          align="center"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {Math.round(pc?.price?.unit_amount / 100) || "NA"}{" "}
                          <Typography
                            align="center"
                            component="span"
                            sx={{
                              textTransform: "capitalize",
                              display: "inline-block",
                              fontWeight: 600,
                            }}
                          >
                            {pc?.price?.currency || ""}/Month
                          </Typography>
                        </Typography>
                        <Typography
                          classes={{
                            root: "price_card_secondary_text",
                          }}
                        >
                          {"+"}
                          {pc?.metadata?.description?.split(",").length}{" "}
                          features
                          <InfoOutlinedIcon
                            sx={{
                              color: "rgba(0,0,0,0.4)",
                              position: "relative",
                            }}
                            onMouseEnter={(event) => {
                              setPopAnchorEl(event?.currentTarget);
                            }}
                            onMouseLeave={(event) => {
                              setPopAnchorEl(null);
                            }}
                          />
                          <FetauresPopOver
                            data={pc?.metadata?.description}
                            setPopAnchorEl={setPopAnchorEl}
                            popAnchorEl={popAnchorEl}
                            {...props}
                          />
                        </Typography>
                      </CardContent>
                      <PrimaryButton
                        sx={{ height: 40, p: 2 }}
                        text={translate?.t("begin")}
                        disable={
                          currentSubscription?.itemId === pc?.id ? true : false
                        }
                        onClick={() => {
                          setCheckout(true);
                          setSelectedPlanData(pc);
                        }}
                      />
                    </Card>
                  </Grid>
                </>
              ))}
            </Grid>
          </Box>
        </>
      ) : (
        <GetCheckoutForm
          selectedPlan={selectedPlanData}
          getItemsDetails={getItemsDetails}
        />
      )}
    </Box>
  );
};

export default GetProductDetails;
const GetCheckoutForm = (props) => {
  const { selectedPlan, getItemsDetails } = props;
  return (
    <>
      <Box mt={2}>
        <Elements stripe={stripePromise}>
          <CheckoutForm
            plan={selectedPlan}
            // products={productList}
            getItemsDetails={getItemsDetails}
            // itemId={plans[0]._id}
            // userId={USER_DETAILS._id}
          />
        </Elements>
      </Box>
    </>
  );
};