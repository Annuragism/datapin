import "react-credit-cards/es/styles-compiled.css";
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import Cards from "react-credit-cards";
//Services
import { fetchBiilingInformation } from "../../services/services";
import { AnalysisLoader } from "../../common/loader";

function BillingDetails(props) {
  const { tranlate, history } = props;
  const [billingInfo, setBillingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getBillingInfo();
  }, []);


  const getBillingInfo = async () => {
    setLoading(true);
    const UserId = userDetails?._id;
    let response = await fetchBiilingInformation(UserId);
    setLoading(false);
    if (response?.status === 200) {
      setBillingInfo(response?.data);
    }
  };

  return (
    <Box>
      <Grid>
        <Typography sx={{ fontFamily: "Larken", fontSize: 20, color: "#000" }}>
          Billing Information
        </Typography>
      </Grid>
      {loading ? (
        <AnalysisLoader loading={loading} />
      ) : (
        <Box m={5}>
          {billingInfo ?
          <>
          <Cards
          cvc={"***"}
          expiry={`0${billingInfo?.card?.exp_month}/${billingInfo?.card?.exp_year}`}
          focused={true}
          name={`  ${billingInfo?.billing_details?.name}`}
          number={`************${billingInfo?.card?.last4}`}
          preview={true}
          />
          <Box m={5}>
            <Typography>Name:{billingInfo?.billing_details?.name}</Typography>
            <Typography>Email:{billingInfo?.billing_details?.email}</Typography>
          </Box>
          </>
          :
          <Typography>No data found</Typography>
          }
        </Box>
      )}
    </Box>
  );
}

export default BillingDetails;
