
 import { SIGNIN_SET } from '../constants/loginTypes';

const INITIAL_STATE = { signinDetails: false };

const loginReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case SIGNIN_SET:
        return {
          ...state,
          signinDetails: action.payload
        };
      default:
        return state;
    }
  };
 
export default loginReducer;