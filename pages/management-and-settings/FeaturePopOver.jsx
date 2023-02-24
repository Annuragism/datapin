import {
  Popover, Typography
} from "@mui/material";
import React from "react";
import "./style.css";

const FetauresPopOver = (props) => {
  const { translate, history, data, popAnchorEl, setPopAnchorEl } = props;
  const open = Boolean(popAnchorEl);
  const descData = data?.split(",");
  return (
    <Popover
      id="mouse-over-popover"
      sx={{
        pointerEvents: "none",
      }}
      open={open}
      anchorEl={popAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={() => setPopAnchorEl(null)}
      disableRestoreFocus
    >
      {descData.length > 0 &&
        descData.map((d, i) => {
          return <Typography sx={{ p: 1 }}>{d}</Typography>;
        })}
    </Popover>
  );
};

export default FetauresPopOver;
