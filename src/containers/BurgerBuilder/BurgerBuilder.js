import React, {Component} from 'react';

import Aux from '../../hoc/AuxHoc/AuxHoc';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorhandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES={
    salad:.5,
    bacon:1,
    cheese:.75,
    meat:1.5
}

class BurgerBuilder extends Component{

    state={
        ingredients:null,
        totalPrice:4,
        purchasable:false,
        purchasing: false,
        loading: false,
        error: false
    }

    //best place to fetch data
    componentDidMount(){
        axios.get('https://burger-builder-react-b84b2.firebaseio.com/ingredients.json')
            .then(response =>{
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error: true});
            });
    }

    updatePurchaseState(ingredients){
        const sum=Object.keys(ingredients)
            .map(igKey=>{
                return ingredients[igKey];
            })
            .reduce((sum , el)=>{
                return sum + el;
            }, 0);
        
            this.setState({purchasable : sum > 0})
    }

    addIngredientHandler = (type) =>{
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount+1;
        const updatedIngredients={
            ...this.state.ingredients
        };
        updatedIngredients[type]=updatedCount;
        const priceAddition=INGREDIENT_PRICES[type];
        const oldPrice=this.state.totalPrice;
        const newPrice =oldPrice+priceAddition;

        this.setState({
            ingredients:updatedIngredients,
            totalPrice:newPrice
        });
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) =>{
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0){
            return;
        }
        const updatedCount = oldCount-1;
        const updatedIngredients={
            ...this.state.ingredients
        };
        updatedIngredients[type]=updatedCount;
        const priceDeduction=INGREDIENT_PRICES[type];
        const oldPrice=this.state.totalPrice;
        const newPrice =oldPrice-priceDeduction;

        this.setState({
            ingredients:updatedIngredients,
            totalPrice:newPrice
        });
        this.updatePurchaseState(updatedIngredients);
    }

    //Arrow functions maintain states but regular functions if the method is triggered through an event.
    //So we use arrow function
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () =>{
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () =>{
        //alert('Continue');
        this.setState({loading: true});
        const order={
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Simran',
                address: {
                    street: 'Test street',
                    zipCode: 'A1C L2A',
                    country: 'Canada'
                },
                email: 'test@gmail.com'
            },
            delivery: 'fastest'
        };
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false, purchasing: false});
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false});
            });
    }

    render(){

        const disabledInfo={
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key]=disabledInfo[key]<=0
        }
        //{ salad:true, meat:false, bacon:true.....}

        let orderSummary = null

        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />
        if(this.state.ingredients){
            burger = (
                <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    purchasable={this.state.purchasable} 
                    disabled={disabledInfo}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice} />
                </Aux>
            );

            orderSummary = <OrderSummary 
                            price={this.state.totalPrice}
                            ingredients={this.state.ingredients}
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

export default withErrorhandler(BurgerBuilder, axios); 