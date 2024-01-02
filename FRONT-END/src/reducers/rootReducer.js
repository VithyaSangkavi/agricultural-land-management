import { combineReducers } from 'redux';

import loginReducer from './loginReducer';
import languageReducer from './languageReducer';
import cropReducer from './cropReducer';

import { SIGNOUT_SET, SELECTED_LAND_SET, SELECTED_CROP_SET } from '../constants/loginTypes';

const INITIAL_STATE = {
  signState: { signinDetails: false },
  langState: { languageDetails: { code: "en", text: "English (US)" } },
  selectedLandId: null, // New state property
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
  cropName: cropReducer,
});

const rootReducer = (state, action) => {
  if(action.type === SIGNOUT_SET){
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer;