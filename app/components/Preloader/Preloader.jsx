import React from "react";
import {CircularProgress} from '@mui/material';

import './Preloader.scss';

const Preloader = () => {
    return <div className='preloader'>
        <CircularProgress/>
    </div>
}

export default Preloader;