import React from "react";

import './Account.scss';
import FormUpdate from "@components/Account/FormUpdate/FormUpdate";

const Account = () => {
    return <div className='account'>
        <div className='account__form-wrapper'>
            <FormUpdate/>
        </div>
    </div>
}

export default Account;