import { SELECTED_LAND_SET } from '../../constants/loginTypes';

export const setSelectedLandIdAction = (newSelectedLandId) => ({
  type: SELECTED_LAND_SET,
  payload: newSelectedLandId,
});
