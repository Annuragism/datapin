function AnalysisTable(props) {
  const { dashboardData, translate } = props;
  console.log(dashboardData);
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("395px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [searchBtn, setSearchBtn] = useState(true);
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [printBtn, setPrintBtn] = useState(false);
  const [viewColumnBtn, setViewColumnBtn] = useState(false);
  const [filterBtn, setFilterBtn] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [statusModle, setstatusModle] = useState(false);

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
      label: "Analysis",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          console.log(tableMeta);
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
      label: "Type of documents",
      options: {
        filter: true,
        sort: false,
      filterOptions: { names: ["attorney", "analyst"] },
        filterType: "checkbox",
        customFilterListOptions: {
          render: (v) => {
            return `Title: ${v}`;
          }
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="d-flex-wrap">
              {tdata[tableMeta.rowIndex]?.status === "PENDING" ? (
                <AnalysisLoader loading={true} size={25} />
              ) : tdata[tableMeta.rowIndex]?.documentTypes?.length > 0 ? (
                tdata[tableMeta.rowIndex]?.documentTypes.map((val, i) => (
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
          );
        },
      },
    },
    {
      name: "status",
      label: "Status",
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
      label: "Legal Documents",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "createdAt",
      label: "Import Date",
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
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    onTableChange: (action, state) => {
      console.log(action);
      console.dir(state);
    },
  };

  const tdata = dashboardData?.analysis;
  return (
    <>
      <MUIDataTable
        title={
          <Typography variant="h5">{translate?.t("your_analyzes")}</Typography>
        }
        data={tdata}
        columns={columns}
        options={options}
      />

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
          <ReplayIcon sx={{ p: 2 }} />{" "}
          <Typography sx={{ p: 2 }}> {translate?.t("re_run")}</Typography>
        </Grid>
      </Popover>
    </>
  );
}
