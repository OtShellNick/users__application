import React from "react";

import './NotFound.scss';

const NotFound = () => {
    return <div className="empty-icon-container">
        <div className="animation-container">
            <div className="bounce"></div>
            <div className="pebble1"></div>
            <div className="pebble2"></div>
            <div className="pebble3"></div>
        </div>
        <div>
            <h2>Page not Found</h2>
            <p>Sorry! We couldn't find any results.</p>
        </div>

    </div>
}

export default NotFound;