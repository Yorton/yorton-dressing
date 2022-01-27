import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps'

export default function PaymentMethodScreen() {

    const navigate = useNavigate();

    const cart = useSelector(state => state.cart);
    const {shippingAddress} = cart;
    if (!shippingAddress){
        navigate('/shipping');
    }

    const [paymentMethod, setPaymentMethod] = useState('LinePay');

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };


    return (
        <div>
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>Payment Method</h1>
                </div>
                <div>
                    <div>
                        <input type='radio'
                        id='linePay'
                        value='LinePay'
                        name='paymentMethod'
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required checked
                        >
                        </input>
                        <label htmlFor='linePay'>LinePay</label>
                    </div>
                </div>
                <div>
                    <div>
                        <input type='radio'
                        id='jkoPay'
                        value='JKOPay'
                        name='paymentMethod'
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                        >
                        </input>
                        <label htmlFor='jkoPay'>JKOPay</label>
                    </div>
                </div>
                <div>
                    <button className='primary' type='submit'>Continue</button>
                </div>
            </form>
        </div>
    )
}
