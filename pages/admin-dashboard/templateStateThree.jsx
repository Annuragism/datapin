import React, { useState } from "react";
import { useEffect } from "react";
import rightIcon from "../../assets/right-arrow.svg";
import { Grid, Box, Typography, Checkbox, Divider } from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import "./style.css";
// Import Shared Component
import PrimaryButton from "../../common/primary-button";
import { getControls } from "../../services/adminservices ";

const TemplateStateThree = (props) => {
  const { translate, selectedType, setcontrolsData,step,setStep,data } = props;
  const [selectedChamp, setSelectedChamp] = useState([]);
  const [Controls, setControls] = useState([]);
  const [iv, setIv] = useState(false);
  const [intialVal, setintialVal] = useState([]);

  const getUpdateControlsData = ()=>{
const updateData = Object.entries(data?.controlSelection);
const upd = updateData.map((d, i) => {
  return {
    defaultFields: {
      type: d[0],
      controls: d[1].conform.reduce((prev, curr) => {
        return { ...prev, [curr]: { value: true, confidence: 0 } };
      }, {}),
      extractedInformation: {},
    },
    documentType: d[0],
  };
});
setControls(upd);
  }
  
  useEffect(() => {
    if(data){
getUpdateControlsData();
    }else{
      getControlsData();
    }
  }, []);

  const getControlsData = async () => {
    let response = await getControls(selectedType);
    setControls(response?.data);
  };

  // console.log(Controls);

  return (
    <>
      <Box mt={2} pl={4}>
        <Typography
          sx={{
            fontFamily: "Suisse Int",
            fontStyle: "normal",
            fontSize: 14,
            color: "#3A3868",
          }}
        >
          {translate?.t("feild_to_analyze")}{" "}
        </Typography>
        {Controls.length > 0 ? (
          <Formik
            // enableReinitialize={true}
            initialValues={Controls.map((dc, di) => ({
              name: dc?.documentType,
              controls: dc?.defaultFields?.controls
                ? Object.keys(dc?.defaultFields?.controls)
                : [],
              extractedInformation: dc?.defaultFields?.extractedInformation
                ? Object.keys(dc?.defaultFields?.extractedInformation)
                : [],
            }))}
            onSubmit={(values) => {
              // console.log(JSON.stringify(values, null, 2));
              console.log(values);
              setcontrolsData(values);
              setStep(4);
            }}
          >
            {({ values, handleChange, handleSubmit }) => {
              return (
                <Form>
                  {Controls?.map((val, index) => (
                    <Box mt={2}>
                      <Typography
                        sx={{
                          fontFamily: "Suisse Int",
                          fontStyle: "normal",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#3A3868",
                        }}
                      >
                        {" "}
                        Name:- {translate?.t(val?.documentType)}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Suisse Int",
                          fontStyle: "normal",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#3A3868",
                          mt: 2,
                        }}
                      >
                        {translate?.t("validity_check_of_doc")} (
                        {translate?.t("mandatory")})
                      </Typography>
                      <Grid container mt={3}>
                        <Grid item xs={12}>
                          {val?.defaultFields?.controls &&
                          Object.keys(val?.defaultFields?.controls).length >
                            0 ? (
                            Object.keys(val?.defaultFields?.controls).map(
                              (c, ci) => {
                                return (
                                  <Box
                                    sx={{
                                      borderRadius: 2,
                                      color: "#605f7c",
                                      display: "flex",
                                      alignItems: "center",
                                      // justifyContent: "space-between",
                                    }}
                                  >
                                    <Checkbox
                                      // type="checkbox"
                                      value={c}
                                      name={c}
                                      checked={values[
                                        index
                                      ]?.controls?.includes(c)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          values[index]?.controls.push(
                                            e.target.value
                                          );
                                          setIv(!iv);
                                        } else {
                                          let allVal = values[index].controls;
                                          let ind = allVal.indexOf(
                                            e.target.value
                                          );
                                          allVal.splice(ind, 1);
                                          values[index].controls = allVal;
                                          setIv(!iv);
                                        }
                                      }}
                                    />
                                    <div style={{ width: "70%" }}>
                                      <div> {translate.t(c)}</div>
                                    </div>
                                  </Box>
                                );
                              }
                            )
                          ) : (
                            <Typography
                              sx={{
                                fontFamily: "Suisse Int",
                                fontStyle: "normal",
                                fontSize: 14,
                                color: "#3A3868",
                              }}
                            >
                              {translate?.t("no_data")}
                            </Typography>
                          )}
                        </Grid>
                        <Grid mt={3}>
                          <Typography
                            sx={{
                              fontFamily: "Suisse Int",
                              fontStyle: "normal",
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#3A3868",
                            }}
                          >
                            {translate?.t("extracted_information")}
                          </Typography>
                          <Box mt={3}>
                            {val?.defaultFields?.extractedInformation &&
                            Object.keys(
                              val?.defaultFields?.extractedInformation
                            ).length > 0 ? (
                              Object.keys(
                                val?.defaultFields?.extractedInformation
                              ).map((ex, i) => (
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Checkbox
                                    value={ex}
                                    checked={values[
                                      index
                                    ]?.extractedInformation?.includes(ex)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        values[
                                          index
                                        ]?.extractedInformation.push(
                                          e.target.value
                                        );
                                        setIv(!iv);
                                      } else {
                                        let allVal =
                                          values[index].extractedInformation;
                                        let ind = allVal.indexOf(
                                          e.target.value
                                        );
                                        allVal.splice(ind, 1);
                                        values[index].extractedInformation =
                                          allVal;
                                        setIv(!iv);
                                      }
                                    }}
                                  />{" "}
                                  <Typography>{translate?.t(ex)}</Typography>
                                </Box>
                              ))
                            ) : (
                              <Typography
                                sx={{
                                  fontFamily: "Suisse Int",
                                  fontStyle: "normal",
                                  fontSize: 14,
                                  color: "#3A3868",
                                  mt: 2,
                                }}
                              >
                                {translate?.t("no_data")}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      <Divider />
                    </Box>
                  ))}
                  <Grid item xs={12}>
                    <PrimaryButton
                      style={{
                        marginTop: "40px",
                        color: "#FFF",
                        height: "10px",
                      }}
                      endIcon={rightIcon}
                      // onClick={() => {
                      //   setStep(4);
                      // }}
                      disable={selectedChamp ? false : true}
                      type="submit"
                    >
                      {translate.t("next")}
                    </PrimaryButton>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        ) : (
          <Typography
            sx={{
              fontFamily: "Suisse Int",
              fontStyle: "normal",
              fontSize: 14,
              color: "#3A3868",
              mt: 2,
            }}
          >
            {translate?.t("no_data")}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default TemplateStateThree;
