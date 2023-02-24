import React from 'react'
import { TextField, InputLabel } from "@mui/material";
import StatusIcon from "../../common/status-icon/";

function ConfirmBlock(props) {

  const {
    translate,
    confirm,
    field,
    handleChange,
    setFocus
  } = props;



  return (
    <div className="confirm-block">
      <div className="confirm-block-heading">{translate?.t("confirm")}</div>
      {confirm?.length > 0 &&
        confirm?.map((val, i) => {
          return (
            <>
              <div className="confirm-feilds">
                <div className="field-card" key={i}>
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
                          : translate?.t(val?.name)
                      }
                      onChange={handleChange(val?.name)}
                      name={val?.name}
                      value={val?.value}
                    />

                    <div className="ml-10 d-flex-center">
                      <StatusIcon status={"confirm"} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}
    </div>
  );
}

export default ConfirmBlock