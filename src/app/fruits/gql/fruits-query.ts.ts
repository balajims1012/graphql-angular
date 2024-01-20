import { gql } from "apollo-angular";

export const GET_Fruits = gql`query{
    allFruits{
        id
        name
        quantity
        price
    }
}`


export const Fruits_ById = gql`query($fruitFilter:FruitFilter){
    allFruits(filter:$fruitFilter){
        id
        name
        quantity
        price
    }
}`