import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { detailsOrder, payOrder, payOrderRequest } from '../actions/orderAction';
import LinepayButton from '../components/LinepayButton';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

import { payConfirm } from '../actions/payConfirmActions';


export default function OrderScreen() {

    const dispatch = useDispatch();

    const params = useParams();
    const { id: orderId, userId, price } = params;

    const [searchParams, setSearchParams] = useSearchParams();
    const transactionId = searchParams.get("transactionId");

    const orderDetails = useSelector(state => state.orderDetails);
    const {order, loading, error} = orderDetails;

    const [sdkReady, setSdkReady] = useState(false);

    const orderPay = useSelector(state => state.orderPay);
    const {loading: loadingPay, error: errorPay, success: successPay, paymentUrl} = orderPay;

    const paymentConfirm = useSelector(state => state.paymentConfirm);
    const {confirmPay} = paymentConfirm;


    useEffect(() => {

        // const addLinepayScript = async () => {
        //     //LINE_PAY_CLIENT_ID: process.env.LINE_PAY_CLIENT_ID,
        //     //LINE_PAY_CLIENT_SECRET: process.env.LINE_PAY_CLIENT_SECRET
        //     const {data} = await Axios.get('/api/config/linepay');
        //     const script = document.createElement('script');
        //     script.type = 'text/javascript';
        //     script.src = 'https://sandbox-api-pay.line.me/v2/payments/request';
        //     script.async = true;
        //     script.onload = () => {
        //         setSdkReady(true);
        //     };
        //     document.body.appendChild(script);
        // };


        if (confirmPay){

            if (confirmPay.returnCode === "0000"){//成功

                const paymentResult = {
                    id: confirmPay.info.orderId,
                    method: confirmPay.info.payInfo[0].method,
                    amount: confirmPay.info.payInfo[0].amount,
                    maskedCreditCardNumber: confirmPay.info.payInfo[0].maskedCreditCardNumber
                };
        
                dispatch(payOrder(order, paymentResult));//linepay支付資料入檔
            }
        }
    

        if (!confirmPay && transactionId && userId && price){//確認支付前,先取得使用者token

            dispatch(payConfirm(transactionId, userId, price));
        }

        if (paymentUrl){//導入linepay支付頁面時,token將會遺失, 先keep userId做後續重新取得token

            window.location.href = paymentUrl;
        }

        if (!order ||
            successPay ||
            (order && order._id !== orderId)){ // url-orderId != data-order need to get from backend data){
           
                dispatch({type: ORDER_PAY_RESET});
                dispatch(detailsOrder(orderId));
              
        }else{
            if (!order.isPaid){
                //addLinepayScript();
                setSdkReady(true);
            }
        }
  
        
    }, [dispatch, orderId, order, sdkReady, successPay, paymentUrl, transactionId, userId, price, confirmPay]);



    const successPaymentHandler = (/*paymentResult*/) => {

        // const paymentResult = {
        //     id: orderId,
        //     status: 'Paid',
        //     update_time: Date.now().toString(),
        //     email_address: ''
        // };

        // dispatch(payOrder(order, paymentResult));

        dispatch(payOrderRequest(order));
    };

   

    return loading ? (<LoadingBox></LoadingBox>) :
    error ? (<MessageBox variant='danger'>{error}</MessageBox>) 
    :
    (
        <div>
            <h1>Order {order._id}</h1>
            <div className='row top'>
                <div className='col-2'>
                    <ul>
                        <li>
                            <div className='card card-body'>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name: </strong>{order.shippingAddress.fullName} <br/>
                                    <strong>Address: </strong>{order.shippingAddress.address},
                                    {order.shippingAddress.city},{order.shippingAddress.postalCode},
                                    {order.shippingAddress.country}
                                </p>
                                {
                                    order.isDelivered 
                                    ? (<MessageBox variant='success'>Delivered at {order.deliveredAt}</MessageBox>)
                                    : (<MessageBox variant='danger'>Not Delivered</MessageBox>)
                                }
                            </div>
                        </li>
                        <li>
                            <div className='card card-body'>
                                <h2>Payment</h2>
                                <p>
                                    <strong>Method: </strong>{order.paymentMethod}
                                </p>
                                {
                                    order.isPaid 
                                    ? (<MessageBox variant='success'>Paid at {order.paidAt}</MessageBox>)
                                    : (<MessageBox variant='danger'>Not Paid</MessageBox>)
                                }
                            </div>
                        </li>
                        <li>
                            <div className='card card-body'>
                                <h2>Order Items</h2>
                                <ul>
                                    {
                                        order.orderItems.map(item => (
                                            <li key={item.product}>
                                                <div className='row'>
                                                    <div>
                                                        <img src={item.image} alt={item.name} className='small'></img>
                                                    </div>  
                                                    <div className='min-30'>
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </div>  

                                                    <div>{item.qty} x ${item.price} = ${item.qty * item.price}</div>
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className='col-1'>
                    <div className='card card-body'>
                        <ul>
                            <li>
                                <h2>Order Summary</h2>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>Items</div>
                                    <div>${order.itemsPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>Shipping</div>
                                    <div>${order.shippingPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>Tax</div>
                                    <div>${order.taxPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div><strong>Order Total</strong></div>
                                    <div><strong>${order.totalPrice.toFixed(2)}</strong></div>
                                </div>
                            </li>
                            {
                                !order.isPaid && (
                                    <li>
                                        {
                                            !sdkReady ? (
                                                <LoadingBox></LoadingBox>
                                            ):(
                                                <>
                                                    {
                                                        errorPay && (
                                                            <MessageBox variant='danger'>{errorPay}</MessageBox>
                                                        )
                                                    }
                                                    {
                                                        loadingPay && (
                                                            <LoadingBox></LoadingBox>
                                                        )
                                                    }
                                                    {
                                                        //<LinepayButton amount={order.totalPrice}
                                                        //onSuccess={successPaymentHandler}></LinepayButton>
                                                    }
                                                    <button type='button' onClick={successPaymentHandler}>Pay</button>
                                                </>
                                            )
                                        }
                                    </li>
                                ) 
                            }
                        </ul>
                    </div>              
                </div>
             </div>
        </div>
    )
}
