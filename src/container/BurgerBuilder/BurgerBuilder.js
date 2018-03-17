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

import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {

    state = {
            purchasable : false,
            purchasing : false,
            loading : false,
           }
    
    componentDidMount(){
        this.props.onInitIngredient();
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
        this.props.onInitPurchase();
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
        ings : state.burgerBuilder.ingredients,
        price : state.burgerBuilder.totalPrice,
        error : state.burgerBuilder.error
    }
};

const mapDispatchToProps = dispatch => {
        return {
            onIngredientAdded : (ingName) => dispatch(actions.addIngredient(ingName)),
            onIngredientRemoved : (ingName) => dispatch(actions.removeIngredient(ingName)),
            onInitIngredient : () => dispatch(actions.initIngredients()),
            onInitPurchase : () => dispatch(actions.purchaseBurgerInit())
        }
};



export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( BurgerBuilder, axios ));