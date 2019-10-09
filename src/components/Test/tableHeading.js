import React, { Component } from 'react';
import '../../css/style.css'

 const TableHeading = (props) => {
    return(
        <div className='table-heading'>
        <div className='table-head1'>Player Name
        </div>
        <div className='table-head2'>Points
        </div>
        <div className='table-head3'>Credit
        </div>
        <div className='table-head4'>Add
        </div>
    </div>
    )
}

export default TableHeading;