import React from 'react';
import Auxilary from '../../../hoc/Auxilary';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {
   
    const ingredientSummary = Object.keys(props.ingredients).map(igKey => {
                return(
                    <li key={igKey}>
                        <span style={{textTransform: 'capitalize'}}>{igKey}</span> : {props.ingredients[igKey]}
                    </li>
                )});

    return(
        <Auxilary>
            <h3>Your Order</h3>
            <p>A delicious burger with following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: {props.totalPrice.toFixed(2)}</strong></p>
            <p>Continue to Checkout?</p>
            <Button clicked={props.modalClosed} btnType='Danger'>CANCEL</Button>
            <Button clicked={props.purchaseContinued} btnType='Success'>CONTINUE</Button>
        </Auxilary>
    )
};

export default orderSummary;