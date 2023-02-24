import React, { useState } from "react";
import "./style.css";
import moment from "moment";
//Icon Import
import SearchIcon from "@mui/icons-material/Search";
import filter from "../../assets/filter.svg";

//Import Shared Component
import StatusIcon from "../../common/status-icon/";
import { AnalysisLoader } from "../../common/loader";

//MUI Imports
import { InputAdornment, OutlinedInput } from "@mui/material";
import { Grid, Modal, Box } from "@mui/material";
import StepFour from "../new-analysis/StepFour";
function DashbaordTable(props) {
  const { translate, dashboardData } = props;
  const [statusModal, setStatusModal] = useState(false);

  const handelStatusModal = () => {
    setStatusModal(!statusModal);
  };



  return (
    <div>
      {statusModal && (
        <Modal
          open={statusModal}
          onClose={handelStatusModal}
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

      {/* Voz Analyses */}
      <div className="voz-analysis">
        <div className="voz-analysis-header">
          <Grid container spacing={2}>
            <Grid item xs={8} md={8} xl={8} className="d-flex-left">
              <div className="vos-analysis-table-title">
                {translate?.t("your_analyzes")}
              </div>
            </Grid>
            <Grid item xs={4} md={4} xl={4}>
              <div className="d-flex space-evenly">
                <div className="d-flex-center space-evenly cursor">
                  <img src={filter} alt="icon" />
                  <div className="ml-5"> Filtrer par</div>
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
                      console.log(e);
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
          <div className="voz-analysis-table-headings p-30">
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 border-collapse">
                <thead className="border-b bg-transparent text-xs uppercase text-gray-700">
                  <tr>
                    <th scope="col" className="py-3 px-4">
                      {translate?.t("Analysis")}
                    </th>
                    <th scope="col" className="py-3 px-4 whitespace-nowrap">
                      {translate?.t("type_of_document")}
                    </th>
                    <th scope="col" className="py-3 px-4">
                      {translate?.t("status")}
                    </th>
                    <th scope="col" className="py-3 px-4">
                      {translate?.t("pieces_legales")}
                    </th>
                    <th scope="col" className="py-3 px-4">
                      {translate?.t("import_date")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white cursor">
                  {dashboardData?.analysis?.length > 0 &&
                    dashboardData?.analysis?.map((val, index) => {
                      return (
                        <TR
                          {...props}
                          dashboardData={dashboardData}
                          tdata={val}
                          keyIndex={index}
                          key={index}
                          statusModal={handelStatusModal}
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

export default DashbaordTable;

const TR = (props) => {
  const { tdata, keyIndex, statusModal ,translate} = props;
  return (
    <tr
      className={`table-data-border ${
        tdata?.status === "PENDING" ? "opacity" : ""
      }`}
      onClick={() => {
        if (tdata?.status !== "PENDING") {
          props?.history?.navigate(`analysis?id=${tdata?._id}`);
        } else {
          statusModal();
        }
      }}
      key={keyIndex}
    >
      <td className="whitespace-nowrap py-3 px-4  font-medium text-gray-900">
        <div>
          {keyIndex + 1 === 1 && (
            <div className="text-xs font-light uppercase text-[#8853CC]">
              NOUVEAU
            </div>
          )}
          <div className="text-xl font-normal text-gray-500">{tdata?.name}</div>
          <div className="text-lg font-normal text-gray-500">
            {tdata?.numberOfDocuments} documents
          </div>
        </div>
      </td>
      <td className="py-3 px-4 ">
        <div className="flex flex-wrap">
          {tdata?.status === "PENDING" ? (
            <AnalysisLoader loading={true} size={25} />
          ) : tdata?.documentTypes?.length > 0 ? (
            tdata?.documentTypes.map((val, i) => (
              <span
                key={i}
                className="m-1 rounded-full border border-gray-300 p-3 d-flex"
              >
                {val} &nbsp;&nbsp;
              </span>
            ))
          ) : (
            "NA"
          )}
        </div>
      </td>
      <td className="py-3 px-4 ">
        <div className="text-xl p-4 font-normal text-gray-500 d-flex">
          {tdata?.status === "PENDING" ? (
            <AnalysisLoader
              loading={tdata?.status === "PENDING" ? true : false}
              size={25}
            />
          ) : (
            <StatusIcon
              status={tdata?.status}
              text={translate?.t(tdata?.status)}
              onClick={(e) => {
                e.stopPropagation();
                console.log("Hello there !");
              }}
            />
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        {tdata?.status === "PENDING" ? (
          <AnalysisLoader loading={true} size={25} />
        ) : (
          "--"
        )}
      </td>
      <td className="py-3 px-4 ">
        {moment(tdata?.createdAt).format("DD/MM/YYYY")}
      </td>
    </tr>
  );
};
