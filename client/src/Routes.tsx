import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LoginView from './modules/user/LoginView';
import RegisterView from './modules/user/RegisterView';
import MeView from './modules/user/MeView';
import UserSubscriptionView from './modules/account/UserSubscriptionView';

export class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={LoginView} />
          <Route path='/register' component={RegisterView} />
          <Route path='/me' component={MeView} />
          <Route path='/subscription' component={UserSubscriptionView} />
        </Switch>
      </BrowserRouter>
    );
  }
}
