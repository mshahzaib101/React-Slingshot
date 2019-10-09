import React, { Component } from 'react';
import '../../Styles/style1.css';
import {Button, Icon } from 'antd';
import plFlag from '../../images/plFlag.png';
import maFlag from '../../images/maFlag.png';




class Header extends Component {
    render() {
      return (
<div>
<div className="top-header">
  <div>
    {/* <Button>  */}
  <Icon type="arrow-left" theme="outlined" aria-label="ArrowBack" style={{ fontSize: '20px', marginLeft:'15px', marginTop:'10px' }}/>
  {/* </Button> */}
  </div>
  <div className='top-header-midContainer'>
  <div className='img-div'>
    <img className='flag' src={plFlag} alt="flag"/>
  </div>
  <div className='text-div'>
    <h2 className='match-head'>PL vs MA</h2>
  </div>
  <div className='img-div'>
  <img className='flag' src={maFlag} alt="flag" />
  </div>
  
  </div>
  <div>
  {/* <Button> */}
  <Icon type="wallet" aria-label="AccountBalanceWallet" style={{ fontSize: '24px', marginRight:'15px', marginTop:'10px'  }}/>
  {/* </Button> */}
  </div>
</div>
 
</div>
      );
    }
  }

  export default Header;
  

// import React from "react";
// import PropTypes from "prop-types";

// const Header = ({ title }) => {
//   return <h1>{title}</h1>;
// };
// Header.propTypes = {
//   title: PropTypes.string
// };
// export default Header;

