import * as types from "../constants/actionTypes";

const INITIAL_STATE = {
    Players_Selected : [],  //players selected will go here
}

export default function Players_Selected_Data(state = INITIAL_STATE, action){
  switch(action.type){
    case types.SelectedPlayers:
    return{
        ...state,
        Players_Selected :action.payload
    };
 default:
 return state;
}
}
