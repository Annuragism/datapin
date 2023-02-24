import React, { useEffect, useState, useRef } from "react";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { AnalysisLoader } from "../../common/loader";
import StatusIcon from "../../common/status-icon/";
import {
  Typography,
  Box,
  IconButton,
  Button,
  TableCell,
  TableSortLabel,
  Chip,
  Grid,
} from "@mui/material";
import NewTemplate from "../admin-dashboard/newTemplate";
import Dailog from "../../common/dailog";
import {
  getAnalysisTemplateByGroup,
  updateAnalysisTemplateStatus,
  makeTemplateDefault,
} from "../../services/adminservices ";
import PrimaryButton from "../../common/primary-button";
//Icons
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

function AnalysisTemplates(props) {
  const { translate, history } = props;
  const [templateData, setTemplateData] = useState([]);
  const [updateTemplatePopup, setUpdateTemplatePopup] = useState(false);
  const [addTemplatePopup, setAddTemplatePopup] = useState(false);
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);
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
  const [loading, setloading] = React.useState(false);
  const analysisRef = useRef(null);

  //Fetching User details from the Loacal storage
  const userDetails = JSON.parse(localStorage.getItem("user"));

  //Fetch All Group's Analysis Template By
  const getAnalysisTemplates = async () => {
    setloading(true);
    let response = await getAnalysisTemplateByGroup(userDetails?.groupId);
    setTemplateData(response?.data);
    setloading(false);
  };
  useEffect(() => {
    getAnalysisTemplates();
  }, []);
   
  const updateAnalysisStatus = async (id, status) => {
    let response = await updateAnalysisTemplateStatus({
      status: status,
      template_id: id,
    });
    if (response?.status === 200) {
      getAnalysisTemplates();
    }
  };
    const handelSetasDefaultAction = async (id) => {
      let response = await makeTemplateDefault(id);
      if (response?.status === 200) {
        getAnalysisTemplates();
      }
    };
   

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
    {
      name: "name",
      label: translate?.t("name"),
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Typography className="text-xl font-normal text-gray-500">
              {value}
            </Typography>
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
            <Box sx={{
              display:'flex',
              flexDirection:'column',
              justifyContent: 'space-evenly',
              alignItems:'center'
            }}>
              <StatusIcon
                status={
                  tdata[dataIndex]?.status === "active"
                    ? "confirm"
                    : "not_confirm"
                }
                text={translate?.t(tdata[dataIndex]?.status)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (tdata[dataIndex]?.status === "error") {
                    setAnchorEl(e.currentTarget);
                    analysisRef.current = tdata[dataIndex];
                  }
                }}
                />
              <Typography
                display={templateData[dataIndex].default == false && "none"}
                title="Default"
                >
                <Chip
                  label="Default"
                  size="small"
                  color="primary"
                  variant="contained"
                />
              </Typography>
            </Box>
          );
        },
      },
    },
    {
      name: "Actions",
      label: translate?.t("action"),
      options: {
        sort: false,
        customHeadRender: (columnMeta, handleToggleColumn, sortOrder) => {
          return (
            <TableCell align="center">
                Actions
            </TableCell>
          );
        },
        customBodyRenderLite: (dataIndex) => {
          return (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="outlined"
                size="small"
                sx={{ height: 40, m: 1 }}
                onClick={() => {
                  setSelectedTemplateData(templateData[dataIndex]);
                  setUpdateTemplatePopup(true);
                }}
              >
                Modify
              </Button>

              <Button
                size="small"
                sx={{ height: 40, m: 1 }}
                variant="outlined"
                onClick={() => {
                  let param =
                    templateData[dataIndex]?.status === "active"
                      ? "inactive"
                      : "active";
                  updateAnalysisStatus(templateData[dataIndex]?._id, param);
                }}
              >
                {templateData[dataIndex]?.status === "active"
                  ? "Deactive"
                  : "Active"}
              </Button>

              {templateData[dataIndex]?.default === false && (
                <Button
                  size="small"
                  sx={{ height: 40, m: 1 }}
                  variant="outlined"
                  onClick={() => {
                    handelSetasDefaultAction(templateData[dataIndex]?._id);
                  }}
                >
                  set as Default
                </Button>
              )}
            </Box>
          );
        },
      },
    },
  ];

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

    },
  };

  const tdata = templateData;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Grid>
          <Typography sx={{ fontFamily: "Larken" }} variant="h4">
            {translate?.t("analysis-templates")}
          </Typography>
        </Grid>
        <Grid>
          <PrimaryButton
            onClick={() => {
              setAddTemplatePopup(true);
            }}
            style={{ height: "50px" }}
            text={"Add Template"}
          />
        </Grid>
      </Box>
      <MUIDataTable
        title={
          <Typography variant="h5">
            {translate?.t("analysis-templates")}
          </Typography>
        }
        data={tdata}
        columns={columns}
        options={options}
        loading={loading}
      />
      {updateTemplatePopup === true && (
        <Dailog
          props={props}
          data={selectedTemplateData}
          open={updateTemplatePopup}
          setOpen={setUpdateTemplatePopup}
          Component={NewTemplate}
          cb={getAnalysisTemplates}
        />
      )}
      {addTemplatePopup === true && (
        <Dailog
          props={props}
          open={addTemplatePopup}
          setOpen={setAddTemplatePopup}
          Component={NewTemplate}
          cb={getAnalysisTemplates}
        />
      )}
    </Box>
  );
}

export default AnalysisTemplates;
