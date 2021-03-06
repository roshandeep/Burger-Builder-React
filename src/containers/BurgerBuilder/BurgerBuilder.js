import React, {Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/AuxHoc/AuxHoc';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorhandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component{

    state={
        purchasing: false,
        loading: false,
        error: false
    }

    //best place to fetch data
    componentDidMount(){
        // axios.get('https://burger-builder-react-b84b2.firebaseio.com/ingredients.json')
        //     .then(response =>{
        //         this.setState({ingredients: response.data});
        //     })
        //     .catch(error => {
        //         this.setState({error: true});
        //     });
    }

    updatePurchaseState(ingredients){
        const sum=Object.keys(ingredients)
            .map(igKey=>{
                return ingredients[igKey];
            })
            .reduce((sum , el)=>{
                return sum + el;
            }, 0);
        
        return sum > 0;
    }

    //Arrow functions maintain states but regular functions if the method is triggered through an event.
    //So we use arrow function
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () =>{
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }

    render(){

        const disabledInfo={
            ...this.props.ings
        };
        for(let key in disabledInfo){
            disabledInfo[key]=disabledInfo[key]<=0
        }
        //{ salad:true, meat:false, bacon:true.....}

        let orderSummary = null

        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />
         if(this.props.ings){
            burger = (
                <Aux>
                <Burger ingredients={this.props.ings}/>
                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    purchasable={this.updatePurchaseState(this.props.ings)} 
                    disabled={disabledInfo}
                    ordered={this.purchaseHandler}
                    price={this.props.price} />
                </Aux>
            );

            orderSummary = <OrderSummary 
                            price={this.props.price}
                            ingredients={this.props.ings}
                            purchaseCancelled={this.purchaseCancelHandler}
                            purchaseContinued={this.purchaseContinueHandler} />
        }
        
        if(this.state.loading){
            orderSummary = <Spinner />
        }        

        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state =>{
    return {
        ings: state.ingredients,
        price: state.totalPrice
    };
}

const mapDispatchToProps = (dispatch) =>{
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    };
}

export default connect(mapStateToProps, mapDispatchToProps)( withErrorhandler(BurgerBuilder, axios)); 