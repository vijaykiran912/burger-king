import * as actionTypes from '../actions/actionTypes';
import { updateObject } from './utility';

const initialState = {
    orders: [],
    loading: false,
    purchased: false
};

const purchaseBurgerInit = ( state, action ) => {
    return updateObject( state, { purchased: false } );
};

const purchaseBurgerStart = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const purchaseBurgerSuccess = ( state, action ) => {
    const newOrder = updateObject( action.orderData, { id: action.orderId } );
    return updateObject( state, {
        loading: false,
        purchased: true,
        orders: state.orders.concat( newOrder )
    } );
};

const purchaseBurgerFailure = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const fetchOrdersInit = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const fetchOrdersSuccess = ( state, action ) => {
    return updateObject( state, {
        orders: action.orders,
        loading: false
    } );
};

const fetchOrdersFailure = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.PURCHASE_BURGER_INIT: return purchaseBurgerInit( state, action );
        case actionTypes.PURCHASE_BURGER_START: return purchaseBurgerStart( state, action );
        case actionTypes.PURCHASE_BURGER_SUCCESS: return purchaseBurgerSuccess( state, action )
        case actionTypes.PURCHASE_BURGER_FAILURE: return purchaseBurgerFailure( state, action );
        case actionTypes.FETCH_ORDERS_INIT: return fetchOrdersInit( state, action );
        case actionTypes.FETCH_ORDERS_SUCCESS: return fetchOrdersSuccess( state, action );
        case actionTypes.FETCH_ORDERS_FAILURE: return fetchOrdersFailure( state, action );
        default: return state;
    }
};

export default reducer;