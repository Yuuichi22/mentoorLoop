
import { AppDispatch } from './../app/Store';
import { updateUser as updateUserAction } from '../app/features/Auth/authSlice';

export const updateUser = async (dispatch : AppDispatch, token : string,data : any) => {
    const UPDATE_USER_URI = import.meta.env.VITE_UPDATE_USER
   const res = await fetch(UPDATE_USER_URI,{
    method : "POST",
    headers : {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
    },
    body : JSON.stringify(data)
   })

   if(res) {
    const resData = await res.json();
    console.log(resData);
    const userData = {...resData.user.user,...resData.user.other}
    dispatch(updateUserAction(userData))
   }
   

}