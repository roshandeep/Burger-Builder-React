import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) =>{

    //converts the object type props to array to be looped through
    //gets cheese, meat bacon as list converts to 2* cheese, 2*bacon 2* meat according to value
    let transformedIngredients=Object.keys(props.ingredients).map(
        igKey =>{
            return [...Array(props.ingredients[igKey])].map((_,i)=>{
                return <BurgerIngredient key={igKey + i} type={igKey} />
            });
        }).reduce((arr, el) => {
            return arr.concat(el)
        }, []);

    if(transformedIngredients.length === 0){
        transformedIngredients = <p>Please add some Ingredients !</p>
    }

    console.log(transformedIngredients)

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;