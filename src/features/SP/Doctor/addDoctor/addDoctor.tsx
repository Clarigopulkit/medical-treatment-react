import { Button, ButtonBase, Paper, styled } from "@material-ui/core";
import { Formik } from "formik";
import axios from "axios";
import React, { useState, useEffect } from "react";
import "./index.css";
import { BrowserRouter as Router, useHistory, useRouteMatch } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { closeSpinner, loadSpinner } from "../../../../reducres/reducers/spinner";
import CustomButton from "../../../reusable/customButton/customButton";
import { Pagination, PaginationItem, Rating } from "@material-ui/lab";
import { fetchDoctor, DeleteDoctorClinic } from "../addDoctor/addDoctorSlice";
import Toast from "../../../../reducres/reducers/toast";
import List from "../addDoctor/List";
import CustomPopup from "../../../reusable/customPopup/customPopup";


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
  fontWeight: 800,
}));

const AddDoctor = () => {
  const history = useHistory()
  let { path, url } = useRouteMatch();
  useEffect(() => {
    window.scrollTo(0, 0)
    if ((path = "/clinic-personal-info/Add-Doctor")) {
    }
  });

  const [list, setList] = useState([]);
  const dispatch = useAppDispatch();
  const [page, setPage] = React.useState(1);
  const [lastcount, setLastcount] = useState();


  const getDoctors = () => {
    dispatch(loadSpinner());
    setTimeout(() => {
      dispatch(closeSpinner());
    }, 3000);

    dispatch(fetchDoctor(page)).then(response => {
      // console.log(response?.payload?.data);
      setList(response?.payload?.data);
      setLastcount(response?.payload?.last_page);
    })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    getDoctors()
  }, [page]);


  const handleChange = (event, value) => {
    setPage(value);
  };

  return (

    <div className={`doctor-profile-personal-info-tab`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px' }}>
        <p style={{ color: "#085044", fontSize: 30, fontWeight: 'bold' }} >Doctors</p>

        <div style={{ marginLeft: 'auto', }} >
          <MyButton onClick={() => history.push("/add-new-doctor")} label={'Add More...'} />
        </div>
      </div>
      <div>
        {list.map(item => <DoctorItem refresh={getDoctors} item={item} />)}
      </div>
      <div style={{ display: 'flex', padding: 15, justifyContent: 'flex-end', background: "#ffdedd50" }} >

        <div className="d-flex align-items-center page-dropdown">
        </div>

        <div style={{display : 'flex', flexDirection :'row', alignItems  :'center'}} >
          <Pagination
            style={{ border: '1px #ddd solid', borderRadius: 15 }}
            count={lastcount}
            page={page}
            onChange={handleChange} />
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page == lastcount}
            style={{ background: '#085044', height : 35, marginLeft : 20, borderRadius: 30, color: 'white', opacity: page == lastcount ? .5 : 1 }}
            variant="contained">Next</Button>
        </div>

      </div>
    </div>
  );
};
export default AddDoctor;

const MyButton = ({ onClick = null, label, outlined = false }) => {
  return (
    <div
      onClick={onClick}
      style={{ borderRadius: 50, borderWidth: 2, borderStyle: 'solid', borderColor: outlined ? "#085044" : "white", backgroundColor: outlined ? "white" : "#085044", padding: '10px 30px 10px 30px', marginBottom: 10, cursor: 'pointer', minWidth: 200 }} >
      <p style={{ color: outlined ? "#085044" : 'white', fontSize: 16, fontWeight: 'bold', padding: 0, margin: 0, textAlign: 'center' }} >{label}</p>
    </div>
  )
}
const DoctorItem = ({ refresh, ...props }) => {
  const [popupProps, setPopupProps] = useState<any>()
  const history = useHistory()
  console.log(props);
  const dispatch = useAppDispatch();

  const removeData = (id) => {
    setPopupProps({
      title: 'Delete', message: 'Are you sure you want to delete the doctor?', onYes: () => {
        dispatch(loadSpinner());
        let DataForDelete = { "user_id": id }
        dispatch(DeleteDoctorClinic(DataForDelete))
          .then((result) => {
            if (result.payload.length == 0) {
              Toast.success("Doctor deleted Successfully.");
              //refersh
              refresh()
            } else {
              Toast.error(result?.payload.data.message);
            }
          })
          .catch((err) => {
            Toast.error(err?.message);
          });
      }
    })
  }

  // console.log('-----',props)
  return (
    <div className="doctor-item" style={{ display: 'flex', padding: 50, margin: 0, borderStyle: 'solid', borderWidth: '1px 0 0 0', borderColor: "#ffdedd" }}>
      {popupProps && <CustomPopup visible={popupProps ? true : false} dismiss={() => setPopupProps(null)} {...popupProps} />}


      <img
        src={
          props.item.file_url !== undefined &&
            typeof props.item?.file_url == "string"
            ? props.item?.file_url
            : "https://media.istockphoto.com/photos/team-of-doctors-and-nurses-in-hospital-picture-id1307543618?b=1&k=20&m=1307543618&s=170667a&w=0&h=hXpYmNYXnhdD36C-8taPQvdpM9Oj-woEdge8nvPrsZY="
        }
        style={{ height: 130, width: 130, objectFit: 'cover' }} />


      <div style={{ paddingLeft: 40, flexGrow: 1, maxWidth : '30%' }} >
        <p style={{ color: "#085044", fontSize: 18, fontWeight: 'bold', paddingBottom: 15, margin: 0 }} ></p>
        <p style={{ color: "#085044", paddingBottom: 10, margin: 0, fontWeight: 'bold' }} >SP ID: {props.item.unique_code}</p>
        <p style={{ color: "#085044", margin: 0, fontWeight: 'bold' }} >{props.item.name}</p>
        {props?.item?.user_details?.speciality != null && JSON.parse(props?.item?.user_details?.speciality)?.map((itemnew, index) => <span style={{ color: "#085044", margin: 0, fontWeight: 'bold' }} >{itemnew.label}{" "} </span>)}
      </div>
      <div style={{ width: 1, height: 130, backgroundColor: '#ffdedd' }} />
      <div style={{ paddingLeft: 40, flexGrow: 1 }} >
        <p style={{ color: "#085044", fontSize: 16, fontWeight: 'bold', paddingBottom: 15, margin: 0 }} >Rating</p>
        <div style={{ display: 'flex', }} >
          <Rating readOnly color="#eb8f34" size="medium" value={1} />
          <p style={{ color: "#085044", paddingBottom: 10, paddingLeft: 5, margin: 0, fontWeight: 'bold' }}>1.0(24)</p>
        </div>
      </div>
      <div style={{ width: 1, height: 130, backgroundColor: '#ffdedd' }} />
      <div style={{ padding: '0 0 0 40px' }} >
        <MyButton onClick={() => history.push('clinic-personal-info/view-doctor-details/' + props.item.id)} label={"View Details"} />
        <MyButton
          onClick={() => {
            removeData(props.item.id);
            return false;
          }}
          outlined label={"Delete"} />
      </div>
    </div>
  )
}
