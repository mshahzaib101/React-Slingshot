import React from "react";
import { connect } from "react-redux";
import actionMain from '../../actions/commonActions';
import { ActionCreators } from "../../actions/";
import TestComponent from "./TestComponent";

class TestContainer extends React.Component {

  
  render() {
    console.log('Component runnind');
      return <TestComponent {...this.props}  />;
    
  }
}
function mapStateToProps(state) {
  return {
    PlayersData: state.Add_Players_Selected.Players,
    AllPlayersSelectedData: state.Players_Selected_Data
  };
}

function mapDispatchToProps(dispatch) {
  console.log('Dispatch to props runnind');
 
  return {
    actions : function (){
      dispatch(actionMain.PlayersData())
  }
  //   actions: ()=>{console.log(ActionCreators),console.log('running'),bindActionCreators(ActionCreators, dispatch)}
  // };
}}


export default connect(mapStateToProps, mapDispatchToProps)(TestContainer);