import React from 'react';
import ReactDOM from 'react-dom';

import Container from './views/board';

window.ApplicationConfig = {
    x: 20,
    y: 20
};

document.addEventListener('contextmenu', event => { 
    event.preventDefault();
    return false;
});

ReactDOM.render(<Container 
    x={window.ApplicationConfig.x} 
    y={window.ApplicationConfig.y}
/>, document.getElementById("Application"));