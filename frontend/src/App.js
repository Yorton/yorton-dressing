import react from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {BrowserRouter , Link, Route, Routes} from 'react-router-dom';
import { signout } from './actions/userActions';
import PrivateRoute from './components/PrivateRoute';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SigninScreen from './screens/SigninScreen';

function App() {

    const cart = useSelector(state => state.cart);
    const {cartItems} = cart;

    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;

    const dispatch = useDispatch();
    const signoutHandler = () =>{
        dispatch(signout());
    };


  return (

    <BrowserRouter>
        <div className="grid-container">
            <header className="row">
                <div>
                    <Link to="/" className="brand">yorton-dressing</Link>
                </div>
                <div>
                    <Link to="/cart" >
                        Cart
                        {
                            cartItems.length > 0 && (
                                <span className='badge'>{cartItems.length}</span>
                            )
                        }
                    </Link>
                    {
                        userInfo 
                        ? 
                        (
                            <div className='dropdown'>
                                <Link to="#" >{userInfo.name} <i className='fa fa-caret-down'></i></Link>
                                <ul className='dropdown-content'>
                                    <li>
                                        <Link to="/profile">User Profile</Link>
                                    </li>
                                    <li>
                                        <Link to="/orderhistory">Order History</Link>
                                    </li>
                                    <li>
                                        <Link to="#signout" onClick={signoutHandler}>Sign Out</Link>
                                    </li>
                                </ul>
                            </div>
                        )
                        : (<Link to="/signin" >Sign In</Link>)
                    }
                </div>
            </header>
            <main>
                <Routes>
                    <Route path="/cart/:id" element={<CartScreen/>} ></Route>
                    <Route path="/cart" element={<CartScreen/>} ></Route>
                    <Route path="/product/:id" element={<ProductScreen/>} ></Route>
                    <Route path="/signin" element={<SigninScreen/>} ></Route>
                    <Route path="/register" element={<RegisterScreen/>} ></Route>
                    <Route path="/shipping" element={<ShippingAddressScreen/>} ></Route>
                    <Route path="/payment" element={<PaymentMethodScreen/>} ></Route>
                    <Route path="/placeorder" element={<PlaceOrderScreen/>} ></Route>

                    <Route path="/order/:id" element={<OrderScreen/>} ></Route>
                    <Route path="/order/:id/:userId/:price" element={<OrderScreen/>} ></Route>
    
                    <Route path="/orderhistory" element={<OrderHistoryScreen/>} ></Route>

                    <Route path="/profile" element={
                                                    <PrivateRoute>
                                                        <ProfileScreen/>
                                                    </PrivateRoute>} >
                    </Route>
                    <Route path="/" element={<HomeScreen/>} exact></Route>
                </Routes>
             </main>
            <footer className="row center">All right reserved</footer>
        </div>
    </BrowserRouter>
  );
}

export default App;
