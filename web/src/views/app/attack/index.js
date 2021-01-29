import React, { Suspense, useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import axios from 'axios'

const BypassDefault = React.lazy(() =>
  import('./bypass')
);
const CustomDefault = React.lazy(() =>
  import('./custom')
);
const SimpleDefault = React.lazy(() =>
  import('./simple')
);

const Attack = ({ match }) => {
  const [attackLogs, setAttackLogs] = useState([]);
  useEffect(() => {
    const update = () => {
      axios
        .get('/api/task/history?type=attack', {
          headers: {
            "Token": localStorage.getItem('token'),
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            setAttackLogs(res.data.attacks);
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
    <Suspense fallback={<div className="loading" />}>
      <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/bypass`} />
        <Route
          path={`${match.url}/bypass`}
          render={(props) => <BypassDefault {...props} attackLogs={attackLogs} />}
        />
        <Route
          path={`${match.url}/custom`}
          render={(props) => <CustomDefault {...props} attackLogs={attackLogs} />}
        />
        <Route
          path={`${match.url}/simple`}
          render={(props) => <SimpleDefault {...props} attackLogs={attackLogs} />}
        />
        <Redirect to="/error" />
      </Switch>
    </Suspense>
  )
};
export default Attack;
