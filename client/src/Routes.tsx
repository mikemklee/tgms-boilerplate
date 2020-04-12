import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LoginView from './modules/user/LoginView';
import RegisterView from './modules/user/RegisterView';
import AccountView from './modules/account/AccountView';
import Header from './shared/Header';

export class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={LoginView} />
          <Route // catch-all route for views that display Header
            path='/'
            render={() => (
              <>
                <Header />
                <Route path='/register' component={RegisterView} />
                <Route path='/account' component={AccountView} />
                <Route exact path='/' render={() => <div>homepage</div>} />
              </>
            )}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
