import React from 'react';
import { 
  Row, 
} from 'reactstrap';
import BotStatusCount from '../../../containers/dashboards/BotStatusCount';
import BotStatusWindows from '../../../containers/dashboards/BotStatusWindows';
import BotStatusPrivilege from '../../../containers/dashboards/BotStatusPrivilege';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';

const BotDefault = ({ match }) => {
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.dashboards.bot" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row className="mb-4">
        <Colxx lg="4" md="12" className="mb-4">
          <BotStatusWindows chartClass="dashboard-donut-chart" />
        </Colxx>
        <Colxx lg="4" md="12" className="mb-4">
          <BotStatusCount />
        </Colxx>
        <Colxx lg="4" md="12" className="mb-4">
          <BotStatusPrivilege chartClass="dashboard-donut-chart" />
        </Colxx>
      </Row>
      <Row className="mb-4">
        <img src="/assets/img/main/wyvern.png" alt="Red Wyvern"/>
      </Row>
    </>
  );
};

export default BotDefault;
