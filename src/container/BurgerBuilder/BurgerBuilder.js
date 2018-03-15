import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxilary from '../../hoc/Auxilary';
import Burger from '../../components/Burger/Burger'; 
import BuildControls from '../../components/Burger/BuildControls/BuildControls'; 
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders.js';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
// import BurgerIngredient from '../../components/Burger/BurgerIngredient/BurgerIngredient';

import * as burgerBuilderActions from '../../store/actions/index';

class BurgerBuilder extends Component {

    state = {
            totalPrice : 4,
            purchasable : false,
            purchasing : false,
            loading : false,
            error : false,
           }

    componentDidMount(){
        /* axios.get('https://burger-king-5f393.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({
                    ingredients : response.data
                })
            })
            .catch(error =>{
                this.setState({
                    error : true
                })
            }); */
    }

    purchasable(ingredients){
        const sum = Object.keys(ingredients).map(key => ingredients[key]).reduce((sum, el) =>{
                        return sum + el;
                    }, 0);
        return sum>0;
    }

    purchaseHandler = () =>{
        this.setState({ purchasing : true });
    };

    purchaseCancelHandler = () => {
        this.setState({ purchasing : false });
    };

    purchaseContinueHandler = () => {
        //alert('You can continue..!');
        /*  */

        /* const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) +'='+encodeURIComponent(this.state.ingredients[i]));
        }

        queryParams.push('price='+ this.state.totalPrice);
        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search : '?'+queryString

        }); */

        this.props.history.push('/checkout'); 
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        };

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key]<=0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients cannot be loader </p> : <Spinner/>;
        if(this.props.ings){
            burger = (
                <Auxilary>
                <Burger ingredients={this.props.ings}/>
                <BuildControls ingredientAdded={this.props.onIngredientAdded} 
                            ingredientRemoved={this.props.onIngredientRemoved}
                            disabledInfo={disabledInfo}
                            price = {this.props.price}
                            purchasable = {this.purchasable(this.props.ings)}
                            ordered={this.purchaseHandler}/>
                </Auxilary>
            );
            orderSummary = <OrderSummary ingredients={this.props.ings} 
                    modalClosed={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    totalPrice = {this.props.price}  />;
        }

        if(this.state.loading){
            orderSummary = <Spinner/>;
        }

        return (
            <Auxilary>
                 <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                 </Modal>
                 {burger}
            </Auxilary>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings : state.ingredients,
        price : state.totalPrice
    }
};

const mapDispatchToProps = dispatch => {
        return {
            onIngredientAdded : (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
            onIngredientRemoved : (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName))
        }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( BurgerBuilder, axios ));