import React from 'react'
import { useSelector } from 'react-redux'
import {Route, Redirect, Navigate} from 'react-router-dom'

const PrivateRoute = ({ children }) => {
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    return userInfo ? children : <Navigate to="/signin" />;
  };

export default PrivateRoute;

// export default function PrivateRoute({component: Component, ...rest}) {

//     const userSignin = useSelector(state => state.userSignin);
//     const {userInfo} = userSignin;

//     return (
//         <Route {...rest}
//                 render={(props) => {
//                                         userInfo ? (<Component {...props}></Component>)
//                                                  : (<Redirect to='signin'/>)
//                                     }
//                         }>
//         </Route>
//     )
// }
