import React from "react";
import { Typography, Modal, Box, Button, Grid } from "@mui/material";
import  PrimaryButton from '../../common/primary-button'
function ErrorModal({ open, handelErrorModal,data,...props }) {
  const {translate} = props;
  return (
    <>
      <Modal
        open={open}
        onClose={handelErrorModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            height: "30%",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 1,
          }}
        >
          {data?.code === 403 ? (
            <Box m={1} textAlign="center" sx={{ padding: 8 }}>
              <Typography
                sx={{
                  height: "50px",
                }}
                id="modal-modal-title"
                variant="h6"
                component="h2"
              >
                {translate?.t("unauthorized")}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                You are not authorized to perform this operation
              </Typography>
              <PrimaryButton
                variant="outlined"
                style={{ marginTop: "35px" }}
                onClick={() => {
                  handelErrorModal();
                }}
              >
                Okay
              </PrimaryButton>
            </Box>
          ) : (
            <Box className="">
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{
                  height: "50px",
                  backgroundColor: "#f6f6ff",
                  p: 2,
                }}
              >
                {translate?.t("error")}
              </Typography>
              <Grid item sx={{ p: 4 }}>
                <Grid xl={12} md={12} xs={12}>
                  <Typography
                    id="modal-modal-description"
                    sx={{
                      mt: 2,
                    }}
                  >
                    {translate?.t("job_error_modal_description")}{" "}
                    <a href="mailto:support@datakeen.co">support@datakeen.co</a>{" "}
                    {translate?.t("okay")}
                  </Typography>
                </Grid>
                <Grid
                  xl={12}
                  md={12}
                  xs={12}
                  sx={{ mt: 4 }}
                  display={"flex"}
                  justifyContent={"center"}
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handelErrorModal();
                    }}
                  >
                    {translate?.t("okay")}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default ErrorModal;
