import { Typography } from '@mui/material'
import React,{useState} from 'react';
import {Dialog,Button,
DialogTitle,
DialogContent,
DialogActions} from "@mui/material";
import PrimaryButton from '../../common/primary-button';

function FreeTrialPopUp(props) {
  const {history ,translate , view , setView } = props;
  const userDetails = JSON.parse(localStorage.getItem('user'))
 
    const handelClose = ()=>{
setView(false);
    }
        const handelOpen = () => {setView(true);};
  return (
    <>
      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="xs"
        open={view}
      >
        <DialogTitle>Hey {userDetails?.firstName} !</DialogTitle>
        <DialogContent>{translate?.t("free_plan_expiry_text")}</DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <PrimaryButton
            text={translate?.t("lets_go")}
            sx={{ height: 15 }}
            autoFocus
            onClick={() => {
              //Navigation
              handelClose();
              history?.navigate("mangement-settings?t=3");
            }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FreeTrialPopUp