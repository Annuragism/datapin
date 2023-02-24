import React from "react";
import { TextField, InputLabel } from "@mui/material";
import StatusIcon from "../../common/status-icon/";

function VerifyBlock(props) {
  const {
    translate,
    verify,
    setDraw,
    setverifyFieldModal,
    setselectedVerifydata,
    handleChange,
    setFocus
  } = props;
  return (
    <div className="confirm-block">
      <div className="verify-block-heading" id="verify_form">
        {translate?.t("verify")}
      </div>
      {verify.length > 0 &&
        verify?.map((val, index) => {
          return (
            <div>
              <div className="not-confirm-feilds">
                <div className="field-card" key={index}>
                  <InputLabel>{translate?.t(val?.name)}</InputLabel>
                  <div className="d-flex">
                    <TextField
                      onFocus={(e) => {
                        setFocus(e.target.id)
                      }}
                      id={val.name}
                      style={{ width: "70%", margin: 5 }}
                      type="text"
                      variant="outlined"
                      placeholder={
                        val?.value !== ""
                          ? val?.value
                          : `${translate?.t(val?.name)}`
                      }
                      onClick={() => {
                        let ele = document.getElementById("verify_form");
                        ele?.scrollIntoView({
                          block: "start",
                          inline: "center",
                          behavior: "smooth",
                        });
                        setDraw(val);
                        setverifyFieldModal(true);
                        setselectedVerifydata(val);
                      }}
                      onChange={handleChange(val?.name)}
                      name={val?.name}
                      value={val?.value}
                    />
                    <div className="ml-10 d-flex-center">
                      <StatusIcon status={"verify"} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default VerifyBlock;
