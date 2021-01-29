import React, { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import { TableBotList } from '../../../containers/ui/TableBotList';
import axios from 'axios';

const ListDefault = ({ match }) => {
  const [ bots, setBots ] = useState([]);
  useEffect(() => {
    const update = () => {
      axios
      .get('/api/status/bot/list', {
        headers: {
          "Token": localStorage.getItem('token'),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setBots(res.data.bots);
        }
        setTimeout(update, 5000);
      })
      .catch(() => {
        setTimeout(update, 5000);
      })
    }
    update();
  }, []);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.bot.list" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12">
          <TableBotList data={(bots || [])} />
        </Colxx>
      </Row>
    </>
  );
};

export default ListDefault;
