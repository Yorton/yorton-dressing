import Axios from "axios";
import {PAY_CONFIRM_FAIL, 
        PAY_CONFIRM_SUCCESS, 
        PAY_CONFIRM_TOKEN, } from "../constants/payConfirmConstants";

const getUserToken = async (dispatch, id) => {
    const {data} = await Axios.get(`/api/users/userToken/${id}`);
    localStorage.setItem('userInfo', JSON.stringify(data));
    dispatch({type: PAY_CONFIRM_TOKEN, payload: data});
};

export const payConfirm = (transactionId, userId, price) => async (dispatch, getState) => {

    try{
        //以userId取token
        const login = await getUserToken(dispatch, userId);

        const {data} = await Axios.get(`/api/linepay/confirm?transactionId=${transactionId}&price=${price}`);

        dispatch({type: PAY_CONFIRM_SUCCESS, payload: data});

    }catch(error){
        dispatch({
            type: PAY_CONFIRM_FAIL, 
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message});
    }

};