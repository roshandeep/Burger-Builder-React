import React, {Component} from 'react';
import axios from '../../../axios-orders';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component{
    state={
        name: '',
        email: '',
        address:{
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) =>{
        event.preventDefault();
        //console.log(this.props.ingredients);

        this.setState({loading: true});
        const order={
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
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
                this.setState({loading: false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading: false});
            });
    }

    render(){
        let form=( 
            <form>
                <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
                <input className={classes.Input} type="email" name="email" placeholder="Your Mail" />
                <input className={classes.Input} type="street" name="street" placeholder="Street" />
                <input className={classes.Input} type="postal" name="postal" placeholder="Postal Code" />
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>
        );
        if(this.state.loading){
            form=<Spinner />
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
} 

export default ContactData;