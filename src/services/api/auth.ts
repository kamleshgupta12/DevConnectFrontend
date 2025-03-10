import axiosInstance from '../../../src/utils/axiosIntance';

// Sign-In API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const signInApi = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post('/auth/signin', {
      email,
      password
    });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

// Sign-Out API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const signOutApi = async () => {
  const response = await axiosInstance.post('/auth/signout');
  return response.data;
};
export const getUserApi = async (token: string) => {
  const response = await axiosInstance.get(`/user/getUser/${token}`);
  return response.data;
};

// Sign-Up API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const signUpApi = async (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const response = await axiosInstance.post('./auth/signup', {
      fullName,
      email,
      password,
      confirmPassword
    });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

// Forgot  Password  API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const forgotPasswordApi = async (email: string) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', {
      email
    });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

// reset password >>>>>>>>>>>>>>>>>>>>

export const resetPasswordApi = async (
  password: string,
  confirmPassword: string,
  token: string
) => {
  try {
    const response = await axiosInstance.post(
      `/auth/change-password/${token}`,
      {
        password,
        confirmPassword
      }
    );
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const viewUserApi = async (token: string) => {
  const response = await axiosInstance.get(`/auth/view-user/${token}`);
  return response.data;
};
