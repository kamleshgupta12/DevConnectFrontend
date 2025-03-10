import { combineReducers } from "@reduxjs/toolkit";
import authReducer from '../slices/authSlice'
import cartReducer from '../slices/cartSlice'
import profileReducer from '../slices/profileSlice'
import courseReducer from '../slices/courseSlice'
import socialReducer from '../slices/socialSlice'
import allusersReducer from '../slices/Allusers'
import notificationReducer from '../slices/notificationSlice'


const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer,
    course: courseReducer,
    social: socialReducer,
    allusers: allusersReducer,
    notifications: notificationReducer

})
export default rootReducer;