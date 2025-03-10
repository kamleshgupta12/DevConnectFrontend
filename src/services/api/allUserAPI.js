import axios from "axios";


export const getAllUserApi = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/profile/getAllUser`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    return error.response?.data ;
  }
};

export const deleteUserApi = async (_id) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/profile/delete-user`,
      { _id },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const viewUserApi = async (_id) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/profile/view-user/${_id}`,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};
export const singleUserApi = async (_id) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/profile/single-user/${_id}`,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

