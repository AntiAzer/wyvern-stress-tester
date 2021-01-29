import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { Colxx } from '../../components/common/CustomBootstrap';
import RadialProgressCard from '../../components/cards/RadialProgressCard';

import axios from 'axios';

const ServerResourceStatus = () => {
  const [ firstData, setFirstData ] = useState(0);
  const [ secondData, setSecondData ] = useState(0);
  const [ thridData, setThridData ] = useState(0);
  const state = [
    {
      key: 1,
      title: 'dashboards.cpu-usage',
      percent: firstData,
    },
    {
      key: 2,
      title: 'dashboards.ram-usage',
      percent: secondData,
    },
    {
      key: 3,
      title: 'dashboards.disk-usage',
      percent: thridData,
    },
  ];
  useEffect(() => {
    const update = () => {
      axios
      .get('/api/status/server?type=cpu', {
        headers: {
          "Token": localStorage.getItem('token'),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setFirstData(res.data.value);
        }
      })
      axios
      .get('/api/status/server?type=ram', {
        headers: {
          "Token": localStorage.getItem('token'),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setSecondData(res.data.value);
        }
      })
      axios
      .get('/api/status/server?type=disk', {
        headers: {
          "Token": localStorage.getItem('token'),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setThridData(res.data.value);
        }
        setTimeout(update, 10000);
      })
      .catch(() => {
        setTimeout(update, 10000);
      })
    }
    update();
  }, []);

  return (
    <div className="row" >
      {state.map((x) => {
        return (
          <Colxx xl="4" lg="6" className="mb-4" key={x.key}>
            <RadialProgressCard
              title={<FormattedMessage id={x.title} />}
              percent={x.percent}
            />
          </Colxx>
        );
      })}
    </div>
  );
};
export default ServerResourceStatus;
