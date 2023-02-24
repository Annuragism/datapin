import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
// import { styled } from "@mui/material/styles";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import Dailog from "../../common/dailog";
import PrimaryButton from "../../common/primary-button";
import AddUser from "./addUser";
// Services
import { getAllUserList } from "../../services/adminservices ";

function UserList(props) {
  const { translate } = props;
  const [userList, setUserList] = useState([]);
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("50vh");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [searchBtn, setSearchBtn] = useState(true);
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [printBtn, setPrintBtn] = useState(false);
  const [viewColumnBtn, setViewColumnBtn] = useState(false);
  const [filterBtn, setFilterBtn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);
  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = async () => {
    setLoading(true);
    let response = await getAllUserList();
    setLoading(false);
    let refinedTableData = response?.data.map((v, i) => {
      return { id: i + 1, ...v };
    });
    setUserList(refinedTableData);
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
      name: "firstName",
      label: translate?.t("firstName"),
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
      name: "lastName",
      label: translate?.t("lastName"),
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <Typography>{value}</Typography>;
        },
      },
    },
    {
      name: "email",
      label: translate?.t("Email"),
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
          return <Typography>{value}</Typography>;
        },
      },
    },
    {
      name: "role",
      label: translate?.t("role"),
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <Typography>{value}</Typography>
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
    onRowClick: (_rowData, rowMeta, _e) => {},
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
             mb:2
          }}
        >
          <Grid>
            <Typography sx={{ fontFamily: "Larken" }} variant="h4">
              {translate?.t("user_list")}
            </Typography>
          </Grid>
          <Grid>
            <PrimaryButton
              onClick={() => setOpenAddUser(true)}
              style={{ height: "50px" }}
              text={translate?.t("add_user")}
            />
          </Grid>
        </Box>
          <MUIDataTable
            title={
              <Typography variant="h5">{translate?.t("user_list")}</Typography>
            }
            data={userList}
            columns={columns}
            options={options}
            loading={loading}
          />
      </Box>
      {openAddUser === true && (
        <Dailog
          props={props}
          open={openAddUser}
          setOpen={setOpenAddUser}
          Component={AddUser}
          cb={() => getUserList()}
        />
      )}
    </>
  );
}

export default UserList;


