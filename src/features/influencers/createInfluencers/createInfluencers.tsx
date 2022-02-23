import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { updateTextFields } from "./createInfluencersSlice";
import CustomButton from "../../reusable/customButton/customButton";
import CustomTextField from "../../reusable/customTextField/customTextField";
import {
  fetchCreateInfluencerAsync,
  selectCreateInfluencer,
} from "./createInfluencersSlice";

const CreateInfluencers: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState();
  const { createInfluencer } = useAppSelector(selectCreateInfluencer);

  const handleChange = (e: any) => {
    dispatch(updateTextFields({ name: e.target.name, value: e.target.value }));
  };
  const handleClick = () => {
    dispatch(
      fetchCreateInfluencerAsync({
        name: createInfluencer.name,
        state: createInfluencer.state,
        city: createInfluencer.city,
        zip_code: createInfluencer.zipCode,
        title: createInfluencer.title,
        description: createInfluencer.description,
        email: createInfluencer.email,
        phone: createInfluencer.phone,
      })
    );
  };
  return (
    <>
      <CustomTextField
        className="login-text-field"
        variant="outlined"
        fullWidth
        name="name"
        id="name"
        placeholder="User Name"
        onChange={handleChange}
      />
      <CustomTextField
        className="login-text-field"
        variant="outlined"
        fullWidth
        name="state"
        id="name"
        placeholder="State"
        onChange={handleChange}
      />
      <CustomTextField
        className="login-text-field"
        variant="outlined"
        fullWidth
        name="city"
        id="name"
        placeholder="City"
        onChange={handleChange}
      />
      <CustomTextField
        className="login-text-field"
        variant="outlined"
        fullWidth
        name="zipCode"
        id="name"
        placeholder="ZipCode"
        onChange={handleChange}
      />
      <CustomTextField
        className="login-text-field"
        variant="outlined"
        fullWidth
        name="Title"
        id="name"
        placeholder="Title"
        onChange={handleChange}
      />
      <CustomTextField
        className="login-text-field"
        variant="outlined"
        fullWidth
        name="Description"
        id="name"
        placeholder="Description"
        onChange={handleChange}
      />
      <CustomTextField
        className="login-text-field"
        variant="outlined"
        fullWidth
        name="email"
        id="name"
        placeholder="Email"
        onChange={handleChange}
      />
      <CustomTextField
        className="login-text-field"
        variant="outlined"
        fullWidth
        name="phone"
        id="name"
        placeholder="Phone"
        onChange={handleChange}
      />
      <CustomButton onClick={handleClick}>Add Influencer</CustomButton>
    </>
  );
};

export default CreateInfluencers;
