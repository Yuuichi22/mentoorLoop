import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import userReducer from './features/Auth/authSlice'

export const store  = configureStore({
    reducer : {
        user : userReducer
    }
})

export const persistor = persistStore(store)

// Define RootState type for useSelector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;