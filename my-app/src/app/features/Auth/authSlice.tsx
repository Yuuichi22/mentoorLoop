import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"
interface UserState {

  id : number
  bio : string,
  profileUrl : string
  firstname: string;
  lastname: string;
  user_type: string;
  email: string;
}
const persistConfig = {
  key: "root",
  storage,
};
const initialState: UserState = {
  id : -1,
  bio : "",
  profileUrl : "",
  firstname: "default firstname ",
  lastname: "default lastname",
  user_type: "STUDENT",
  email: "default@gmail.com",
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    resetUser: () => initialState, // Resets to the initial state
  },
});

export const { updateUser, resetUser } = authSlice.actions;
export default persistReducer(persistConfig,authSlice.reducer);
