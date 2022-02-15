import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './redux/store'
import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// import { createStore } from "redux";
// import { combineReducers } from 'redux';
//
// const initialState = {
//     cart: [
//         {
//             product: 'bread 700g',
//             quantity: 2,
//             unitCost: 90
//         },
//         {
//             product: 'milk 500ml',
//             quantity: 1,
//             unitCost: 47
//         }
//     ]
// }
//
// const productsReducer = function(state= initialState, action) {
//     console.log('productsReducer==>', action)
//     return state;
// }
// const ADD_TO_CART = 'ADD_TO_CART';
// const cartReducer = function(state=initialState, action) {
//     console.log('cartReducer==>', action)
//     switch (action.type) {
//         case ADD_TO_CART: {
//             return {
//                 ...state,
//                 cart: [...state.cart, action.payload]
//             }
//         }
//
//         default:
//             return state;
//     }
// }
//
// function addToCart(product, quantity, unitCost) {
//     return {
//         type: ADD_TO_CART,
//         payload: { product, quantity, unitCost }
//     }
// }
//
// const allReducers = {
//     products: productsReducer,
//     shoppingCart: cartReducer
// }
//
// const rootReducer = combineReducers(allReducers);
//
// let store = createStore(rootReducer);
//
//
// let unsubscribe = store.subscribe(() =>
//     console.log('unsubscribe==>', store.getState())
// );
// //
// store.dispatch(addToCart('Coffee 500gm', 1, 250));
// store.dispatch(addToCart('Flour 1kg', 2, 110));
// store.dispatch(addToCart('Juice 2L', 1, 250));
//
//
// unsubscribe();
//
// console.log("initial state: ", store.getState());
