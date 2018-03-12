import React, { Component } from 'react';
import Auxilary from '../../hoc/Auxilary';
import Burger from '../../components/Burger/Burger'; 
import BuildControls from '../../components/Burger/BuildControls/BuildControls'; 
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders.js';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
// import BurgerIngredient from '../../components/Burger/BurgerIngredient/BurgerIngredient';

const INGREDIENT_PRICE = {
    salad : 0.5,
    bacon : 0.7,
    cheese : 0.4,
    meat : 1.3
};

class BurgerBuilder extends Component {

    state = {
            ingredients: null,
            totalPrice : 4,
            purchasable : false,
            purchasing : false,
            loading : false,
            error : false,
           }

    componentDidMount(){
        axios.get('https://burger-king-5f393.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({
                    ingredients : response.data
                })
            })
            .catch(error =>{
                this.setState({
                    error : true
                })
            });
    }

    purchasable(ingredients){
        const sum = Object.keys(ingredients).map(key => ingredients[key]).reduce((sum, el) =>{
                        return sum + el;
                    }, 0);
        this.setState({
            purchasable : sum>0
        });
    }

    addIngredientHandler = (type) => {
        const ingredientCount = this.state.ingredients[type];
        const newIngredientCount = ingredientCount + 1;

        const newIngredient = {
            ...this.state.ingredients
        };
        newIngredient[type] = newIngredientCount;

        const oldPrice = this.state.totalPrice;
        const priceAddition = INGREDIENT_PRICE[type];
        const newPrice = oldPrice + priceAddition;

        this.setState({
            totalPrice : newPrice,
            ingredients : newIngredient
        });
        this.purchasable(newIngredient);
    };

    removeIngredientHandler = (type) => {
        const ingredientCount = this.state.ingredients[type];
        if(ingredientCount <= 0){
            return;
        }

        const newIngredientCount = ingredientCount - 1;

        const newIngredient = {
            ...this.state.ingredients
        };
        newIngredient[type] = newIngredientCount;

        const oldPrice = this.state.totalPrice;
        const priceDeduction = INGREDIENT_PRICE[type];
        const newPrice = oldPrice - priceDeduction;

        this.setState({
            totalPrice : newPrice,
            ingredients : newIngredient
        });
        this.purchasable(newIngredient);
    };

    purchaseHandler = () =>{
        this.setState({ purchasing : true });
    };

    purchaseCancelHandler = () => {
        this.setState({ purchasing : false });
    };

    purchaseContinueHandler = () => {
        //alert('You can continue..!');
        /*  */

        const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) +'='+encodeURIComponent(this.state.ingredients[i]));
        }

        queryParams.push('price='+ this.state.totalPrice);
        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search : '?'+queryString

        });
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key]<=0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients cannot be loader </p> : <Spinner/>;

        if(this.state.ingredients){
            burger = (
                <Auxilary>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls ingredientAdded={this.addIngredientHandler} 
                            ingredientRemoved={this.removeIngredientHandler}
                            disabledInfo={disabledInfo}
                            price = {this.state.totalPrice}
                            purchasable = {this.state.purchasable}
                            ordered={this.purchaseHandler}/>
                </Auxilary>
            );
            orderSummary = <OrderSummary ingredients={this.state.ingredients} 
                    modalClosed={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    totalPrice = {this.state.totalPrice}  />;
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

export default withErrorHandler( BurgerBuilder, axios );