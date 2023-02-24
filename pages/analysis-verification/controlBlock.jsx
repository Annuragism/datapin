import React from 'react'
import PrimaryButton from '../../common/primary-button';
import StatusIcon from "../../common/status-icon/";
import { Grid } from "@mui/material";
import { confirmControles } from "../../services/services";

function ControlBlock(props) {
  const { field, translate, docId, getDocumentsFields } = props;

  const hadelConfirmControls = async (docId) => {
    console.log(docId);
    let result = await confirmControles(docId);
    console.log(result)
    if (result?.status === 200) {
      getDocumentsFields();
    }
  }
  return (
    <>
      {field?.controls && (
        <div className="control-block-container">
          <div className="control-block-heading">
            {translate?.t("controles")}
          </div>
          {Object.keys(field?.controls)?.map((v, i) => {
            return (
              <div>
                <div className="control-block d-flex">
                  <div className="w-75">{translate?.t(v)}</div>
                  <div>
                    <StatusIcon
                      status={field?.controls[v].value === true
                        ? "confirm"
                        : "verify"} onClick={undefined} />
                  </div>
                </div>
              </div>
            );
          })}
          <Grid align="left" display={field?.allControlsTrue ? "none" : ""}
          style={{marginRight: 'calc( 25% - 25px )'}}
          >
            <PrimaryButton
              variant="outlined"
              style={{ marginTop: 10, marginLeft: 0, height: 55, width: 200, textTransform: 'capitalize' }}
              text={translate?.t("confirm_controls")}
              onClick={() => {
                hadelConfirmControls(docId);
              }}
            />
          </Grid>
        </div>
      )}
    </>
  );
}

export default ControlBlock