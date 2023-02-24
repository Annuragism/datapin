import {
  Box
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AnalysisLoader } from "../../common/loader";
import "./style.css";
//Components
import CurrentActiveSubscription from "./CurrentActiveSubscription";
import GetProductDetails from "./GetProductDetails";

//Services
import { loadStripe } from "@stripe/stripe-js";
import { getAllItems } from "../../services/services";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

function Subscription(props) {
  const { socket } = props;
  const [packs, setPacks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [showPlans, setShowPlans] = useState(true);

  useEffect(() => {
    getItemsDetails();
  }, []);
  //Socket
  useEffect(() => {
    socket.on("updateUserData", (data) => {
      console.log("updating user local storage", data);
      localStorage.setItem("user", JSON.stringify(data.data));
    });
  }, [socket]);

  const getItemsDetails = async () => {
    setLoading(true);
    let ItemData = await getAllItems();
    setLoading(false);
    let allItems = ItemData?.data?.plans;
    let filterPlansFromAllProducts =
      allItems?.length > 0
        ? allItems
            .filter((d) => d?.metadata?.type === "plan")
            .sort((a, b) => a?.metadata?.order - b?.metadata?.order)
        : [];
    let filterPacksFromAllProducts =
      allItems?.length > 0
        ? allItems
            .filter((d) => d?.metadata?.type === "pack")
            .sort((a, b) => a?.metadata.order - b?.metadata.order)
        : [];
    setPacks(filterPacksFromAllProducts);
    setPlans(filterPlansFromAllProducts);
    setShowPlans(
      currentSubscription !== null
        ? ItemData?.data?.currentSubscription?.isFree === true
          ? true
          : false
        : true
    );

    setCurrentSubscription(ItemData?.data?.currentSubscription);
  };

  return (
    <Box >
      {!loading ? (
        <Box>
          {/* <FreeTrialPopUp
              {...props}
              view={expiryPopup}
              setView={setExpiryPopup}
            /> */}
          {currentSubscription && (
            <CurrentActiveSubscription
              currentSubscription={currentSubscription}
              packs={packs}
              loading={loading}
              setLoading={setLoading}
              showPlans={showPlans}
              setShowPlans={setShowPlans}
              {...props}
            />
          )}
          {showPlans && (
            <GetProductDetails
              currentSubscription={currentSubscription}
              plans={plans}
              getItemsDetails={getItemsDetails}
              loading={loading}
              setLoading={setLoading}
              setShowPlans={setShowPlans}
              {...props}
            />
          )}
        </Box>
      ) : (
        <AnalysisLoader
          loading={loading}
          style={{
            position: "absolute",
            top: "calc(50% - 25px)",
            left: "calc(50% - 25px)",
            transform: "translate(-50%,-50%)",
          }}
        />
      )}
    </Box>
  );
}
export default Subscription;