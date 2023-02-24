import React, { useState, useMemo, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  Typography,
  Grid,
  Box,
  TextField,
  Tab,
  Tabs,
  Tooltip,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
//Services
import { createSubscription } from "../../services/services";
import PrimaryButton from "../../common/primary-button";
function CheckoutForm(props) {
  const {  getItemsDetails,plan } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState();
  const [priceId, setPriceId] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const useOptions = () => {
    const options = {
      hidePostalCode: true,
      style: {
        base: {
          color: "#32325d",
          fontFamily: "Arial, sans-serif",
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#32325d",
          },
        },
        invalid: {
          fontFamily: "Arial, sans-serif",
          color: "#fa755a",
          iconColor: "#fa755a",
        },
      },
    };

    return options;
  };
  const USER_DETAILS = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    setName(`${USER_DETAILS?.firstName} ${USER_DETAILS?.lastName}`);
    setEmail(USER_DETAILS?.email);
    setUserId(USER_DETAILS?._id);
    
  }, []);

  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  const subscribe = async () => {
    try {
      console.log(error);
      if (error == null || error?.complete === "true") {
        setLoading(true);
        // create a payment method
        const paymentMethod = await stripe?.createPaymentMethod({
          type: "card",
          card: elements?.getElement(CardElement),
          billing_details: {
            name,
            email,
          },
        });

        console.log(
          JSON.stringify(
            {
              payment: paymentMethod,
              paymentMethod: paymentMethod?.paymentMethod?.id,
              name,
              email,
              userId,
              // priceId,
            },
            null,
            2
          )
        );
        // call the backend to create subscription
        const response = await createSubscription({
          paymentMethod: paymentMethod?.paymentMethod?.id,
          name,
          email,
          userId,
          plan,
          // priceId,
          // itemId,
        });
        setLoading(false);

        const confirmPayment = await stripe?.confirmCardPayment(
          response?.data?.clientSecret
        );
        console.log(confirmPayment);

        if (confirmPayment?.error) {
          alert(confirmPayment.error.message);
        } else {
          alert("Subscription created Successfully !");
          getItemsDetails();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      {/* <Select // this should not be a text field. maybe a radio button ro something
        placeholder="Price Id"
        value={priceId}
        fullWidth
        onChange={(e) => setPriceId(e.target.value)}
      >
        {products.map((prod, index) => {
            return <MenuItem value={prod.id}>{prod?.name}</MenuItem>;
        })}
      </Select>
      <br /> */}
      <TextField
        placeholder="Name"
        type="text"
        value={name}
        sx={{ mt: 2 }}
        fullWidth
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <TextField
        placeholder="Email"
        type="text"
        value={email}
        fullWidth
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mt: 2 }}
      />
      <br />
      <Box>
        Card details
        <CardElement
          options={options}
          onReady={() => {
            console.log("CardElement [ready]");
          }}
          onChange={(event) => {
            console.log("CardElement [change]", event);
            !touched && setTouched(true);
            if (event.error) {
              setError(event);
            }
            if (event.complete === true) {
              setError(null);
            }
          }}
          onBlur={() => {
            console.log("CardElement [blur]");
          }}
          onFocus={() => {
            console.log("CardElement [focus]");
          }}
          // onClick={() => {
          //   subscribe();
          // }}
        />
        {error && touched && (
          <Typography sx={{ color: "red" }}>{error?.error?.message}</Typography>
        )}
      </Box>
      <PrimaryButton
        onClick={() => {
          subscribe();
        }}
        disable={
          (!name ||
            !email ||
            error?.empty === true ||
            error === null ||
            error?.complete === false) &&
          !touched
            ? true
            : false
        }
        style={{ height: "50px" }}
        sx={{ mt: 2 }}
        loading={loading}
      >
        {`Subscribe`}
      </PrimaryButton>
    </Box>
  );
}

export default CheckoutForm;
