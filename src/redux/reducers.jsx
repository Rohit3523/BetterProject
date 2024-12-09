import * as actions from './actions';

const initialState = {
    user: {}
}

const reducer = (state = initialState, action) => {
    if(action.type === actions.SET_USER){
        return {
            ...state,
            user: action.payload.user
        }
    }

    return state;
}

export default reducer;