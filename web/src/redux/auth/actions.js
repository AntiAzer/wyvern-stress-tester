/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import {
  AUTH_CHANGE_STATUS,
} from '../actions';

export const changeAuthed = (authed) => {
  return {
    type: AUTH_CHANGE_STATUS,
    payload: authed,
  };
};
