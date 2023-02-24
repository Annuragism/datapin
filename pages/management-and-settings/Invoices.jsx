import React, { useEffect, useState } from "react";
import { Box, Grid, IconButton } from "@mui/material";

//Services
import { fetchInvoiceData } from "../../services/services";
import { AnalysisLoader } from "../../common/loader";
import { Typography } from "@mui/material";
import DownloadSharpIcon from "@mui/icons-material/DownloadSharp";
import MUIDataTable from "mui-datatables";
import moment from "moment";
 
function Invoices(props) {
  const { translate, history } = props;
  const [txnList, setTxnList] = useState([]);
  const [loading, setLoading] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getInvoiceData();
  }, []);

  const getInvoiceData = async () => {
    setLoading(true);
    const UserId = userDetails?._id;
    let response = await fetchInvoiceData(UserId);
    setLoading(false);
    if (response?.status === 200) {
      setTxnList(response?.data);
    }
  };

  const handelInvoiceDownload = async (data) => {
    const link = document.createElement("a");
    link.href = data?.invoice_pdf;
    link.setAttribute("download", `${data?.number}_invoice.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };


  const columns = [
    {
      name: "id",
      label: "Id",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "customer_name",
      label: "Name",
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
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Typography
              sx={{
                color: value === "paid" ? "#0b7e0b" : "#F00",
              }}
            >
              {value === "paid" ? "Success" : "Failed"}
            </Typography>
          );
        },
      },
    },
    {
      name: "created",
      label: translate?.t("created_at"),
      options: {
        sort: false,
        // customHeadRender: (columnMeta, handleToggleColumn, sortOrder) => {
        //   return (
        //     <TableCell align="center">
        //       <TableSortLabel>Actions</TableSortLabel>
        //     </TableCell>
        //   );
        // },
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Typography>{moment.unix(value).format("MM/DD/YYYY")}</Typography>
          );
        },
      },
    },
    {
      name: "attempted",
      label: translate?.t("Action"),
      options: {
        sort: false,
        // customHeadRender: (columnMeta, handleToggleColumn, sortOrder) => {
        //   return (
        //     <TableCell align="center">
        //       <TableSortLabel>Actions</TableSortLabel>
        //     </TableCell>
        //   );
        // },
        customBodyRender: (value, tableMeta, updateValue) => {
          return <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                handelInvoiceDownload(txnList[tableMeta?.columnIndex]);
              }}
            >
              <DownloadSharpIcon sx={{ color: "#000" }} />
            </IconButton>;
        },
      },
    },
  ];

  const options = {
    search: true,
    selectableRowsHideCheckboxes: false,
    selectableRows: "none",
    download: false,
    print: false,
    viewColumns: false,
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
    tableBodyHeight:'50vh',
    onRowClick: (_rowData, rowMeta, _e) => {},
  };



  return (
    <Box>
      {loading ? (
        <AnalysisLoader
          loading={loading}
          style={{
            top: "calc(50% - 25px)",
            left: "calc(50% - 25px)",
            position: "absolute",
            transform: "translate(-50%, -50%)",
          }}
        />
      ) : (
        <Box m={2}>

          <MUIDataTable
            title={
              <Typography
                sx={{ fontFamily: "Larken", color: "#000", m: 2, fontSize: 25 }}
                variant="h5"
              >
                {translate?.t("invoices")}
              </Typography>
            }
            data={txnList}
            columns={columns}
            options={options}
            loading={loading}
          />
        </Box>
      )}
    </Box>
  );
}

// (
//   <Box >
//     <Grid>
//       <Typography
//         sx={{
//           fontFamily: "Larken",
//           color: "#000",
//         }}
//       >
//         Invoice
//       </Typography>
//     </Grid>
//     <Box mt={2}>
//       {txnList.length > 0 ? (
//         txnList?.map((txn, index) => (
//           <Box
//             key={index}
//             sx={{
//               background: "rgb(0,0,0,0.04)",
//               p: 1,
//               m: 1,
//               borderRadius: 3,
//               border: "1px solid #8853CC",
//               // borderRight: "1px solid #8853CC",
//               // borderLeftColor: `${txn?.paid === true ? "#0F0" : "#F00"}`,
//               // borderRightColor: `${txn?.paid === true ? "#0F0" : "#F00"}`,
//               display: "flex",
//               flexWrap: "wrap",
//               justifyContent: "space-between",
//             }}
//           >
//             <Typography> {index + 1}.</Typography>
//             <Typography> {txn?.customer_name}</Typography>
//             <Typography
//               sx={{
//                 color: `${txn?.paid === true ? "#0b7e0b" : "#F00"}`,
//               }}
//             >
//               {txn?.paid === true ? "Success" : "Failed"}
//             </Typography>
//             <Typography>
//               {" "}
//               {txn?.currency === "eur" && "€"}
//               {txn?.amount_paid / 100}
//             </Typography>
//             <IconButton
//               color="primary"
//               aria-label="upload picture"
//               component="label"
//               sx={{ cursor: "pointer" }}
//               onClick={() => {
//                 handelInvoiceDownload(txn);
//               }}
//             >
//               <DownloadSharpIcon sx={{ color: "#000" }} />
//             </IconButton>
//             <Typography>
//               {" "}
//               {new Date(txn?.created * 1000).toLocaleDateString("default")}
//             </Typography>
//           </Box>
//         ))
//       ) : (
//         <Typography>No Data Found</Typography>
//       )}
//     </Box>
//   </Box>
// )
export default Invoices;
