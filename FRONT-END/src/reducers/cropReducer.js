import { SELECTED_CROP_SET } from '../constants/loginTypes';

const initialState = {
  selectedCrop: '', 
};

const cropReducer = (state = initialState.selectedCrop, action) => {
  switch (action.type) {
    case SELECTED_CROP_SET:
      return action.payload;
    default:
      return state;
  }
};

export default cropReducer;