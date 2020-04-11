import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LoginView from './modules/user/LoginView';
import RegisterView from './modules/user/RegisterView';
import AccountView from './modules/account/AccountView';

export class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={LoginView} />
          <Route path='/register' component={RegisterView} />
          <Route path='/account' component={AccountView} />
        </Switch>
      </BrowserRouter>
    );
  }
}
