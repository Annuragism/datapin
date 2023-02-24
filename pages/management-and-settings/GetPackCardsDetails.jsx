import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Grid, Radio, Typography
} from "@mui/material";
import "./style.css";
//Components

//Services
import { loadStripe } from "@stripe/stripe-js";
import PrimaryButton from "../../common/primary-button";
import { payment } from "../../services/services";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const GetPackCardsDetails = (props) => {
  const { packs, setLoading, currentSubscription,translate } = props;
  const [selectedPackDetails, setSelectedPacknDetails] = useState(null);

  useEffect(() => {
    const selectedPack = packs.find(
      (d, i) => currentSubscription?.packDetails === d?.id
    );
    setSelectedPacknDetails(selectedPack);
  }, [currentSubscription]);
  const handelPackChange = async (d) => {
    setSelectedPacknDetails(d);
  };

  //PAYMENTS

  const handelPackPurchase = async (packDetails) => {
    const USER_DETAILS = JSON.parse(localStorage.getItem("user"));

    let reqPayload = {
      email: USER_DETAILS?.email,
      packDetails: packDetails,
      userId: USER_DETAILS._id,
      customerId: USER_DETAILS?.stripeCustomerId,
    };
    let response = await payment(reqPayload);
    console.log(response);
    if (response?.status === 200) {
      setLoading(true);
      setLoading(false);
      const { session } = response.data;
      window.location.href = session.url;
    }
  };
  return (
    <Grid container spacing={3} mt={1} display={"flex"} justifyContent="center">
      <Typography align="center" variant="h5" sx={{ width: "100%" }}>
        {translate?.t("buy_credits")}
      </Typography>
      <Typography align="center" variant="h5" sx={{ width: "100%" }}>
        {translate?.t("select_credits")}
      </Typography>
      {packs?.map((d, i) => (
        <>
          <Card
            sx={{
              width: "100%",
              p: 2,
              m: 1,
              borderRadius: 5,
              cursor: "pointer",
              color: selectedPackDetails?.id === d?.id ? "#fff" : "#000",
              background: selectedPackDetails?.id === d?.id && "#8853cc",
            }}
            onClick={() => {
              handelPackChange(d);
            }}
          >
            <Box
              display={"flex"}
              justifyContent="space-between"
              alignItems={"center"}
            >
              <Typography>
                <Radio
                  checked={selectedPackDetails?.id === d?.id}
                  onChange={() => {
                    handelPackChange(d);
                  }}
                />
                {d?.metadata?.credit} Document credits
              </Typography>
              <Typography>
                {" "}
                {d?.price?.unit_amount / 100} {d?.price?.currency} TTC{" "}
              </Typography>
            </Box>
          </Card>
        </>
      ))}
      <PrimaryButton
        text={"BUY NOW"}
        disable={selectedPackDetails == null}
        onClick={() => {
          if (!(currentSubscription?.packDetails === selectedPackDetails?.id)) {
            handelPackPurchase(selectedPackDetails);
          } else {
            console.log("Already Purchased");
          }
        }}
      />
    </Grid>
  );
};

export default GetPackCardsDetails;
