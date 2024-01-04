import { SELECTED_CROP_SET } from '../../constants/loginTypes';

export const setSelectedCropAction = (newSelectedCrop) => ({
  type: SELECTED_CROP_SET,
  payload: newSelectedCrop,
});
