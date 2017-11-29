import Dispatcher from './dispatcher';
import ActionTypes from './actionTypes';

function addWall(x, y){
    Dispatcher.dispatch({
        x, y, type: ActionTypes.addWall
    });
    }

function onClick(x, y){
    Dispatcher.dispatch({
        x, y, type: ActionTypes.onClick
    });
}

function onHover(x, y){
    Dispatcher.dispatch({
        x, y, type: ActionTypes.onHover
    });
}
    
function onRelease(){
    Dispatcher.dispatch({
        type: ActionTypes.onRelease
    });
}
export {onRelease, onClick, onHover, addWall};