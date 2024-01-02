import { combineReducers } from 'redux';

import loginReducer from './loginReducer';
import languageReducer from './languageReducer';

import { SIGNOUT_SET, SELECTED_LAND_SET, RESET_ALL } from '../constants/loginTypes';

const INITIAL_STATE = {
  signState: { signinDetails: false },
  langState: { languageDetails: { code: "en", text: "English (US)" } },
  selectedLandId: 1, // New state property
};

const selectedLandIdReducer = (state = INITIAL_STATE.selectedLandId, action) => {
  switch (action.type) {
    case SELECTED_LAND_SET:
      return action.payload;
    default:
      return state;
  }
};

const appReducer = combineReducers({
  signState: loginReducer,
  langState: languageReducer,
  selectedLandId: selectedLandIdReducer,

});

const rootReducer = (state, action) => {
  if (action.type === SIGNOUT_SET || action.type === RESET_ALL) {
    state = undefined;
  }
  return appReducer(state, action);
};


export default rootReducer;