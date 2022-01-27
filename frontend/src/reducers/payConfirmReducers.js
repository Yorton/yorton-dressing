import {PAY_CONFIRM_FAIL, 
        PAY_CONFIRM_SUCCESS, 
        PAY_CONFIRM_TOKEN } from "../constants/payConfirmConstants";

export const payConfirmReducer = (state={}, action) => {

    switch (action.type){
        case PAY_CONFIRM_SUCCESS:
            return {confirmPay: action.payload};
        case PAY_CONFIRM_TOKEN:
            return {userInfo: action.payload};
        case PAY_CONFIRM_FAIL:
            return {error: action.payload};
        default:
            return state;
    }
};

// module.exports = payConfirmReducer = (state={}, action) => {

//     return {confirmPay: action};
// };

