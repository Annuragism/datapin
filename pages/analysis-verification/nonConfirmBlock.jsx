import React,{useState} from 'react'

function NonConfirmBlock(props) {
  return ( <div className="confirm-block d-none">
                    <div className="confirm-block-heading">
                      {translate?.t("not_confirm")}
                    </div>
                    {field?.extractedInformations &&
                      Object.keys(field?.extractedInformations)?.map(
                        (val, index) => {
                          return (
                            <>
                              {field?.extractedInformations[val]?.confidence ==
                                null && (
                                <div className="not-confirm-feilds">
                                  <div className="field-card" key={index}>
                                    <div className="d-flex">
                                      <InputLabel
                                        style={{ width: "30%", margin: 5 }}
                                      >
                                        {translate?.t(val)}
                                      </InputLabel>
                                      <StatusIcon
                                        status={"not_confirm"}
                                        style={{ marginLeft: 15 }}
                                      />
                                    </div>
                                    <div className="d-flex d-none">
                                      <TextField
                                        style={{ width: "70%", margin: 5 }}
                                        type="text"
                                        variant="outlined"
                                        placeholder={
                                          values[val] !== ""
                                            ? values[val]
                                            : `${val}`
                                        }
                                        onChange={handleChange(val)}
                                        name={val}
                                        value={values[val]}
                                      />

                                      <div className="ml-10 d-flex-center">
                                        <StatusIcon status={"not_confirm"} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        }
                      )}
                  </div>
  )
}

export default NonConfirmBlock