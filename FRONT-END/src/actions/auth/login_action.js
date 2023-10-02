import { SIGNIN_SET, SIGNOUT_SET, LANGUAGE_SET } from '../../constants/loginTypes';

export const loginAction = (payload) => {
    return {
      type: SIGNIN_SET,
      payload
    }
};

export const logoutAction = (payload) => {
  return {
    type: SIGNOUT_SET,
    payload
  }
};

export const languageAction = (payload) => {
  return {
    type: LANGUAGE_SET,
    payload
  }
};