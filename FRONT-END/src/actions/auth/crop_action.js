import { SELECTED_CROP_SET } from '../../constants/loginTypes';

export const setSelectedCropAction = (selectedCropName) => ({
  type: SELECTED_CROP_SET,
  payload: selectedCropName,
});
