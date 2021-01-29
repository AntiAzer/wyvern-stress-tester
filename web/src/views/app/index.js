import React, { Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Dashboards = React.lazy(() =>
  import('./dashboards')
);
const Attack = React.lazy(() =>
  import('./attack')
);
const Bot = React.lazy(() =>
  import('./bot')
);
const Setting = React.lazy(() =>
  import('./setting')
);
const Docs = React.lazy(() =>
  import('./docs')
);
const BlankPage = React.lazy(() =>
  import('./blank-page')
);

const App = ({ match }) => {
  return (
    <AppLayout>
      <div className="dashboard-wrapper">
        <Suspense fallback={<div className="loading" />}>
          <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboards`} />
            <Route
              path={`${match.url}/dashboards`}
              render={(props) => <Dashboards {...props} />}
            />
            <Route
              path={`${match.url}/attack`}
              render={(props) => <Attack {...props} />}
            />
            <Route
              path={`${match.url}/bot`}
              render={(props) => <Bot {...props} />}
            />
            <Route
              path={`${match.url}/setting`}
              render={(props) => <Setting {...props} />}
            />
            <Route
              path={`${match.url}/docs`}
              render={(props) => <Docs {...props} />}
            />
            <Route
              path={`${match.url}/blank-page`}
              render={(props) => <BlankPage {...props} />}
            />
            <Redirect to="/error" />
          </Switch>
        </Suspense>
      </div>
    </AppLayout>
  );
};

const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(App));
