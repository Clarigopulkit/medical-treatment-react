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
import { uniqBy, includes } from "lodash";
import CustomButton from "../../../../reusable/customButton/customButton";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import {
  clearStoreData,
  fetchTreatmentsAsync,
  fetchTreatmentsAreasProfileAsync,
  fetchTreatmentsCategoryProfileAsync,
  fetchTreatmentsSubCategoryProfileAsync,
  selectTreatmentsProfileUsers,
  fetchSaveTreatmentsInfoAsync,
  fetchSavedTreatmentsListAsync,
} from "../treatmentsInfo/treatmentsSlice";
import {
  closeSpinner,
  loadSpinner,
} from "../../../../../reducres/reducers/spinner";
import Toast from "../../../../../reducres/reducers/toast";
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

const TreatmentsSaveInfo: React.FC<any> = ({ history, hide }) => {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  let {
    treatmentsProfileUsers,
    treatmentsList,
    treatmentsProfileSubCategoryUsers,
    treatmentsProfileCategoryUsers,
  } = useAppSelector(selectTreatmentsProfileUsers);
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

  const [checked, setChecked] = React.useState({ id: [] });
  const [categoryChecked, setCategoryChecked] = React.useState<any>([]);
  const [subCategoryChecked, setSubCategoryChecked] = React.useState([]);
  const [treatmentsChecked, setTreatmentsChecked] = React.useState<any>([]);

  const [fieldData, setfieldData] = useState({
    area: [],
    category: [],
    subCategory: [],
    Treatement: [],
  });

  useEffect(() => {
    dispatch(loadSpinner());
    dispatch(fetchTreatmentsAreasProfileAsync())
      .unwrap()
      .then((response) => {
        if (response && response.data) {
          setfieldData({
            area: [...fieldData?.area, ...response?.data],
            category: fieldData.category,
            subCategory: fieldData.subCategory,
            Treatement: fieldData.Treatement,
          });
        }

        if (response) {
          dispatch(closeSpinner());
        }
      });
  }, []);
  const [popupProps, setPopupProps] = useState<any>()
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handlesaveTreatments = async () => {
    dispatch(loadSpinner());
    if (treatmentsChecked.length == 0) {
      setPopupProps({ message: 'Please select treatment.', title: "Alert", hideSecondaryButton: true, primaryText: 'Ok' })
      // Toast.error("Please select treatment.");
      dispatch(closeSpinner());
      setOpen(false);
      return;
    }
    await dispatch(
      fetchSaveTreatmentsInfoAsync({
        treatment_id: treatmentsChecked.map((item) => item),
      })
    )
      .unwrap()
      .then(async (result) => {
        if (result) {
          setPopupProps({ message: 'Successfully saved Treatment info', title: "Success", hideSecondaryButton: true, primaryText: 'Ok' })
          // Toast.success("Successfully saved Treatment info");
        }
      })
      .then(() => {
        setTimeout(() => {
          hide();
          dispatch(closeSpinner());
        }, 2000);
        setOpen(false);
      });
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Grid container style={{ justifyContent: "center" }}>
        <Grid item xs={12} lg={12} style={{ textAlign: "right" }}>
          <CloseIcon className="cancel-icon" onClick={handleClose} />
        </Grid>
        <Grid
          item
          xs={10}
          lg={10}
          style={{ textAlign: "center", paddingTop: "0px" }}
        >
          <Typography
            className="modal-heading"
            variant={"h6"}
            style={{
              lineHeight: "unset",
              fontWeight: 600,
              paddingBottom: "20px",
            }}
            id="simple-modal-title"
          >
            Are you sure you want to add these treatments?
          </Typography>
        </Grid>
      </Grid>

      <div className="modal-buttons-main">
        <CustomButton className="no-button" onClick={handleClose}>
          No
        </CustomButton>
        <CustomButton className="yes-button" onClick={handlesaveTreatments}>
          Yes
        </CustomButton>
      </div>
    </div>
  );

  const handleCheckBoxCategoryChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    items
  ) => {
    let UpdateCategory = [];

    if (event.target.checked === true) {
      setCategoryChecked([...categoryChecked, items]);

      dispatch(loadSpinner());

      dispatch(fetchTreatmentsSubCategoryProfileAsync({ category: [items] }))
        .unwrap()
        .then((response) => {
          if (response !== undefined && response.length > 0) {
            setfieldData({
              area: fieldData.area,
              category: fieldData.category,
              subCategory: [
                ...fieldData.subCategory,
                ...response[0]?.subcategory,
              ],
              Treatement: fieldData.Treatement,
            });
          }
          dispatch(closeSpinner());
        });
    } else {
      setCategoryChecked(
        categoryChecked.filter((item) => {
          return item.category_id !== items.category_id;
        })
      );

      setSubCategoryChecked(
        subCategoryChecked.filter((item) => {
          return item.category_id !== items.category_id;
        })
      );

      setTreatmentsChecked(
        treatmentsChecked.filter((item) => {
          return item.category_id !== items.category_id;
        })
      );

      setfieldData({
        area: fieldData.area,
        category: fieldData.category,
        subCategory: fieldData.subCategory.filter((item) => {
          return item.pivot.category_id !== items.category_id;
        }),
        Treatement: fieldData.Treatement.filter((item) => {
          return item.pivot.category_id !== items.category_id;
        }),
      });
    }
  };
  const handleCheckBoxTreatmentsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    items: any
  ) => {
    if (event.target.checked === true) {
      setTreatmentsChecked([...treatmentsChecked, items]);
    } else {
      setTreatmentsChecked(
        treatmentsChecked.filter((item) => {
          return item.treatment_id !== items.treatment_id;
        })
      );
    }
  };

  const handleCheckBoxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    id: any
  ) => {
    const { name, value } = event.target;
    let ids = checked.id;
    if (event.target.checked === true) {
      ids.push(id);
      setChecked({
        ...checked,
        [name]: true,
        id: ids,
      });
      dispatch(loadSpinner());

      await dispatch(fetchTreatmentsCategoryProfileAsync(checked.id))
        .unwrap()
        .then((response) => {
          if (response && response.length > 0) {
            setfieldData({
              area: fieldData.area,
              category: [...fieldData.category, ...response[0].category],
              subCategory: fieldData.subCategory,
              Treatement: fieldData.Treatement,
            });
          }
          dispatch(closeSpinner());
        });
    } else {
      let filterId = ids.filter((item) => item !== id);
      setChecked({
        ...checked,
        [name]: false,
        id: filterId,
      });
      dispatch(loadSpinner());

      setfieldData({
        area: fieldData.area,
        category: fieldData.category.filter((item_item) => {
          return item_item.pivot.area_id !== id;
        }),
        subCategory: fieldData.subCategory.filter((item) => {
          return item.pivot.area_id !== id;
        }),
        Treatement: fieldData.Treatement.filter((item) => {
          return item.pivot.area_id !== id;
        }),
      });

      setCategoryChecked(
        categoryChecked.filter((item) => {
          return item.area_id !== id;
        })
      );

      setSubCategoryChecked(
        subCategoryChecked.filter((item) => {
          return item.area_id !== id;
        })
      );

      setTreatmentsChecked(
        treatmentsChecked.filter((item) => {
          return item.area_id !== id;
        })
      );

      dispatch(closeSpinner());
    }
  };
  const handleCheckBoxSubCategoryChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    items
  ) => {
    if (event.target.checked === true) {
      setSubCategoryChecked([...subCategoryChecked, items]);

      dispatch(loadSpinner());

      await dispatch(fetchTreatmentsAsync({ subcategory: [items] }))
        .unwrap()
        .then((response) => {
          if (response !== undefined && response.length > 0) {
            setfieldData({
              area: fieldData.area,
              category: fieldData.category,
              subCategory: fieldData.subCategory,
              Treatement: [...fieldData.Treatement, ...response[0]?.treatment],
            });
          }
          dispatch(closeSpinner());
        });
    } else {
      dispatch(loadSpinner());
      setSubCategoryChecked(
        subCategoryChecked.filter((item) => {
          return item.sub_category_id !== items.sub_category_id;
        })
      );

      setTreatmentsChecked(
        treatmentsChecked.filter((item) => {
          return item.sub_category_id !== items.sub_category_id;
        })
      );

      setfieldData({
        area: fieldData.area,
        category: fieldData.category,
        subCategory: fieldData.subCategory,
        Treatement: fieldData.Treatement.filter((item) => {
          return item.pivot.sub_category_id !== items.sub_category_id;
        }),
      });

      dispatch(closeSpinner());
    }
  };

  const handleAddTreatments = () => {
    history.push("treatments-save-info");
  };

  return (

    <div className="treatments-info-tab">
      {popupProps && <CustomPopup visible={popupProps ? true : false} dismiss={() => setPopupProps(null)} {...popupProps} />}
      <Grid container>
<Grid item lg={6} md={6} sm={12} xs={12}  className="office-address-grid">
    <Typography className="office-address-title">
    Add Treatments{" "}
    </Typography>
  </Grid>
  <Grid item lg={6} md={6} sm={12} xs={12}
    className="add-remove-treatments-button"
  >

<CustomButton className="save-changes-button" onClick={handleOpen}>
            save changes
          </CustomButton>
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
              <Grid lg={4} md={4} xs={4} sm={4} className="selected-count-grid">
                <Typography variant="h6" className="treatments-sub-heading">
                  {checked.id.length}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item lg={12} xs={12}>
                {fieldData.area &&
                  fieldData.area.map((item: any, index: any) => (
                    <MenuItem key={item.title} value={item.title}>
                      <ListItemText primary={item.title.charAt(0).toUpperCase() + item.title.slice(1) } style={{whiteSpace: "break-spaces"}} />
                      <Checkbox
                        checked={includes(checked.id, item.id)}
                        name={item.title}
                        id={item.id}
                        onChange={(event: any) =>
                          handleCheckBoxChange(event, item.id)
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
          <Typography className="treatment-area-category">Category</Typography>
          <Card>
            <Grid container className="treatments-sub-heading-grid">
              <Grid item lg={8} xs={8}>
                <Typography variant="h6" className="treatments-heading">
                  Selected
                </Typography>
              </Grid>
              <Grid item xs={4} lg={4} className="selected-count-grid">
                <Typography variant="h6" className="treatments-sub-heading">
                  {(categoryChecked && categoryChecked?.length) || 0}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item lg={12} xs={12}>
                {fieldData.category &&
                  fieldData.category.map((items) => {
                    return (
                      <MenuItem key={items.id} value={items.type}>
                        <ListItemText primary={items.title.charAt(0).toUpperCase() + items.title.slice(1)} style={{whiteSpace: "break-spaces"}} />
                        <Checkbox
                          name={items.title}
                          id={items.id}
                          onChange={(event: any) =>
                            handleCheckBoxCategoryChange(event, items.pivot)
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
                <Typography variant="h6" className="treatments-sub-heading">
                  {(subCategoryChecked && subCategoryChecked.length) || 0}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item lg={12} xs={12}>
                {fieldData &&
                  fieldData.subCategory.length > 0 &&
                  fieldData.subCategory.map((items) => {
                    return (
                      <MenuItem key={items.id} value={items?.title}>
                        <ListItemText primary={items.title.charAt(0).toUpperCase() + items.title.slice(1)} style={{whiteSpace: "break-spaces"}} />
                        <Checkbox
                          name={items.title}
                          id={items.id}
                          onChange={(event: any) =>
                            handleCheckBoxSubCategoryChange(event, items.pivot)
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
                <Typography variant="h6" className="treatments-sub-heading">
                  {treatmentsChecked.length}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item lg={12} xs={12}>
                {fieldData?.Treatement &&
                  fieldData?.Treatement.map((items) => {
                    return (
                      <MenuItem key={items.id} value={items.id}>
                        <ListItemText style={{ textTransform: 'capitalize',whiteSpace: "break-spaces" }} primary={items.title} />
                        <Checkbox
                          name={items.title}
                          value
                          id={items.id}
                          onChange={(event: any) =>
                            handleCheckBoxTreatmentsChange(event, items.pivot)
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
      </Grid>
    </div>
  );
};

export default withRouter(TreatmentsSaveInfo);
