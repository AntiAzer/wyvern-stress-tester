/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Progress } from 'reactstrap';

import IntlMessages from '../../helpers/IntlMessages';

import axios from "axios";

const ServerStatusSummary = () => {
  const [ firstData, setFirstData ] = useState(0);
  
  const data = [
    {
      title: 'Bypass Worker',
      total: 300,
      status: firstData,
    },
  ];
  useEffect(() => {
    const update = () => {
      axios
      .get('/api/status/server?type=worker', {
        headers: {
          "Token": localStorage.getItem('token'),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setFirstData(res.data.value);
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
    <Card>
      <CardBody>
        <CardTitle>
          <IntlMessages id="dashboards.server-summary" />
        </CardTitle>
        {data.map((s, index) => {
          return (
            <div key={index} className="mb-4">
              <p className="mb-2">
                {s.title}
                <span className="float-right text-muted">
                  {s.status}/{s.total}
                </span>
              </p>
              <Progress value={(s.status / s.total) * 100} />
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};
export default ServerStatusSummary;
