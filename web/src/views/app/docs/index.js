import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const AttackMethodDefault = React.lazy(() =>
  import('./attack-method')
);
const AttackTutorialDefault = React.lazy(() =>
  import('./attack-tutorial')
);
const CreditDefault = React.lazy(() =>
  import('./credit')
);
const SettingServerDefault = React.lazy(() =>
  import('./setting-server')
);

const Docs = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/setting-server`} />
      <Route
        path={`${match.url}/attack-method`}
        render={(props) => <AttackMethodDefault {...props} />}
      />
      <Route
        path={`${match.url}/attack-tutorial`}
        render={(props) => <AttackTutorialDefault {...props} />}
      />
      <Route
        path={`${match.url}/credit`}
        render={(props) => <CreditDefault {...props} />}
      />
      <Route
        path={`${match.url}/setting-server`}
        render={(props) => <SettingServerDefault {...props} />}
      />
      {/* 
      <ProtectedRoute
        path={`${match.url}/default`}
        component={DashboardDefault}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/content`}
        component={ContentDefault}
        roles={[UserRole.Admin]}
      />
      <ProtectedRoute
        path={`${match.url}/ecommerce`}
        component={EcommerceDefault}
        roles={[UserRole.Editor]}
      />
      <ProtectedRoute
        path={`${match.url}/analytics`}
        component={AnalyticsDefault}
        roles={[UserRole.Editor]}
      />
      */}

      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Docs;
