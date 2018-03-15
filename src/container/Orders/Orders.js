import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {

    state = {
        orders : [],
        loading : true
    }


    componentDidMount(){
        axios.get('/orders.json')
             .then(res => {
                const fetchOrders = [];
                for(let key in res.data){
                    fetchOrders.push({
                        ...res.data[key],
                        id:key
                    });
                }
                this.setState({loading : false, orders : fetchOrders});
             })
             .catch(err => {
                this.setState({loading : false});
             })
    }

    render() {
        let order = !this.state.loading ?  this.state.orders.map(order => (
            <Order 
                key={order.id}
                ingredients = {order.ingredients}
                price = {order.price}
                />
        )) : <Spinner/>;
        return (
            <div>
               {order}
            </div>
        );
    }
}

export default withErrorHandler(Orders, axios);