
import * as types from "../constants/actionTypes";

const INITIAL_STATE = {
    Players : [],  //players selected will go here
}

export default function Add_Players_Selected(state = INITIAL_STATE, action){
  switch(action.type){
    case types.ListOfAllPlayers:
    return{
        ...state,
        Players :action.payload
    };
 default:
 return state;
}
}