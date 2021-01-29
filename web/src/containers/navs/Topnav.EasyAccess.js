import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import IntlMessages from '../../helpers/IntlMessages';
import { adminRoot } from '../../constants/defaultValues';

const TopnavEasyAccess = () => {
  return (
    <div className="position-relative d-none d-sm-inline-block">
      <UncontrolledDropdown className="dropdown-menu-right">
        <DropdownToggle className="header-icon" color="empty">
          <i className="simple-icon-grid" />
        </DropdownToggle>
        <DropdownMenu
          className="position-absolute mt-3"
          right
          id="iconMenuDropdown"
        >
          <NavLink to={`${adminRoot}/dashboards`} className="icon-menu-item">
            <i className="iconsminds-dashboard d-block" />{' '}
            <IntlMessages id="menu.dashboards" />
          </NavLink>
          <NavLink to={`${adminRoot}/attack`} className="icon-menu-item">
            <i className="simple-icon-ghost d-block" />{' '}
            <IntlMessages id="menu.attack" />
          </NavLink>
          <NavLink to={`${adminRoot}/bot`} className="icon-menu-item">
            <i className="iconsminds-computer d-block" />{' '}
            <IntlMessages id="menu.bot" />
          </NavLink>
          <NavLink to={`${adminRoot}/setting`} className="icon-menu-item">
            <i className="simple-icon-settings d-block" />{' '}
            <IntlMessages id="menu.setting" />
          </NavLink>
          <NavLink to={`${adminRoot}/docs`} className="icon-menu-item">
            <i className="iconsminds-books d-block" />{' '}
            <IntlMessages id="menu.docs" />
          </NavLink>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default TopnavEasyAccess;
