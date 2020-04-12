import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';

import { MeQuery } from '../schemaTypes';
import { meQuery } from '../graphql/queries/me';

export default class Header extends React.Component {
  render() {
    return (
      <div>
        <Link to='/'>
          <h2>Stripe example</h2>
        </Link>
        <Query<MeQuery> query={meQuery}>
          {({ data, loading }) => {
            if (loading || !data) {
              return null;
            }

            if (!data.me) {
              return (
                <div>
                  <div>
                    <Link to='/login'>login</Link>
                  </div>
                  <div>
                    <Link to='/register'>register</Link>
                  </div>
                </div>
              );
            }

            // user logged in
            return (
              <div>
                <Link to='/account'>account</Link>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}
