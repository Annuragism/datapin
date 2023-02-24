import React, { useEffect, useState } from "react";
import "./style.css";
//MUI Imports
import {
  InputAdornment,
  OutlinedInput,
  Typography,
  Box,
  Popover,
  Grid,
} from "@mui/material";
import { YesButton, NoButton } from "../../common/validation-button/";

//Icon Import
import SearchIcon from "@mui/icons-material/Search";
import deleteIcon from "../../assets/delete-icon.svg";
import filter from "../../assets/filter.svg";
//Import Shared Component

import StatusIcon from "../../common/status-icon/";
// Redux & Reducer Imports
// Services
import { deleteEntityCall } from "../../services/adminservices ";


const USER_ROLE = localStorage.getItem("role")?.toLowerCase();

function EntityAnalysisTable(props) {
  const {
    translate,
    history,
    tabIndex,
    setTabindex,
    analysis,
    selectedCase,
    setSelectedCase,
    caseData,
    setCasedata,
    handelSelectAllCheckBox,
    selectedAnalysis,
    setSelectedAnalysis,
    refreshData,
  } = props;

  const [entityTableData, setEntityTableData] = useState([]);
  useEffect(() => {
    setEntityTableData(caseData);
  }, [caseData]);

  const handelFilter = async (status) => {
    switch (status) {
      case "confirm":
        let confirmFilterData = caseData.filter(
          (item) => item.status === "confirm"
        );
        setEntityTableData(confirmFilterData);
        return;
      case "not_confirm":
        let notConfirmFilterData = caseData.filter(
          (item) => item.status === "not_confirm"
        );
        setEntityTableData(notConfirmFilterData);
        return;
      case "verify":
        let verifyFilterData = caseData.filter(
          (item) => item.status === "verify"
        );
        setEntityTableData(verifyFilterData);
        return;
      case "all":
        setEntityTableData(caseData);
        return;
      default:
        return;
    }
  };

  return (
    <div className="voz-analysis">
      <div className="analysis-table-container">
        <div className="analysis-header">
          <Grid container spacing={2}>
            <Grid item xs={8} md={8} xl={8}>
              <div className="vos-analysis-table-title">
                <div className="d-flex">
                  <div
                    className={`table-tab ${tabIndex === 1 && "active"}`}
                    onClick={() => {
                      handelFilter("all");
                      setTabindex(1);
                    }}
                  >
                    <div>{translate?.t("all")}</div>
                    <div
                      className={`${
                        tabIndex === 1 ? "tab-chip-active" : "tab-chip all"
                      }`}
                    >
                      {analysis && analysis?.allanalysis}
                    </div>
                  </div>
                  <div
                    className={`table-tab ${tabIndex === 2 && "active"}`}
                    onClick={() => {
                      handelFilter("confirm");
                      setTabindex(2);
                    }}
                  >
                    <div>{translate?.t("confirm")}</div>
                    <div
                      className={`${
                        tabIndex === 2 ? "tab-chip-active" : "tab-chip confirm"
                      }`}
                    >
                      {analysis && analysis?.confirm}
                    </div>
                  </div>
                  <div
                    className={`table-tab ${tabIndex === 3 && "active"}`}
                    onClick={() => {
                      handelFilter("not_confirm");
                      setTabindex(3);
                    }}
                  >
                    <div>{translate?.t("not_confirm")}</div>
                    <div
                      className={`${
                        tabIndex === 3
                          ? "tab-chip-active"
                          : "tab-chip not-confirm"
                      }`}
                    >
                      {analysis && analysis?.not_confirm}
                    </div>
                  </div>
                  <div
                    className={`table-tab ${tabIndex === 4 && "active"}`}
                    onClick={() => {
                      handelFilter("verify");
                      setTabindex(4);
                    }}
                  >
                    <div>{translate?.t("verify")}</div>
                    <div
                      className={`${
                        tabIndex === 4 ? "tab-chip-active" : "tab-chip verify"
                      }`}
                    >
                      {analysis && analysis?.verify}
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={4} md={4} xl={4} display="none">
              <div className="d-flex space-evenly">
                <div className="d-flex-center space-evenly cursor">
                  <img src={filter} alt="icon" />
                  <div className="ml-5"> {translate?.t("filter")}</div>
                </div>
                <div>
                  {" "}
                  <OutlinedInput
                    sx={{
                      width: 150,
                      borderRadius: 18,
                      borderColor: "#3A3868",
                    }}
                    placeholder={translate?.t("to_research")}
                    size="small"
                    variant="outlined"
                    onChange={(e) => {
                      // console.log(e);
                    }}
                    endAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
        <div className="voz-analysis-table">
          <div className="analysis-table-headings">
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 border-collapse">
                <thead className="border-b bg-transparent text-xs uppercase text-gray-700">
                  <tr>
                    <th>
                      <input
                        className="thead-checkbox"
                        checked={
                          selectedCase?.length === entityTableData?.length &&
                          selectedCase?.length !== 0
                        }
                        onChange={(e) => {
                          handelSelectAllCheckBox(e.target.checked);
                        }}
                        type="checkbox"
                      />
                    </th>
                    <th scope="col" className="py-3 px-4">
                      {translate?.t("case")}
                    </th>
                    <th scope="col" className="py-3 px-4 whitespace-nowrap">
                      {translate?.t("type_of_document")}
                    </th>
                    <th scope="col" className="py-3 px-4">
                      {translate?.t("status")}
                    </th>
                    <th scope="col" className="py-3 px-4">
                      {translate?.t("date")}
                    </th>
                    <th scope="col" className="py-3 px-4">
                      {translate?.t("action")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white cursor">
                  {/* Looping through the case data */}
                  {entityTableData.length > 0 &&
                    entityTableData?.map((val, index) => {
                      return (
                        <TR
                          {...props}
                          data={val}
                          key={index}
                          caseState={{
                            selectedCase: selectedCase,
                            setSelectedCase: setSelectedCase,
                            selectedAnalysis: selectedAnalysis,
                            setSelectedAnalysis: setSelectedAnalysis,
                          }}
                          cb={refreshData}
                        />
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntityAnalysisTable;

const TR = (props) => {
  const { translate, data, caseState, history,cb } = props;
  const [deleteEntity, setDeleteEntity] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handelSelectCheckBox = (checked, data) => {
    if (checked === true) {
      caseState?.setSelectedCase([...caseState.selectedCase, data]);
    } else {
      let filteredData = caseState?.selectedCase?.filter(
        (val) => data?.caseIndex !== val?.caseIndex
      );
      caseState?.setSelectedCase(filteredData);
    }
  };

  const handelEntityDelete = async (data) => {
    setDeleteEntity(data);
  };

  const handelDeleteEntity = async (data) => {
    let deleteResponse = await deleteEntityCall(data.id);
    if (deleteResponse?.status===200){
      cb();
      setAnchorEl(null)
    } 
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <tr
        className="table-data-border"
        onClick={() => {
          history.navigate(`detailed-analysis?id=${data?.uuuid}`);
        }}
      >
        <td
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <input
            type="checkbox"
            checked={caseState?.selectedCase.some(
              (val) => val.caseIndex === data?.caseIndex
            )}
            className="tbody-checkbox"
            onChange={(e) => {
              handelSelectCheckBox(e.target.checked, data);
            }}
          />
        </td>
        <td className="whitespace-nowrap py-3 px-4  font-medium text-gray-900">
          <div>
            {data?.new && (
              <div className="text-xs font-light uppercase text-[#8853CC]">
                {translate?.t("NEW")}
              </div>
            )}
            <div className="text-xl font-normal text-gray-500">
              {data?.name}
            </div>
            <div className="text-lg font-normal text-gray-500">
              {data?.documents} {translate?.t("documents")}
            </div>
          </div>
        </td>
        <td className="py-3 px-4 ">
          <div className="flex flex-wrap">
            {data?.type_of_documents.length > 0 &&
              data?.type_of_documents.map((item, keyIndex) => {
                return (
                  <span
                    key={keyIndex}
                    className="m-1  rounded-full border border-gray-300 p-3 d-flex-center"
                  >
                    {item?.name} &nbsp;&nbsp;
                    <StatusIcon status={item?.status} />
                  </span>
                );
              })}
          </div>
        </td>
        <td className="py-3 px-4 ">
          <StatusIcon status={data?.status} text={translate?.t(data?.status)} />
        </td>
        <td className="py-3 px-4 ">{data?.date}</td>
        <td className="py-3 px-4 ">
          <div className=" p-4 font-normal text-gray-500 d-flex">
            {/* <div className="analysis-table-action"> {translate?.t("export")}</div> */}
            <div
              className="analysis-table-action"
              onClick={() => {
                history.navigate(`detailed-analysis?id=${data?.uuuid}`);
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography> {translate?.t("view")}</Typography>
                {USER_ROLE === "admin" && (
                  <div
                    className="delete-icon"
                    style={{ marginLeft: 15 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setAnchorEl(e.currentTarget);
                      handelEntityDelete(data);
                    }}
                  >
                    <img src={deleteIcon} alt="delete-icon" title="delete" />
                  </div>
                )}
              </Box>
            </div>
          </div>
        </td>
      </tr>
      <Popover
        id={"simple-popover"}
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
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
          <Typography>Are you sure want to delete this entity ?</Typography>
          <Grid mt={2} display="flex" justifyContent="space-evenly">
            <Box>
              <YesButton
                text={translate?.t("yes")}
                onClick={() => {
                  handelDeleteEntity(data);
                }}
              />
            </Box>
            <Box>
              {" "}
              <NoButton
                text={translate?.t("no")}
                onClick={() => {
                  setAnchorEl(null);
                }}
              />
            </Box>
          </Grid>
        </Box>
      </Popover>
    </>
  );
};
