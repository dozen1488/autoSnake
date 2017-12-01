import Dispatcher from '../dispatcher/dispatcher';
import ActionTypes from './actionTypes';

export function impulseBoard(){
    Dispatcher.dispatch({
        type: ActionTypes.impulseBoard
    });
}

export function onClick(x, y){
    Dispatcher.dispatch({
        x, y, type: ActionTypes.onClick
    });
}

export function onHover(x, y){
    Dispatcher.dispatch({
        x, y, type: ActionTypes.onHover
    });
}
    
export function onRelease(){
    Dispatcher.dispatch({
        type: ActionTypes.onRelease
    });
}

export function initStore(x, y) {
    Dispatcher.dispatch({
        x, y, type: ActionTypes.initStore,
    });
}

export function stopImpulse() {
    Dispatcher.dispatch({
        type: ActionTypes.stopImpulse,
    });
}