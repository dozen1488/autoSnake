import React from 'react';
import ReactDOM from 'react-dom';

import BoardComponent from './components/board';

ReactDOM.render(<BoardComponent 
    x={20}
    y={20}
    radiusOfVisionForNetwork={3}
/>, document.getElementById("Application"));