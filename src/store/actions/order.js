import * as actionTypes from './actionTypes';
import axios from '../../axios-orders.js';


export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type : actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId : id,
        orderData : orderData
    }
};

export const purchaseBurgerFailure = (error) => {
    return {
        type : actionTypes.PURCHASE_BURGER_FAILURE,
        error : error
    }
}

export const purchaseBurgerStart = () => {
    return {
        type : actionTypes.PURCHASE_BURGER_START
    }
}

export const purchaseBurgerInit = () => {
    return{
        type : actionTypes.PURCHASE_BURGER_INIT
    }
}

export const purchaseBurger = (orderData) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        axios.post( '/orders.json', orderData )
            .then( response => {
                console.log(response.data);
                dispatch(purchaseBurgerSuccess(response.data.name, orderData));
            } )
            .catch( error => {
                dispatch(purchaseBurgerFailure( error ));
            } );
    }
}

export const fetchOrdersSuccess = (orders) => {
    return {
        type : actionTypes.FETCH_ORDERS_SUCCESS,
        orders : orders
    }
};

export const fetchOrdersFailure = (error) => {
    return {
        type : actionTypes.FETCH_ORDERS_FAILURE,
        error : error
    }
}

export const fetchOrdersInit = () => {
    return {
        type : actionTypes.FETCH_ORDERS_INIT
    }
}

export const fetchOrders = () => {
    return dispatch => {
        dispatch(fetchOrdersInit());
        axios.get( '/orders.json')
            .then( res => {
                const fetchOrders = [];
                for(let key in res.data){
                    fetchOrders.push({
                        ...res.data[key],
                        id:key
                    });
                }
                dispatch(fetchOrdersSuccess(fetchOrders));
            } )
            .catch( error => {
                dispatch(fetchOrdersFailure( error ));
            } );
    }
}