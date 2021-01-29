import {
  AUTH_CHANGE_STATUS,
} from '../actions';

const INIT_STATE = {
  authed: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case AUTH_CHANGE_STATUS:
      return { ...state, authed: action.payload };

    default:
      return { ...state };
  }
};
