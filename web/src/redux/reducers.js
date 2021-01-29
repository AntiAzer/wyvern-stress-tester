import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import auth from './auth/reducer';

const reducers = combineReducers({
  menu,
  settings,
  auth,
});

export default reducers;
