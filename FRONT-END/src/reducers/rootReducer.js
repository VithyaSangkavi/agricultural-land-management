import { combineReducers } from 'redux';

import loginReducer from './loginReducer';
import languageReducer from './languageReducer';

import { SIGNOUT_SET } from '../constants/loginTypes';

const appReducer = combineReducers({
  signState: loginReducer,
  langState: languageReducer,
});

const rootReducer = (state, action) => {
  if(action.type === SIGNOUT_SET){
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer;