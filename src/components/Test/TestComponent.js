import React, { Component } from "react";
import Header from "./Header";
import '../../css/style.css'
import '../../App.css';

import {Button,Icon, notification} from 'antd';
import { Tabs } from 'antd';
import { Modal} from 'antd';
import { Badge } from 'antd';
import TableHeading from './tableHeading';
import Snackbar from '@material-ui/core/Snackbar';
import plFlag from '../../images/plFlag.png';
import maFlag from '../../images/maFlag.png';
import noteams from '../../images/noteams.jpg';

class TestComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team1: 'PL',
      team2:'MA',
      changeVisibility : false, //initial screen and match screen toggle
      value: 0, // tab value,
      AllPlayersSelectedData: [], // List of selected players
      arrayOfAllPlayers: [], //for switching btns Array[30]
      playersSelected: 0,  //Count
      team1PlayersSelected: 0,
      team2PlayersSelected: 0,
      totalCreditLeft: 100,

      open: false,      //for error msg
      errorMsg: '',
      dialogopen: false,

      //for badges on tab
      wicket_keeper_selected: 0,
      batsman_selected: 0,
      bowlers_selected: 0,
      all_rounders_selected: 0,
      invisiblewicket_keeper: 'true',
      invisiblebatsman: 'true',
      invisibleall_rounders: 'true',
      invisiblebowlers: 'true',
      visible:false, // Modal /
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }


  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }


  changeVisibility = () => {
    this.setState({changeVisibility: true});
  }


  //for flag picture
  flagPic = (team_name) => {
    if(team_name === 'PL') {
      return plFlag
    }
    else{
      return maFlag
    }
  }

  //adding player
  changeBtn = (id) => {
   if(this.state.arrayOfAllPlayers[id] === true){
     let playersArray = this.state.arrayOfAllPlayers;
     playersArray[id] = false;
     this.setState({arrayOfAllPlayers: playersArray})
   }
   else{
    let playersArray = this.state.arrayOfAllPlayers;
    playersArray[id] = true;
    this.setState({arrayOfAllPlayers: playersArray})
   }
   //changing footer disolay
   this.updatingDifferentValuesInFooter();
    
  }

  componentWillMount() {
   
      this.props.actions();
     

   
  
   
  }
  componentWillReceiveProps(nextprops){
    console.log('prop', nextprops.PlayersData)
    console.log(nextprops.PlayersData)
    let playersDataLength = nextprops.PlayersData;
    playersDataLength = playersDataLength.length; 
    let arrayOfPlayersNum = [];
    //creating array
    let i;
    for(i = 0; i < playersDataLength; i++){
      arrayOfPlayersNum.push(true)
    }
  // console.log(arrayOfPlayersNum) Returns true for all 30 players
    this.setState({arrayOfAllPlayers : arrayOfPlayersNum}) 
  
  }


  addWicketKeeper = (data, id) => {
  // console.log(this.state.AllPlayersSelectedData);
    let playersArray = this.state.AllPlayersSelectedData;
    let wicketKeeperExist = false;
  
    //max 6 players from 1 team
    let passout = false;
    if(data.team_name === this.state.team1){
      if(this.state.team1PlayersSelected === 6) {
        this.setState({errorMsg:'You can only select max 6 players from each team'})
         this.handleClick();
      }else{passout = true;}
    }
    else if(data.team_name === this.state.team2){
      if(this.state.team2PlayersSelected === 6 ) {
        this.setState({errorMsg:'You can only select max 6 players from each team'})
        this.handleClick();
      }else{passout = true;}
    }
    if(passout === true){
    //checking if data is of role wicket keeper
    if(this.state.playersSelected >= 11) {
      // displaying error
      this.setState({errorMsg:'You have selected 11 players'})
      this.handleClick();
    }else{
            if(data.role === 'wicket_keeper') {
              
              // console.log('yes')
              if(playersArray.length > 0){
                // console.log('ha')
                playersArray.map((d,i)=>{
                  if(d.role === 'wicket_keeper'){
                    wicketKeeperExist = true;
                  }
                })
              
              }
              
            }
            if(wicketKeeperExist === false){
              if(this.managingCreditPoints(data.series_player_credit)){
              // console.log('false')
              playersArray.push(data);
              //changing display btn
              this.changeBtn(id)
              }else{
                this.setState({errorMsg:'Not Enough Credit Points'})
                this.handleClick();
              }
            }else{
              // displaying error
              this.setState({errorMsg:'Max 1 Wicket keeper only you have to choose'})
              this.handleClick();
              
            }
            this.setState({AllPlayersSelectedData: playersArray})
            // console.log(this.state.AllPlayersSelectedData);
          }

  }}

  removeWicketKeeper = (data,id) => {
    console.log(this.state.AllPlayersSelectedData);
    //demo array
    let playersArray = this.state.AllPlayersSelectedData;
    let wicketKeeperExist = false;
    //checking if data is of role wicket keeper
    if(data.role === 'wicket_keeper') {
      playersArray.map((d,i)=>{
        if(d.player_id === data.player_id){
          wicketKeeperExist = true;
        
          playersArray.splice(i, 1);
          //removing credit points
          this.decreasingCreditPoints(data.series_player_credit);
          //changing btn
          this.changeBtn(id)
        }
      })
    }
   this.setState({AllPlayersSelectedData: playersArray})
    // console.log(this.state.AllPlayersSelectedData);

  }

  updatingDifferentValuesInFooter= () => {
    let totalplayers = 0;
    let team1players = 0;
    let team2players = 0;
    let wicket_keeper = 0;
    let batsman = 0;
    let bowlers = 0;
    let all_rounders = 0;
    
    
    this.state.AllPlayersSelectedData.map((d,i)=>{

      //for footer
      totalplayers = totalplayers+1;
      // team1
      if(d.team_name === this.state.team1) {
        team1players = team1players+1;
      }
      else if(d.team_name === this.state.team2) {
        team2players = team2players+1;
      }
      //for footer
      //for badges on tabs
      if(d.role === 'wicket_keeper'){
        wicket_keeper = wicket_keeper+1;
      }
      else if(d.role === 'batsman'){
        batsman = batsman+1;
      }
      else if(d.role === 'bowler'){
        bowlers = bowlers+1;
      }
      else {
        all_rounders = all_rounders+1;
      }
    })
    this.setState({
      playersSelected:totalplayers,
      team1PlayersSelected:team1players,
      team2PlayersSelected:team2players,
      wicket_keeper_selected:wicket_keeper,
      batsman_selected:batsman,
      bowlers_selected:bowlers,
      all_rounders_selected:all_rounders,

    })

    if(wicket_keeper === 0){
      this.setState({invisiblewicket_keeper: 'true'})
    }else{
      this.setState({invisiblewicket_keeper: 'false'})
    }

    if(batsman === 0){
      this.setState({invisiblebatsman: 'true'})
    }else{
      this.setState({invisiblebatsman: 'false'})
    }

    if(bowlers === 0){
      this.setState({invisiblebowlers: 'true'})
    }else{
      this.setState({invisiblebowlers: 'false'})
    }

    if(all_rounders === 0){
      this.setState({invisibleall_rounders: 'true'})
    }else{
      this.setState({invisibleall_rounders: 'false'})
    }
    // console.log(wicket_keeper,bowlers,all_rounders,batsman)
  }

  managingCreditPoints = (points) => {
  
    let totalpoints = 100 - this.state.totalCreditLeft;
    
    if(points+totalpoints <101) {
      this.setState({totalCreditLeft: 100-(totalpoints+points)})
      return true;
    }
    else{
      return false;
    }
  }

  decreasingCreditPoints = (points) =>{
    let totalpoints = 100 - this.state.totalCreditLeft;
    this.setState({totalCreditLeft: 100-(totalpoints-points)})
  }

  //for batsman tab
  addBatsMan = (data, id) => {
    //demo array
    let playersArray = this.state.AllPlayersSelectedData;
    let BatsManExist = 0;
//issue
if((this.state.playersSelected === 11 || this.state.playersSelected === 10 || this.state.playersSelected === 9) && (this.state.wicket_keeper_selected === 0 || this.state.all_rounders_selected === 0)){
  if(this.state.wicket_keeper_selected === 0){
    this.setState({errorMsg:'Please select 1 wicket keeper of your team'})
      this.handleClick();
  }
  else if(this.state.all_rounders_selected === 0){
      this.setState({errorMsg:'Please select atleast 1 all rounder'})
      this.handleClick();
  }
}

else if((this.state.playersSelected === 11 || this.state.playersSelected === 10 || this.state.playersSelected === 9 || this.state.playersSelected === 8) && (this.state.bowlers_selected < 3)) {
  this.setState({errorMsg:'Please select atleast 3 bowlers'})
  this.handleClick();
}
else{

     //max 6 players from 1 team
     let passout = false;
     if(data.team_name === this.state.team1){
       if(this.state.team1PlayersSelected === 6) {
         this.setState({errorMsg:'You can only select max 6 players from each team'})
          this.handleClick();
       }else{passout = true;}
     }
     else if(data.team_name === this.state.team2){
       if(this.state.team2PlayersSelected === 6 ) {
         this.setState({errorMsg:'You can only select max 6 players from each team'})
         this.handleClick();
       }else{passout = true;}
     }
     if(passout === true){
    //checking if data is of role wicket keeper
    if(this.state.playersSelected >= 11) {
    // displaying error
    this.setState({errorMsg:'You have selected 11 players'})
    this.handleClick();
    }else{
              if(data.role === 'batsman') {
                
                console.log('yes')
                if(playersArray.length > 0){
                  // console.log('ha')
                  playersArray.map((d,i)=>{
                    if(d.role === 'batsman'){
                      BatsManExist = BatsManExist+1;
                    }
                  })

                  if(BatsManExist === 0){
                    if(this.managingCreditPoints(data.series_player_credit)){
                      playersArray.push(data);
                      //changing display btn
                      this.changeBtn(id)
                      }else{
                        this.setState({errorMsg:'Not Enough Credit Points'})
                        this.handleClick();
                      }
                  }
                
                }else{
                  if(this.managingCreditPoints(data.series_player_credit)){
                  playersArray.push(data);
                  //changing display btn
                  this.changeBtn(id)
                  }else{
                    this.setState({errorMsg:'Not Enough Credit Points'})
                    this.handleClick();
                  }
                }
                
              }
              if(BatsManExist < 5 && BatsManExist > 0){
                if(this.managingCreditPoints(data.series_player_credit)){
                // console.log('false')
                playersArray.push(data);
                //changing display btn
                this.changeBtn(id)
                }else{
                  this.setState({errorMsg:'Not Enough Credit Points'})
                  this.handleClick();
                }
              }
              else if(BatsManExist === 0) {console.log('0')}
              else{
                // displaying error
                this.setState({errorMsg:'Max 5 Batsman you have to choose'})
                this.handleClick();
                
              }
              this.setState({AllPlayersSelectedData: playersArray})
              // console.log(this.state.AllPlayersSelectedData);
            }
          }
  }}

  // for batsman tab
  removeBatsMan = (data,id) => {
    // console.log(this.state.AllPlayersSelectedData);
    //demo array
    let playersArray = this.state.AllPlayersSelectedData;
    let BatsManExist = false;
    //checking if data is of role batsman
    if(data.role === 'batsman') {
      // console.log('playersArray', playersArray)
       playersArray.map((d,i)=>{
         if(d.player_id === data.player_id){
           BatsManExist = true;
           console.log('matched')
          playersArray.splice(i, 1);
          //removing credit points
          this.decreasingCreditPoints(data.series_player_credit);
          //changing btn
          this.changeBtn(id)
         }
       })
    }
   this.setState({AllPlayersSelectedData: playersArray})
    // console.log(this.state.AllPlayersSelectedData);

  }

  //for bowler tab
  addBowlers = (data, id) => {
    //demo array
    let playersArray = this.state.AllPlayersSelectedData;
    let BowlersExist = 0;

    //issue
if((this.state.playersSelected === 11 || this.state.playersSelected === 9 || this.state.playersSelected === 10) && (this.state.wicket_keeper_selected === 0 || this.state.all_rounders_selected === 0)){
  if(this.state.wicket_keeper_selected === 0){
    this.setState({errorMsg:'Please select 1 wicket keeper of your team'})
      this.handleClick();
  }
  else if(this.state.all_rounders_selected === 0){
      this.setState({errorMsg:'Please select atleast 1 all rounder'})
      this.handleClick();
  }
 
  
}
else if((this.state.playersSelected === 11 || this.state.playersSelected === 10 || this.state.playersSelected === 9 || this.state.playersSelected === 8) && (this.state.batsman_selected < 3)) {
  this.setState({errorMsg:'Please select atleast 3 batsman'})
  this.handleClick();
}
else{

     //max 6 players from 1 team
     let passout = false;
     if(data.team_name === this.state.team1){
       if(this.state.team1PlayersSelected === 6) {
         this.setState({errorMsg:'You can only select max 6 players from each team'})
          this.handleClick();
       }else{passout = true;}
     }
     else if(data.team_name === this.state.team2){
       if(this.state.team2PlayersSelected === 6 ) {
         this.setState({errorMsg:'You can only select max 6 players from each team'})
         this.handleClick();
       }else{passout = true;}
     }
     if(passout === true){
    //checking if data is of bowler
    if(this.state.playersSelected >= 11) {
      // displaying error
      this.setState({errorMsg:'You have selected 11 players'})
      this.handleClick();
    }else{
            if(data.role === 'bowler') {
              
              
              if(playersArray.length > 0){
              
                playersArray.map((d,i)=>{
                  if(d.role === 'bowler'){
                    BowlersExist = BowlersExist+1;
                  }
                })

                if(BowlersExist === 0){
                  if(this.managingCreditPoints(data.series_player_credit)){
                    playersArray.push(data);
                    //changing display btn
                    this.changeBtn(id)
                    }else{
                      this.setState({errorMsg:'Not Enough Credit Points'})
                      this.handleClick();
                    }
                }
              
              }else{
                if(this.managingCreditPoints(data.series_player_credit)){
                playersArray.push(data);
                //changing display btn
                this.changeBtn(id)
                }else{
                  this.setState({errorMsg:'Not Enough Credit Points'})
                  this.handleClick();
                }
              }
              
            }
            if(BowlersExist < 5 && BowlersExist > 0){
              if(this.managingCreditPoints(data.series_player_credit)){
              // console.log('false')
              playersArray.push(data);
              //changing display btn
              this.changeBtn(id)
              }else{
                this.setState({errorMsg:'Not Enough Credit Points'})
                this.handleClick();
              }
            }
            else if(BowlersExist === 0) {console.log('0')}
            else{
              // displaying error
              this.setState({errorMsg:'Max 5 Batsman you have to choose'})
              this.handleClick();
              
            }
            this.setState({AllPlayersSelectedData: playersArray})
            // console.log(this.state.AllPlayersSelectedData);
          }
  }
}
  }
  //for bowler tab
  removeBowlers  = (data,id) => {
    //demo array
    let playersArray = this.state.AllPlayersSelectedData;
    let BowlersExist = false;
    //checking if data is of role bowler
    if(data.role === 'bowler') {
      // console.log('playersArray', playersArray)
       playersArray.map((d,i)=>{
         if(d.player_id === data.player_id){
          BowlersExist = true;
           console.log('matched')
          playersArray.splice(i, 1);
          //removing credit points
          this.decreasingCreditPoints(data.series_player_credit);
          //changing btn
          this.changeBtn(id)
         }
       })
    }
   this.setState({AllPlayersSelectedData: playersArray})
    // console.log(this.state.AllPlayersSelectedData);

  }

  //for all rounder tab
  addAllRounders = (data, id) => {
    //demo array

    if((this.state.playersSelected === 11 || this.state.playersSelected === 10) && (this.state.wicket_keeper_selected === 0 )){
      
        this.setState({errorMsg:'Please select 1 wicket keeper of your team'})
          this.handleClick();
    }
    else if((this.state.playersSelected === 11 || this.state.playersSelected === 10 || this.state.playersSelected === 9 || this.state.playersSelected === 8) && (this.state.bowlers_selected < 3 || this.state.batsman_selected < 3)) {
      if(this.state.bowlers_selected < 3){
        this.setState({errorMsg:'Please select atleast 3 bowlers'})
          this.handleClick();
      }
      else if(this.state.batsman_selected < 3){
        this.setState({errorMsg:'Please select atleast 3 batsman'})
          this.handleClick();
      }
    }
    else{

    //max 6 players from 1 team
     //max 6 players from 1 team
     let passout = false;
     if(data.team_name === this.state.team1){
       if(this.state.team1PlayersSelected === 6) {
         this.setState({errorMsg:'You can only select max 6 players from each team'})
          this.handleClick();
       }else{passout = true;}
     }
     else if(data.team_name === this.state.team2){
       if(this.state.team2PlayersSelected === 6 ) {
         this.setState({errorMsg:'You can only select max 6 players from each team'})
         this.handleClick();
       }else{passout = true;}
     }
     if(passout === true){
    let playersArray = this.state.AllPlayersSelectedData;
    let AllRoundersExist = 0;
    //checking if data is of all_rounder
    if(this.state.playersSelected >= 11) {
       // displaying error
       this.setState({errorMsg:'You have selected 11 players'})
       this.handleClick();
            }else{
            if(data.role === 'all_rounder') {
              
              
              if(playersArray.length > 0){
              
                playersArray.map((d,i)=>{
                  if(d.role === 'all_rounder'){
                    AllRoundersExist = AllRoundersExist+1;
                  }
                })

                if(AllRoundersExist === 0){
                  if(this.managingCreditPoints(data.series_player_credit)){
                    playersArray.push(data);
                    //changing display btn
                    this.changeBtn(id)
                    }else{
                      this.setState({errorMsg:'Not Enough Credit Points'})
                      this.handleClick();
                    }
                }
              
              }else{
                if(this.managingCreditPoints(data.series_player_credit)){
                playersArray.push(data);
                //changing display btn
                this.changeBtn(id)
                }else{
                  this.setState({errorMsg:'Not Enough Credit Points'})
                  this.handleClick();
                }
              }
              
            }
            if(AllRoundersExist < 3 && AllRoundersExist > 0){
              if(this.managingCreditPoints(data.series_player_credit)){
              // console.log('false')
              playersArray.push(data);
              //changing display btn
              this.changeBtn(id)
              }else{
                this.setState({errorMsg:'Not Enough Credit Points'})
                this.handleClick();
              }
            }
            else if(AllRoundersExist === 0) {console.log('0')}
            else{
              // displaying error
              this.setState({errorMsg:'Max 3 all_rounder you can choose'})
              this.handleClick();
              
            }
            this.setState({AllPlayersSelectedData: playersArray})
            // console.log(this.state.AllPlayersSelectedData);
          }
          
        }
  }}

  //for all rounder tab
  removeAllRounders  = (data,id) => {
    //demo array
    let playersArray = this.state.AllPlayersSelectedData;
    let all_rounderExist = false;
    //checking if data is of role all_rounder
    if(data.role === 'all_rounder') {
      // console.log('playersArray', playersArray)
       playersArray.map((d,i)=>{
         if(d.player_id === data.player_id){
          all_rounderExist = true;
           console.log('matched')
          playersArray.splice(i, 1);
          //removing credit points
          this.decreasingCreditPoints(data.series_player_credit);
          //changing btn
          this.changeBtn(id)
         }
       })
    }
   this.setState({AllPlayersSelectedData: playersArray})
    // console.log(this.state.AllPlayersSelectedData);

  }

  //for error msg
  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  }
 


  //RENDER METHOD
 
  render() {
    console.log(this.props);

    const TabPane = Tabs.TabPane;
    function callback(key) {
      console.log(key);
    }
    
      if(this.state.changeVisibility === false) {
        return(
      <div>
     <Header />
      <img className='noteams-img' src={noteams} />
      {/* <Tooltip title="Create a Team" placement="left"> */}
      <Button type="primary" icon="plus" style={{float:'right', marginBottom:'20px', marginRight:'20px'}} onClick={this.changeVisibility}>Create a Team </Button>
        {/* </Tooltip> */}
       
      </div>
      )
    }
      else{
        return(
          <div>
          <Header />
          {/* // 4 tabs code */}
         
        <Tabs
          tabBarStyle={{textAlign: 'center'}}
          value={this.state.value}
          onChange={this.handleChange}
        >
          <TabPane tab={
            <Badge  count={this.state.wicket_keeper_selected} style={{ backgroundColor: '#0093e9' }} invisible={this.state.invisiblewicket_keeper}>
           WK  
          </Badge>
          } key="1"
          >
          <h3 className='guide-text'>Select Min 1 Wicket-Keeper</h3>
        <TableHeading />
        <div className='tableData'>
{
  //looping through players data
  this.props.PlayersData.map((data, id)=>{
    // console.log('id', id)
    // console.log('data', data.role)
    
      if(data.role === "wicket_keeper") {
                return(
                  <div className='table-content' key={data.player_id} >
                  <div className='table-head1 playerdiv'>
                  <div>
                    <img src={this.flagPic(data.team_name)} className='small-flag' />
                  </div>
                  <div className='playerNameDiv'>
                    <h3 className='playername'>{data.player_short_name}</h3>
                    <p className='player-type'>{data.team_name}|{data.role}</p>
                  </div>
                  </div>
                  <div className='table-head2 points'>{data.series_total_points}</div>
                  <div className='table-head3 points' >{data.series_player_credit}</div>
                  <div className='table-head4'>
                  {
                  (this.state.arrayOfAllPlayers[id])?
                   
                      <div>
                      <Button onClick={()=>{this.addWicketKeeper(data, id)}} type="primary" shape="circle" icon="plus" />
                 
                      </div>
                    
                    :
                    <div>
                      <Button onClick={()=>{this.removeWicketKeeper(data, id)}}  type="primary" shape="circle" icon="close-circle" style={{backgroundColor:'red'}} />
                    </div>

}
                  </div>
                </div>
            )
      }})

  }
  </div>
          </TabPane>
          
          <TabPane tab={
            <Badge  count={this.state.batsman_selected} style={{ backgroundColor: '#0093e9' }} invisible={this.state.invisiblebatsman}>
           Bat
          </Badge>
          } key="2"
          >
          <h3 className='guide-text'>Select 3 to 5 Batsman</h3>
        <TableHeading />
        

        <div className='tableData'>
{
  //looping through players data
  this.props.PlayersData.map((data, id)=>{
    // console.log('id', id)
    // console.log('data', data.role)
    
      if(data.role === "batsman") {
                return(
                  <div className='table-content' key={data.player_id} >
                  <div className='table-head1 playerdiv'>
                  <div>
                    <img src={this.flagPic(data.team_name)} className='small-flag' />
                  </div>
                  <div className='playerNameDiv'>
                    <h3 className='playername'>{data.player_short_name}</h3>
                    <p className='player-type'>{data.team_name}|{data.role}</p>
                  </div>
                  </div>
                  <div className='table-head2 points'>{data.series_total_points}</div>
                  <div className='table-head3 points' >{data.series_player_credit}</div>
                  <div className='table-head4'>
                  {
                  (this.state.arrayOfAllPlayers[id])?
                   
                      <div>
                      <Button onClick={()=>{this.addBatsMan(data, id)}} type="primary" shape="circle" icon="plus"  />
                 
                     
                      </div>
                    
                    :
                    <div>
                      <Button onClick={()=>{this.removeBatsMan(data, id)}} type="primary" shape="circle" icon="close-circle" style={{backgroundColor:'red'}}
                       />
                    </div>

}
                  </div>
                </div>
            )
      }})

  }
  </div>
          </TabPane>
          
          
          <TabPane tab={
            <Badge  count={this.state.bowlers_selected} style={{ backgroundColor: '#0093e9' }} invisible={this.state.invisiblebowlers}>
            Bowl
          </Badge>
          } key="3"
          >
          <h3 className='guide-text'>Select 3 to 5 Bowler</h3>
        <TableHeading />
        <div className='tableData'>
{
  //looping through players data
  this.props.PlayersData.map((data, id)=>{
    // console.log('id', id)
    // console.log('data', data.role)
    
      if(data.role === "bowler") {
                return(
                  <div className='table-content' key={data.player_id} >
                  <div className='table-head1 playerdiv'>
                  <div>
                    <img src={this.flagPic(data.team_name)} className='small-flag' />
                  </div>
                  <div className='playerNameDiv'>
                    <h3 className='playername'>{data.player_short_name}</h3>
                    <p className='player-type'>{data.team_name}|{data.role}</p>
                  </div>
                  </div>
                  <div className='table-head2 points'>{data.series_total_points}</div>
                  <div className='table-head3 points' >{data.series_player_credit}</div>
                  <div className='table-head4'>
                  {
                  (this.state.arrayOfAllPlayers[id])?
                   
                      <div>
                      <Button onClick={()=>{this.addBowlers(data, id)}} type="primary" shape="circle" icon="plus" 
                       />
                 
   
                      </div>
                    
                    :
                    <div>
                      <Button onClick={()=>{this.removeBowlers(data, id)}} type="primary" shape="circle" icon="close-circle" style={{backgroundColor:'red'}}
                      />
                     
                    </div>

}
                  </div>
                </div>
            )
      }})

  }
  </div>
          </TabPane>
           
          <TabPane tab={
             <Badge  count={this.state.all_rounders_selected} style={{ backgroundColor: '#0093e9' }} invisible={this.state.invisibleall_rounders}>
            Ar
              </Badge>
              } key="4"
              >
              <h3 className='guide-text'>Select Min 1 All Rounder</h3>
        <TableHeading />

  <div className='tableData'>
{
  //looping through players data
  this.props.PlayersData.map((data, id)=>{
    // console.log('id', id)
    // console.log('data', data.role)
    
      if(data.role === "all_rounder") {
                return(
                  <div className='table-content' key={data.player_id} >
                  <div className='table-head1 playerdiv'>
                  <div>
                    <img src={this.flagPic(data.team_name)} className='small-flag' />
                  </div>
                  <div className='playerNameDiv'>
                    <h3 className='playername'>{data.player_short_name}</h3>
                    <p className='player-type'>{data.team_name}|{data.role}</p>
                  </div>
                  </div>
                  <div className='table-head2 points'>{data.series_total_points}</div>
                  <div className='table-head3 points' >{data.series_player_credit}</div>
                  <div className='table-head4'>
                  {
                  (this.state.arrayOfAllPlayers[id])?
                   
                      <div>
                      <Button onClick={()=>{this.addAllRounders(data, id)}} type="primary" shape="circle" icon="plus" 
                        />
                 
                     
                      </div>
                    
                    :
                    <div>
                      <Button onClick={()=>{this.removeAllRounders(data, id)}}  type="primary" shape="circle" icon="close-circle" style={{backgroundColor:'red'}}
                       />
                      
                    </div>

}
                  </div>
                </div>
            )
      }})

  }
  </div>
              </TabPane>
      
           
        </Tabs>
      

         
          <div className='Footer'>
        <div className='Main-footer'>
          <div className='footer1'>
          <h4 className='score'>{this.state.playersSelected}/11</h4>
          <p className='score-text'>Players</p>
          </div>
          <div className='footer2'>
          <h4 className='score'>{this.state.team1PlayersSelected}</h4>
          <p className='score-text'>PL</p>
          </div>
          <div className='footer3'>
          <h4 className='score'>{this.state.team2PlayersSelected}</h4>
          <p className='score-text'>MA</p>
          </div>
          <div className='footer4'>
          <h4 className='score'>{this.state.totalCreditLeft}/100</h4>
          <p className='score-text'>Credit Left</p>
          </div>
          <div className='footer5'>
          <Button onClick={()=>{this.showModal()}} type="primary" > PREVIEW </Button> {/* //Multiple onClick events in single arrow function */}


        {
          <div>
          {/* <Button type="primary" onClick={this.showModal} >
          PREVIEW
        </Button> */}
        <Modal
        fullScreen
          title="Dotball"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="1000"
          // style={{ top: 20 }}
          
        >
          <div className='dialogDiv'>
          <div className='dialogDiv1'>

          <div className='playersviewDiv'>
          {
            this.state.AllPlayersSelectedData.map((d,i)=>{
              return(
                <div className='playersviewchild' key={i}>
                <h2 className='picdisplayName'>{d.player_short_name}</h2>
                <p className='picdisplayRole'>{d.role}</p>
                </div>
              )
            })
         
        }
          </div>
          </div>
          </div>
        </Modal>
        </div>
          
        }

          </div>
        </div>
        </div>


      {/* //snack bar code */}

        <Snackbar
         
         anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.state.open}
        autoHideDuration={5000}
        onClose={this.handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{this.state.errorMsg}</span>}
       
        action={[
          <Button
            type="primary"
            shape="circle"
            icon="close"
           
            onClick={this.handleClose}
          />
           
        ]}
      />


          </div>
        )
      }
    
  }
}


export default TestComponent;


// import React, { Component } from "react";
// import Header from "./Header";

// class TestComponent extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   render() {
//     return (
//       <div>
//         <Header title="React Scaffolding" />
//       </div>
//     );
//   }
// }

// export default TestComponent;
