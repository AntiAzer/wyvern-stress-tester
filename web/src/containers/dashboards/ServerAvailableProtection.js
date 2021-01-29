/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';

import IntlMessages from '../../helpers/IntlMessages';

const ServerAvailableProtection = () => {
  const protections = [
    {
      title: 'Cloudflare',
      link: 'https://www.cloudflare.com/',
    },
    {
      title: 'FlexProtect',
      link: 'https://www.imperva.com/',
    },
    {
      title: 'Sucuri',
      link: `https://sucuri.net/`,
    },
    {
      title: 'Google Project Shield',
      link: 'https://projectshield.withgoogle.com/',
    },
    {
      title: 'Nooder',
      link: 'https://nooder.net/',
    },
  ];

  return (
    <Card className="dashboard-link-list">
      <CardBody>
        <CardTitle>
          <IntlMessages id="dashboards.available-protections" />
        </CardTitle>
        <div className="d-flex flex-row">
          <div className="w-50">
            <ul className="list-unstyled mb-0">
              {protections.slice(0, 12).map((c, index) => {
                return (
                  <li key={index} className="mb-1">
                    <a href={c.link} target="_blank" rel="noopener noreferrer">{c.title}</a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="w-50">
            <ul className="list-unstyled mb-0">
              {protections.slice(12, 24).map((c, index) => {
                return (
                  <li key={index} className="mb-1">
                    <a href={c.link} target="_blank" rel="noopener noreferrer">{c.title}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ServerAvailableProtection;
