/* eslint-disable */
import React, { useState, useRef } from "react";
import MUIDataTable from "mui-datatables";

import { Typography, Avatar } from "@mui/material";
import moment from "moment";
import { AnalysisLoader } from "../../common/loader";
import StatusIcon from "../../common/status-icon/";
import StepFour from "../new-analysis/StepFour";
import Popover from "@mui/material/Popover";
import ReplayIcon from "@mui/icons-material/Replay";
import deleteIcon from "../../assets/delete-icon.svg";
import { deleteAnalysis, reRunAnalaysis } from "../../services/adminservices ";
import { YesButton, NoButton } from "../../common/validation-button/";
import { Grid, Modal, Box,IconButton,Button } from "@mui/material";

const USER_ROLE = localStorage.getItem("role")?.toLowerCase();

function AnalysisTable(props) {
  const { dashboardData, translate, refreshTable,history } = props;
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("50vh");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [searchBtn, setSearchBtn] = useState(true);
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [printBtn, setPrintBtn] = useState(false);
  const [viewColumnBtn, setViewColumnBtn] = useState(false);
  const [filterBtn, setFilterBtn] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [statusModle, setstatusModle] = useState(false);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const deleteRef = useRef(null);
  const analysisRef = useRef(null);

  const columns = [
    {
      name: "_id",
      label: "Id",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "name",
      label: translate?.t("Analysis"),
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          // console.log(tableMeta);
          return (
            <div>
              {tableMeta?.rowData[0] == tdata[0]._id && (
                <div className="text-xs font-light uppercase text-[#8853CC]">
                  {translate?.t("new")}
                </div>
              )}
              <div className="text-xl font-normal text-gray-500">{value}</div>
              <div className="text-lg font-normal text-gray-500">
                {tableMeta?.rowData[4]} {translate?.t("documents")}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "documentType",
      label: translate?.t("type_of_document"),
      options: {
        filter: true,
        sort: false,
        customFilterListOptions: {
          render: (v) => {
            return ["a", "aa", "aaa"];
          },
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box display={'flex'}>
              {tdata[tableMeta.rowIndex]?.status === "PENDING" ? (
                <AnalysisLoader loading={true} size={25} />
              ) : tdata[tableMeta.rowIndex]?.documentTypes?.length > 0 ? (
                tdata[tableMeta.rowIndex]?.documentTypes.map((val, i) => (
                  <Box
                    key={i}
                    sx={{
                      border: "1px solid #000",
                      borderRadius: 25,
                      display: "flex",
                      justifyContent: "space-evenly",
                      p: 1,m:1,whiteSpace: 'nowrap',
                    }}
                    // className="m-1 rounded-full border border-gray-300 p-3 d-flex"
                  >
                    {translate?.t(val)} &nbsp;&nbsp;
                  </Box>
                ))
              ) : (
                "NA"
              )}
            </Box>
          );
        },
      },
    },
    {
      name: "status",
      label: translate?.t("status"),
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          return (
            <div>
              {tdata[dataIndex]?.status === "PENDING" ? (
                <AnalysisLoader
                  loading={
                    tdata[dataIndex]?.status === "PENDING" ? true : false
                  }
                  size={25}
                />
              ) : (
                <StatusIcon
                  status={tdata[dataIndex]?.status}
                  text={translate?.t(tdata[dataIndex]?.status)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tdata[dataIndex]?.status === "error") {
                      setAnchorEl(e.currentTarget);
                      analysisRef.current = tdata[dataIndex];
                    }
                  }}
                />
              )}
            </div>
          );
        },
      },
    },
    {
      name: "numberOfDocuments",
      label: translate?.t("pieces_legales"),
      options: {
        filter: false,
        sort: false,
        display: false,

        customBodyRenderLite: (dataIndex) => {
          return <div className="d-flex-center">--</div>;
        },
      },
    },
    {
      name: "createdAt",
      label: translate?.t("import_date"),
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return moment(value).format("DD/MM/YYYY");
        },
      },
    },
  ];

  const handelDeleteAnalysis = async (value) => {
    let analysisId = value?.rowData[0];
    let response = await deleteAnalysis(analysisId);
    console.log(response);
    if (response?.status === 200) {
      setAnchorEl2(null);
      refreshTable();
    }
  };

  const rerunTheAnalysis = async () => {
    console.log(analysisRef?.current);
    const rerunResponse = await reRunAnalaysis(analysisRef?.current?._id);
    console.log(rerunResponse);
    if (rerunResponse?.status === 200){
      refreshTable();
    } 
  };


  const adminDeleteAction = {
    name: "Action",
    label: translate?.t("Actions"),
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {USER_ROLE === "admin" && (
                <div
                  className="delete-icon"
                  style={{ marginLeft: 15 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setAnchorEl2(e.currentTarget);
                    deleteRef.current = tableMeta;
                    // handelDeleteAnalysis(tableMeta);
                  }}
                >
                  <img src={deleteIcon} alt="delete-icon" title="delete" />
                </div>
              )}
            </Box>
          </>
        );
      },
    },
  };
  const adminUserDisplay = {
    name: "user",
    label: translate?.t("created_by"),
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <Avatar
            sx={{
              width: 20,
              height: 20,
              p: 1,
              bgcolor: `#${Math.floor(Math.random() * 999) + 10}`,
            }}
            title={`${value?.firstName} ${value?.lastName}`}
          >
            <Typography>
              {`${value?.firstName[0]}${value?.lastName[0]}`}
            </Typography>
          </Avatar>
        );
      },
    },
  };

  if (USER_ROLE === "admin") {
    columns.push(adminUserDisplay, adminDeleteAction);
  }
  const options = {
    search: searchBtn,
    selectableRowsHideCheckboxes: false,
    selectableRows: "none",
    download: downloadBtn,
    print: printBtn,
    viewColumns: viewColumnBtn,
    filter: filterBtn,
    filterType: "dropdown",
    responsive: "standard",
    tableBodyHeight,
    tableBodyMaxHeight,
    onRowClick: (_rowData, rowMeta, _e) => {
      if (tdata[rowMeta.dataIndex]?.status === "PENDING") {
        setstatusModle(true);
      } else if (tdata[rowMeta.dataIndex]?.status === "error") {
      } else {
        if (tdata[rowMeta.dataIndex].entity.length === 1) {
          if (tdata[rowMeta.dataIndex].entity[0]?.document.length === 1) {
            let DocId = tdata[rowMeta.dataIndex].entity[0]?.document[0]._id;
            history?.navigate(`analysis-verification?id=${DocId}`);
          } else {
            history.navigate(
              `detailed-analysis?id=${
                tdata[rowMeta.dataIndex].entity[0]?.document[0]?.entityId
              }`
            );
          }
        } else {
          history?.navigate(`analysis?id=${tdata[rowMeta.dataIndex]._id}`);
        }
      }
    },
  };

  const tdata = dashboardData?.analysis;
  return (
    <>
      {/* <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}> */}

      <MUIDataTable
        title={
          <Typography variant="h5">{translate?.t("your_analyzes")}</Typography>
        }
        data={tdata}
        columns={columns}
        options={options}
      />
      {/* </div> */}
      {statusModle && (
        <Modal
          open={statusModle}
          onClose={() => {
            setstatusModle(false);
          }}
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
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 1,
            }}
          >
            <StepFour {...props} />
          </Box>
        </Modal>
      )}
      <Popover
        id={"simple-popover"}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Grid display={"flex"} justifyContent="center">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            onClick={()=>{
              setAnchorEl(null);
              rerunTheAnalysis()
            }}
          >
            <ReplayIcon />
          </IconButton>
          <Typography sx={{ p: 2 }}> {translate?.t("re_run")}</Typography>
           {/* <Button variant="outlined" startIcon={<ReplayIcon />}>
             {translate?.t("re_run")}
           </Button> */}
        </Grid>
      </Popover>
      <Popover
        id={"simple-popover"}
        open={Boolean(anchorEl2)}
        anchorEl={anchorEl2}
        onClose={() => {
          setAnchorEl2(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          borderRadius: 15,
        }}
      >
        <Box
          p={2}
          sx={{
            color: "#000",
            // background: "rgba(255, 188, 30, 0.48)",
            borderRadius: 5,
          }}
        >
          <Typography>Are you sure want to delete this Analysis ?</Typography>
          <Grid mt={2} display="flex" justifyContent="space-evenly">
            <Box>
              <YesButton
                text={translate?.t("yes")}
                onClick={(e) => {
                  handelDeleteAnalysis(deleteRef.current);
                }}
              />
            </Box>
            <Box>
              {" "}
              <NoButton
                text={translate?.t("no")}
                onClick={(e) => {
                  // e.stopPropagation();
                  // e.preventDefault();
                  setAnchorEl2(null);
                }}
              />
            </Box>
          </Grid>
        </Box>
      </Popover>
    </>
  );
}

export default React.memo(AnalysisTable);
