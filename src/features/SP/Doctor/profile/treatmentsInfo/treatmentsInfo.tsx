import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Modal,
  Card,
  MenuItem,
  ListItemText,
  Checkbox,
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import CloseIcon from "@material-ui/icons/Close";
import { isEmpty, uniqBy, filter } from "lodash";
import "./treatmentsInfo.scss";
import CustomButton from "../../../../reusable/customButton/customButton";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import {
  fetchUpdateTreatmentsInfoAsync,
  selectTreatmentsProfileUsers,
  fetchSaveTreatmentsInfoAsync,
  fetchSavedTreatmentsListAsync,
} from "./treatmentsSlice";
import TreatmentsSaveInfo from "../treatmentsSaveInfo/treatmentsSaveInfo";
import Toast from "../../../../../reducres/reducers/toast";
import {
  closeSpinner,
  loadSpinner,
} from "../../../../../reducres/reducers/spinner";
import CustomPopup from "../../../../reusable/customPopup/customPopup";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();


  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      "& > * ": {
        textAlign: "center",
      },
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #debcbd",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3), top: '50% !important',
      left: '50% !important',
      transform: 'translate(-50%, -50%)!important',
    },
  })
);

const TreatmentsInfo: React.FC<any> = ({ history }) => {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const [save, setSave] = useState(false);
  const dispatch = useAppDispatch();
  const { savedTreatmentDetailsList } = useAppSelector(
    selectTreatmentsProfileUsers
  );

  const areas = uniqBy(
    savedTreatmentDetailsList &&
    savedTreatmentDetailsList.data &&
    savedTreatmentDetailsList.data.map((item) => item.area),
    "id"
  );
  const selectedAreas = areas.map((item: any) => item.id);

  const categorys = uniqBy(
    savedTreatmentDetailsList &&
    savedTreatmentDetailsList.data &&
    savedTreatmentDetailsList.data.map((item) => item.category),
    "id"
  );
  const selectCategory = categorys.map((item: any) => item.id);

  const subCategorys = uniqBy(
    savedTreatmentDetailsList &&
    savedTreatmentDetailsList.data &&
    savedTreatmentDetailsList.data.map((item) => item.subcategory),
    "id"
  );
  const selectSubCategory = subCategorys.map((item: any) => item.id);

  const treatments = uniqBy(
    savedTreatmentDetailsList &&
    savedTreatmentDetailsList.data &&
    savedTreatmentDetailsList.data.map((item) => item.treatment),
    "id"
  );
  const selectTreatments = treatments.map(({ id, pivot }: any) => {
    return { id, ...pivot };
  });

  const [checked] = React.useState({ id: [...selectedAreas] });
  const [categoryChecked, setCategoryChecked] = React.useState<any>({
    area_id: [],
    id: [...selectCategory],
  });
  const [treatmentsChecked] = React.useState([...selectTreatments]);

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handlesaveTreatments = () => {
    dispatch(
      fetchSaveTreatmentsInfoAsync({ treatment_id: treatmentsChecked })
    ).then((response) => {
      setSave(true);
    });
  };

  let {
    treatmentsList,
    treatmentsProfileSubCategoryUsers,
    treatmentsProfileCategoryUsers,
  } = useAppSelector(selectTreatmentsProfileUsers);
  treatmentsProfileCategoryUsers = isEmpty(treatmentsProfileCategoryUsers)
    ? [{ category: categorys }]
    : treatmentsProfileCategoryUsers;
  treatmentsProfileCategoryUsers = uniqBy(treatmentsProfileCategoryUsers, "id");
  treatmentsProfileSubCategoryUsers = isEmpty(treatmentsProfileSubCategoryUsers)
    ? [{ subcategory: subCategorys }]
    : treatmentsProfileSubCategoryUsers;
  treatmentsList = isEmpty(treatmentsList)
    ? [{ treatment: treatments }]
    : treatmentsList;

  useEffect(() => {
    window.scrollTo(0, 0)
    const filterCategoryChecked: any = filter(categoryChecked.id, (item) =>
      treatmentsProfileCategoryUsers.some((cat) => cat.id === item)
    );
    if (categoryChecked.length > 0) {
      setCategoryChecked(filterCategoryChecked);
    }
  }, [checked.id]);

  const body = (
    <div className={classes.paper}>
      <Grid container>
        <Grid item xs={12} lg={12}>
          <CloseIcon className="cancel-icon" onClick={handleClose} />
        </Grid>

        <Grid item xs={12} lg={12}>
          <Typography className="modal-heading" id="simple-modal-title">
            Are you sure you want to add these treatments?
          </Typography>
        </Grid>
      </Grid>

      <div className="modal-buttons-main">
        <CustomButton className="no-button" onClick={handleClose}>
          No
        </CustomButton>
        <CustomButton
          className="yes-button"
          onClick={(e) => {
            handlesaveTreatments();
          }}
        >
          yes
        </CustomButton>
      </div>
    </div>
  );

  const handleCheckBoxCategoryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: any
  ) => {
    let totalCounts = toalCounts;

    let data = area_id.filter((items) => {
      if (item.area_id === items.area_id) {
        return items;
      }
    });

    data[0].category_id = data[0].category_id.filter((items) => {
      if (items.id !== item.id) {
        return items;
      } else {
        totalCounts.category_id--;
      }
    });

    data[0].sub_categoryId = data[0].sub_categoryId.filter((items) => {
      if (items.category_id !== item.id) {
        return items;
      } else {
        totalCounts.sub_categoryId--;
      }
    });

    data[0].treatement = data[0].treatement.filter((items) => {
      if (items.category_id !== item.id) {
        return items;
      } else {
        totalCounts.treatement--;
      }
    });

    let newData = area_id.filter((items) => {
      if (item.area_id === items.area_id) {
        return (items = data);
      }
    });
    setTotalCounts(totalCounts);

    setarea_id(newData);

    sendTODb(newData);
  };
  const handleCheckBoxTreatmentsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: any,
    index,
    index2
  ) => {
    let areadata = area_id.filter((data) => {
      if (data.area_id == item.area_id) {
        return data;
      }
    });

    area_id[index2].treatement.splice(index, 1);

    let newData = area_id.filter((data) => {
      if (data.area_id == item.area_id) {
        return (data = areadata);
      } else {
        return data;
      }
    });

    setarea_id(newData);
    setTotalCounts({ ...toalCounts, treatement: toalCounts.treatement - 1 });

    sendTODb(newData);
  };

  const handleCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    item
  ) => {
    let totalCounts = toalCounts;
    let Ndata = area_id.filter((items) => {
      if (item.area_id !== items.area_id) {
        return items;
      }
    });

    let data = area_id.filter((items) => {
      if (item.area_id === items.area_id) {
        return items;
      }
    });

    toalCounts.treatement = totalCounts.treatement - data[0].treatement.length;
    toalCounts.sub_categoryId =
      totalCounts.sub_categoryId - data[0].sub_categoryId.length;
    toalCounts.category_id =
      totalCounts.category_id - data[0].category_id.length;
    toalCounts.area_id = totalCounts.area_id - 1;

    setarea_id(Ndata);

    sendTODb(Ndata);

    return;
    dispatch(
      fetchUpdateTreatmentsInfoAsync({
        treatment_id: { area_id: [...checked.id] },
        remove_all: 0,
      })
    );
  };

  const sendTODb = (fielddata) => {
    let n = 0;
    fielddata.map((data) => {
      data.treatement.filter((items) => {
        n = n + 1;
        return;
      });
    });

    if (n == 0) {
      setDb({
        treatment_id: [],
        remove_all: 1,
      });
      dispatch(loadSpinner());
      dispatch(
        fetchUpdateTreatmentsInfoAsync({
          treatment_id: [],
          remove_all: 1,
        })
      )
        .unwrap()
        .then(async (result) => {
          Treatementdata()
          if (result) {
            Toast.success(result.message);
          }
        })
        .then(() => {
          setTimeout(() => {
            dispatch(closeSpinner());
          }, 2000);
        });
    } else {
      let treatement_id = [];

      area_id.map((data) => {
        data.treatement.map((items) => {
          treatement_id.push({
            area_id: items.area_id,
            category_id: items.category_id,
            sub_category_id: items.sub_category,
            treatment_id: items.id,
          });
        });
      });

      dispatch(
        fetchUpdateTreatmentsInfoAsync({
          treatment_id: treatement_id,
          remove_all: 0,
        })
      )
      .unwrap()
      .then(async (result) => {
        Treatementdata()
        if (result) {
          Toast.success(result.message);
        }
      })
      .then(() => {
        setTimeout(() => {
         
          dispatch(closeSpinner());
        }, 2000);
      });
    }
  };

  const handleCheckBoxSubCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    item,
    index
  ) => {
    let data = area_id.filter((items) => {
      if (items.area_id === item.area_id) {
        return items;
      }
    });

    data[0].sub_categoryId.splice(index, 1);

    data[0].treatement = data[0].treatement.filter((items) => {
      if (items.sub_category !== item.id) {
        return items;
      }
    });

    let Newdata = area_id.filter((items) => {
      if (items.area_id === item.area_id) {
        return items == data[0];
      }
    });

    setarea_id(Newdata);
    sendTODb(Newdata);
    return;
  };

  const [area_id, setarea_id] = useState([]);
  const [sendDb, setDb] = useState({});
  const [category_id, setCategory] = useState([]);
  const [toalCounts, setTotalCounts] = useState({
    area_id: 0,
    category_id: 0,
    sub_categoryId: 0,
    treatement: 0,
  });

  const Treatementdata = () => {
    let newArr = [];
    let new_category_id = [];
    dispatch(loadSpinner());
    dispatch(fetchSavedTreatmentsListAsync()).then(async (response) => {
      if (response?.payload?.response?.data?.data.length == 0) {
        dispatch(closeSpinner());
      } else {
        dispatch(closeSpinner());
      }

      const data = response?.payload?.data

      const areas = [];
      const categories = [];
      const subCategories = [];
      const treatments = [];
      data.forEach((v) => {
        if (!areas.includes(v.area_id)) areas.push(v.area_id)
        if (!categories.includes(v.category_id)) categories.push(v.category_id)
        if (!subCategories.includes(v.sub_category_id)) subCategories.push(v.sub_category_id)
        if (!treatments.includes(v.treatment_id)) treatments.push(v.treatment_id)
      });

      setTotalCounts({
        area_id: areas.length,
        category_id: categories.length,
        sub_categoryId: subCategories.length,
        treatement: treatments.length,
      });

      data?.forEach(async (el) => {
        if (
          category_id.indexOf(el.area_id) == -1 &&
          new_category_id.indexOf(el.area_id) == -1
        ) {
          new_category_id.push(el.area_id);
          setCategory([...category_id, el.area_id]);
        }



        try {
          if (true) {
            newArr.push({
              area_id: el.area_id,
              category_id: [
                {
                  id: el.category_id,
                  title: el.category.title,
                  area_id: el.area_id,
                },
              ],
              title: el.area.title,
              [`sub_categoryId`]: [
                {
                  id: el.sub_category_id,
                  area_id: el.area_id,
                  title: el.subcategory.title,
                  category_id: el.category_id,
                  sub_category: el.sub_category_id,
                },
              ],
              [`treatement`]: [
                {
                  id: el.treatment_id,
                  area_id: el.area_id,
                  title: el.treatment.title,
                  category_id: el.category_id,
                  sub_category: el.sub_category_id,
                },
              ],
            });

            newArr.map((count: any) => {
              // return setTotalCounts({
              //   area_id: toalCounts.area_id + 1,
              //   category_id: toalCounts.category_id + count.category_id.length,
              //   sub_categoryId:toalCounts.sub_categoryId + count.sub_categoryId.length,
              //   treatement: toalCounts.treatement + count.treatement.length,
              // });
            });
          } else {
            try {
              let prevArr = newArr;
              let prevValue = prevArr[0];

              let newPrev = prevArr.filter((fd) => {
                if (fd.area_id === el.area_id) {
                  return fd;
                }
              });

              prevValue = newPrev[0];

              const category_info = prevValue;

              category_info.category_id.map((categoryInfo) => {
                if (categoryInfo.id != el.category_id) {
                  return (category_info.category_id = [
                    { id: el.category_id, title: el.category.title },
                    ...category_info.category_id,
                  ]);
                } else {
                  return (category_info.category_id = [
                    ...category_info.category_id,
                  ]);
                }
              });

              category_info.sub_categoryId.map((categoryInfo) => {
                if (categoryInfo.id !== el.sub_category_id) {
                  return (category_info.sub_categoryId = [
                    {
                      id: el.sub_category_id,
                      area_id: el.area_id,
                      title: el.subcategory.title,
                      category_id: el.category_id,
                      sub_category: el.sub_category_id,
                    },
                    ...category_info.sub_categoryId,
                  ]);
                } else {
                  return (category_info.sub_categoryId = [
                    ...category_info.sub_categoryId,
                  ]);
                }
              });

              category_info.treatement.map((treatement) => {
                if (treatement.id !== el.treatement_id) {
                  return (category_info.treatement = [
                    {
                      id: el.treatment_id,
                      area_id: el.area_id,
                      title: el.treatment.title,
                      category_id: el.category_id,
                      sub_category: el.sub_category_id,
                    },
                    ...category_info.treatement,
                  ]);
                } else {
                  return (category_info.treatement = [
                    ...category_info.sub_categoryId,
                  ]);
                }
              });

              prevValue = {
                ...prevValue,
                area_id: el.area_id,
                category_id: category_info.category_id,
                sub_categoryId: category_info.sub_categoryId,

                [`treatement`]: category_info.treatement,
              };

              prevArr.map((Nd) => {
                if (Nd.area_id === el.area_id) {
                  return (Nd = prevValue);
                }
              });
              newArr = prevArr;
              newArr.map((count: any) => {
                // return setTotalCounts({
                //   area_id: toalCounts.area_id + 1,
                //   category_id:
                //     toalCounts.category_id + count.category_id.length,
                //   sub_categoryId:
                //     toalCounts.sub_categoryId + count.sub_categoryId.length,
                //   treatement: toalCounts.treatement + count.treatement.length,
                // });
              });
              setarea_id(newArr);
            } catch (err) { }
          }
      
        } catch (error) { }
        console.log('AREA ID', newArr)
       
      });
      setarea_id(newArr);
    });
  };
  const handleAddTreatments = () => {
    setSave(true);
  };

  // useEffect(() => {
  //   Treatementdata();
  // }, []);

  useEffect(() => {
    Treatementdata();
  }, [save]);

  const [popupProps, setPopupProps] = useState<any>()

  return (
    <>
      {popupProps && <CustomPopup visible={popupProps ? true : false} dismiss={() => setPopupProps(null)} {...popupProps} />}
      {save == true ? (
        <TreatmentsSaveInfo
          hide={() => {
            setSave(false);
          }}
        />
      ) : (
        <div className="treatments-info-tab">
          <Grid container>
          <Grid item lg={6} md={6} sm={12} xs={12}  className="office-address-grid">
              <Typography className="office-address-title">
                All Treatments{" "}
              </Typography>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}
              className="add-remove-treatments-button"
            >
              <CustomButton
                className="save-changes-button px-4"
                onClick={handleAddTreatments}
              >
                Add Treatments
              </CustomButton>

              {/* <CustomButton className="save-changes-button" onClick={handleOpen}>save changes</CustomButton> */}
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                {body}
              </Modal>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item lg={3} md={3} xs={12} sm={12}>
              <Typography className="treatment-area-category">Area</Typography>
              <Card>
                <Grid container className="treatments-sub-heading-grid">
                  <Grid item lg={8} md={8} xs={8} sm={8}>
                    <Typography variant="h6" className="treatments-heading">
                      Selected
                    </Typography>
                  </Grid>
                  <Grid lg={4} md={4} xs={4} sm={4} className="">
                    <Typography
                      className=""
                      style={{
                        textAlign: "right",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }}
                    >
                      {toalCounts.area_id}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item lg={12} xs={12}>
                    {area_id.length > 0 &&
                      area_id.filter((value, index, arr) => arr.map(e => e.area_id).indexOf(value.area_id) === index).map((item: any, index: any) => (
                        <MenuItem key={item.area} value={item.title}>
                          <ListItemText style={{ textTransform: 'capitalize',whiteSpace: "break-spaces" }} primary={item.title} />
                          <Checkbox
                            checked
                            disabled
                            name={item.title}
                            id={item.id}
                            onChange={(event: any) =>
                              setPopupProps({ title: 'Caution', message: 'Are you sure you want to remove this treatment?', onYes: () => handleCheckBoxChange(event, item) })

                            }
                            inputProps={{ "aria-label": "" }}
                          />
                        </MenuItem>
                      ))}
                  </Grid>
                </Grid>
              </Card>
            </Grid>




            <Grid item lg={3} md={3} xs={12} sm={12}>
              <Typography className="treatment-area-category">
                Category
              </Typography>
              <Card>
                <Grid container className="treatments-sub-heading-grid">
                  <Grid item lg={8} xs={8}>
                    <Typography variant="h6" className="treatments-heading">
                      Selected
                    </Typography>
                  </Grid>
                  <Grid item xs={4} lg={4} className="selected-count-grid">
                    <Typography className="treatments-sub-heading">
                      {toalCounts.category_id}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item lg={12} xs={12}>
                    {area_id.map(a => a.category_id[0])
                      .filter((value, index, arr) => arr.map(e => e.id).indexOf(value.id) === index)
                      .map((item) => {
                        return (
                          <MenuItem key={item.id} value={item.id}>
                            <ListItemText primary={item.title} style={{ textTransform: 'capitalize', whiteSpace: "break-spaces" }} />
                            <Checkbox
                              checked
                              disabled
                              name={item.title}
                              id={item.id}
                              onChange={(event: any) =>
                                setPopupProps({ title: 'Caution', message: 'Are you sure you want to remove this item?', onYes: () =>   handleCheckBoxCategoryChange(event, item) })
                              
                              }
                              inputProps={{ "aria-label": "" }}
                            />
                          </MenuItem>
                        );
                      })}

                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item lg={3} md={3} xs={12} sm={12}>
              <Typography className="treatment-area-category">
                Sub Category
              </Typography>
              <Card>
                <Grid container className="treatments-sub-heading-grid">
                  <Grid item xs={8}>
                    <Typography variant="h6" className="treatments-heading">
                      Selected
                    </Typography>
                  </Grid>
                  <Grid item xs={4} className="selected-count-grid">
                    <Typography className="treatments-sub-heading">
                      {toalCounts.sub_categoryId}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item lg={12} xs={12}>
                    {area_id.map(a => a.sub_categoryId[0])
                      .filter((value, index, arr) => arr.map(e => e.id).indexOf(value.id) === index)
                      .map((item, index) => (
                        <MenuItem key={item.id} /* value={item.type} */>
                          <ListItemText primary={item.title} style={{ textTransform: 'capitalize', whiteSpace: "break-spaces" }} />
                          <Checkbox
                            checked
                            disabled
                            name={item.title}
                            id={item.id}
                            onChange={(event: any) =>
                              setPopupProps({ title: 'Caution', message: 'Are you sure you want to remove this item?', onYes: () =>     handleCheckBoxSubCategoryChange(
                                event,
                                item,
                                index
                              ) })                            
                            }
                            inputProps={{ "aria-label": "" }}
                          />
                        </MenuItem>
                      ))}
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item lg={3} md={3} xs={12} sm={12}>
              <Typography className="treatment-area-category">
                Treatments
              </Typography>
              <Card>
                <Grid container className="treatments-sub-heading-grid">
                  <Grid item xs={8}>
                    <Typography variant="h6" className="treatments-heading">
                      Selected
                    </Typography>
                  </Grid>
                  <Grid item xs={4} className="selected-count-grid">
                    <Typography className="treatments-sub-heading">
                      {toalCounts.treatement}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item lg={12} xs={12}>
                    {area_id.map((items: any, index2) => {
                      return items.treatement.map((item, index) => {
                        return (
                          <MenuItem key={item.type} value={item.type}>
                            <ListItemText primary={item.title} style={{ textTransform: 'capitalize',whiteSpace: "break-spaces" }} />
                            <Checkbox
                              checked
                              name={item.title}
                              id={item.id}
                              onChange={(event: any) =>{
                                setPopupProps({ title: 'Caution', message: 'Are you sure you want to remove this item?', onYes: () => handleCheckBoxTreatmentsChange(
                                  event,
                                  item,
                                  index,
                                  index2
                                ) })
                                console.log(item, index, index2)
                              }
                              
  
                             
                              }
                              inputProps={{ "aria-label": "" }}
                            />
                          </MenuItem>
                        );
                      });
                    })}
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export default withRouter(TreatmentsInfo);
