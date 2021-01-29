import React from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import ServerResourceStatus from '../../../containers/dashboards/ServerResourceStatus';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import ServerStatusSummary from '../../../containers/dashboards/ServerStatusSummary';
import ServerAvailableProtection from '../../../containers/dashboards/ServerAvailableProtection';

const ServerDefault = ({ match }) => {
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.dashboards.server" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <ServerResourceStatus />
      <Row className="mb-4">
        <Colxx sm="12" lg="6" className="mb-4">
          <ServerStatusSummary />
        </Colxx>
        <Colxx sm="12" lg="6" className="mb-4">
          <ServerAvailableProtection />
        </Colxx>
      </Row>
    </>
  );
};

export default ServerDefault;
