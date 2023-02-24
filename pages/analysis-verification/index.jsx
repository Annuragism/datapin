import React, { useEffect, useState } from "react";
import "./style.css";
import { useSearchParams } from "react-router-dom";
import { TextField, Skeleton, Grid, } from "@mui/material";
import { Formik, Form } from "formik";
// import rightIcon from "../../assets/right-arrow.svg";
import StatusIcon from "../../common/status-icon/";
// import exportIcon from "../../assets/export.svg";
import { BackButtonRound, BackButtonRoundDark } from "../../common/back-button-round";
// import PrimaryButton from "../../common/primary-button/";
import { YesButton, NoButton } from "../../common/validation-button/";
import DocumentsViewer from "../../components/documents-viewer";
import VerifyBlock from "./verifyBlock";
import ConfirmBlock from "./confirmBlock";
import ControlBlock from "./controlBlock";


// Redux & Reducer Imports
import { useSelector } from "react-redux";
import {
  fetchDocumentById,
  fetchFileDataByPath,
  validateFieldByDocument,
} from "../../services/services";

function AnalaysisVerification(props) {
  let [searchParams, setSearchParams] = useSearchParams();
  const [fieldData, setFieldData] = useState(null);
  const [intialFD, setIntialFD] = useState({});
  const [fileData, setFileData] = useState(null);
  const [entity, setEntity] = useState(null);
  const [verify, setVerify] = useState([]);
  const [confirm, setconfirm] = useState([]);
  const [draw, setDraw] = useState(false);
  const [focus, setFocus] = useState(null)

  const { selectedAnalysis } = useSelector((state) => state.analysis);
  const id = searchParams.get("id");

  useEffect(() => {
    if (id !== undefined) {
      getDocumentsFields()
    }
  }, []);

  const getDocumentsFields = async () => {
    fetchDocumentById(id).then((data) => {
      setFieldData(data?.data?.documentData);
      setEntity(data?.data?.entityData);
      let obj = {};
      let confirm_feilds = [];
      let verify_feilds = [];
      data.data?.documentData?.extractedInformations &&
        Object.keys(data?.data?.documentData?.extractedInformations)?.map(
          (val, index) => {
            obj[val] = data.data?.documentData?.extractedInformations[val]?.value;
            if (
              data?.data?.documentData?.extractedInformations[val]?.confidence >
              0.5
            ) {
              confirm_feilds.push({
                name: val,
                value: data.data?.documentData?.extractedInformations[val]?.value,
                bbox: data.data?.documentData?.extractedInformations[val]?.bbox,
                confidence:
                  data.data?.documentData?.extractedInformations[val]?.confidence,
              });
            }
            if (
              data?.data?.documentData?.extractedInformations[val]?.confidence <
              0.5
            ) {
              verify_feilds.push({
                name: val,
                value: data.data?.documentData?.extractedInformations[val]?.value,
                bbox: data.data?.documentData?.extractedInformations[val]?.bbox,
                confidence:
                  data.data?.documentData?.extractedInformations[val]?.confidence,
              });
            }
            return;
          }
        );
      setconfirm(confirm_feilds);
      setVerify(verify_feilds);
      setIntialFD(obj);
      getFileData(id);
    });
  };

  const getFileData = async (id) => {
    let getfileDocId = await fetchFileDataByPath(id);
    setFileData(getfileDocId?.data);
  };

  const drawAnnotaion = async (coordinates = null) => {
    setDraw(coordinates);
  };

  return (
    <div>
      <PageHeader
        {...props}
        analysisId={fieldData?.analysisId}
        entity={entity}
      />
      <div className="verification-analysis d-flex">
        <div className="pdf-viewer w-60">
          <DocumentsViewer
            data={fileData}
            pageNumber={1}
            draw={draw}
            documentData={fieldData}
            focus={focus}
          />
        </div>
        <div className="document-verification-content w-40">
          <DocumentVerificationBlock
            {...props}
            field={fieldData}
            entity={entity}
            setFileds={setFieldData}
            vv={intialFD}
            analysisId={fieldData?.analysisId}
            confirm={confirm}
            verify={verify}
            setVerify={setVerify}
            setconfirm={setconfirm}
            setDraw={drawAnnotaion}
            getDocumentsFields={getDocumentsFields}
            setFocus={setFocus}
          />
        </div>
      </div>
    </div>
  );
}

export default AnalaysisVerification;

// DocumentVerificationBlock
const DocumentVerificationBlock = (props) => {
  const {
    translate,
    history,
    field,
    vv,
    analysisId,
    confirm,
    verify,
    setVerify,
    setconfirm,
    setDraw,
    entity,
    getDocumentsFields,
    setFocus
  } = props;
  let [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [verifyFieldModal, setverifyFieldModal] = useState(false);
  const [verifyFieldSuccessModal, setverifyFieldSuccessModal] = useState(false);
  const [selectedVerifydata, setselectedVerifydata] = useState(null);

  const handelVerificationofField = async (data) => {
    let resData = await validateFieldByDocument({
      docId: id,
      extractedJson: data,
    });
    if (resData.status === 200) {
      getDocumentsFields()
    }
  }

  return (
    <>
      <div className="document-verification-header">
        <div>
          <BackButtonRoundDark
            onClick={() => {
              history.navigate(`detailed-analysis?id=${entity?.uuuid}`);
            }}
          />
        </div>
        <div className="ml-10">
          <div className="document-verification-header-title">
            {translate.t(field?.type)}
          </div>
          <div className="document-verification-header-status d-flex mt-10">
            <StatusIcon status={field?.status} />
            {translate?.t(field?.status)}
          </div>
        </div>
      </div>
      <div className="doc-verification-container">

        {/* Verify Block */}
        {verifyFieldModal && (
          <div className="verify-block">
            <div className="verify-feild-block">
              <div className="value-container d-flex space-between">
                <div>
                  <p className="verify-feild-name">
                    {translate?.t(selectedVerifydata?.name)}
                  </p>
                  <div className="d-flex-center">
                    <TextField
                      style={{ width: "100%", margin: 5 }}
                      type="text"
                      autoFocus={true}
                      variant="outlined"
                      placeholder={selectedVerifydata?.value}
                      onFocus={(e) => { setFocus(e.target.value) }}
                      onChange={(e) => {
                        setselectedVerifydata({
                          ...selectedVerifydata,
                          value: e.target.value,
                        });
                      }}
                      name={selectedVerifydata?.value}
                      value={selectedVerifydata?.value}
                    />
                    <StatusIcon status={"verify"} />
                  </div>
                </div>
              </div>
              <div className="verify-feild-validation-block">
                <div className="verify-title d-flex-center">
                  {translate?.t("is_the_recognized_information_good")}
                </div>
                <div className="d-flex-center space-evenly mt-10">
                  <span>
                    <YesButton
                      text={translate?.t("yes")}
                      onClick={() => {
                        handelVerificationofField(selectedVerifydata);
                        setverifyFieldSuccessModal(true);
                        setverifyFieldModal(false);
                        setTimeout(() => {
                          let filterItem = verify.filter(
                            (val) => val?.name !== selectedVerifydata?.name
                          );
                          setVerify(filterItem);
                          setverifyFieldSuccessModal(false);
                          setconfirm([selectedVerifydata, ...confirm]);
                        }, 1500);
                      }}
                    />
                  </span>
                  <span>
                    {" "}
                    <NoButton
                      text={translate?.t("no")}
                      onClick={() => {
                        setverifyFieldModal(false);
                        setDraw(null);
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Verify then Success */}
        {verifyFieldSuccessModal && (
          <div className="verify-block">
            <div className="verify-block-heading">{translate?.t("verify")}</div>
            <div className="verify-feild-block">
              <div className="value-container d-flex space-between">
                <div>
                  <p className="verify-feild-name">
                    {translate?.t(selectedVerifydata?.name)}
                  </p>
                  <p className="verify-feild-value">
                    {" "}
                    {selectedVerifydata?.value}
                  </p>
                </div>
                <div className="d-flex-center">
                  <StatusIcon status={"confirm"} />
                </div>
              </div>
              <div className="confirm-feild-validation-block">
                <div className="verify-title d-flex-center">
                  {translate?.t("thanks")}
                </div>
                <div className="d-flex-center space-evenly mt-10">
                  <span>
                    <YesButton
                      text={translate?.t("yes")}
                      onClick={() => {
                        // handelVerificationofField(selectedVerifydata);
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {field?.extractedInformations ? (
          <Formik
            initialValues={vv}
            enableReinitialize={true}
            onSubmit={(values) => {
            }}
          >
            {({ values, handleChange }) => {
              return (
                <Form id="doc-form">
                  <ControlBlock
                    docId={id}
                    history={history}
                    translate={translate}
                    field={field}
                    getDocumentsFields={getDocumentsFields}
                  />
                  <VerifyBlock
                    translate={translate}
                    field={field}
                    verify={verify}
                    handleChange={handleChange}
                    setDraw={setDraw}
                    setverifyFieldModal={setverifyFieldModal}
                    setselectedVerifydata={setselectedVerifydata}
                    setFocus={setFocus}
                  />
                  <ConfirmBlock
                    translate={translate}
                    field={field}
                    confirm={confirm}
                    handleChange={handleChange}
                    getDocumentsFields={getDocumentsFields}
                    setFocus={setFocus}
                  />

                  <div>
                    {/* <PrimaryButton
                      style={{
                        marginTop: "40px",
                        color: "#FFF",
                        height: "60px",
                        marginLeft: "0px",
                      }}
                      endIcon={exportIcon}
                      type="submit"
                    >
                      Extract
                    </PrimaryButton> */}
                  </div>
                </Form>
              );
            }}
          </Formik>
        ) : (
          <div className="ml-10 d-flex-center">
            {translate?.t("no_data_found")}
          </div>
        )}
      </div>
    </>
  );
};

const PageHeader = (props) => {
  const { history, translate, ID, entity } = props;
  return (
    <div className="detailed-verification-analysis-header">
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid
          item
          xs={6}
          md={6}
          xl={6}
          justifyContent="center"
          alignItems={"center"}
        >
          <div className="d-flex ">
            <BackButtonRound
              onClick={() => {
                history.navigate(`detailed-analysis?id=${entity?.uuuid}`);
              }}
            />
            <div className="da-title w-100">
              {entity ? (
                <Grid>
                  {translate?.t("Analysis")}: {entity?.firstName},{" "}
                  {entity?.lastName}
                </Grid>
              ) : (
                <Skeleton
                  sx={{ height: 50 }}
                  animation="wave"
                  variant="rectangular"
                />
              )}
            </div>
          </div>
          <div className="d-sub-title ml-20">
          </div>
        </Grid>
        <Grid item xs={6} md={6} xl={6} justifyContent="end" display="flex">
        </Grid>
      </Grid>
    </div>
  );
};
