import { updateUser, resetUser } from "../app/features/Auth/authSlice";
import { AppDispatch } from "../app/Store"; // Import AppDispatch from store

const loginUser = async (
  dispatch: AppDispatch, // Accept dispatch as argument
  credentials: { email: string; password: string }
) => {
  const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    return {};
  }

  const data = await res.json();
  console.log("log from authService",data);
  localStorage.setItem("token", data.token);
  dispatch(updateUser({...data.payload.user,...data.payload.other})); // Dispatch action inside function

  return data;
};

const registerUser = async (
  dispatch: AppDispatch, // Accept dispatch as argument
  credentials: {
    firstname: string;
    lastname: string;
    user_type: string;
    email: string;
    password: string;
  }
) => {
  const SIGN_UP_URL = import.meta.env.VITE_SIGN_UP_URL;
  const res = await fetch(SIGN_UP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    return {};
  }

  const data = await res.json();
  console.log(data);
  localStorage.setItem("token", data.token);
  dispatch(updateUser(data.data)); // Dispatch action inside function

  return data;
};

const logout = (dispatch: AppDispatch) => {
  localStorage.removeItem("token");
  dispatch(resetUser()); // Dispatch action inside function
};

export { loginUser, registerUser, logout };
