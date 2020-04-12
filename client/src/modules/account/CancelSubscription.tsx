import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import { CancelSubscriptionMutation } from '../../schemaTypes';
import { userFragment } from '../../graphql/fragments/userFragment';

const cancelSubscriptionMutation = gql`
  mutation CancelSubscriptionMutation {
    cancelSubscription {
      ...UserInfo
    }
  }

  ${userFragment}
`;

export default class CancelSubscription extends React.Component {
  render() {
    return (
      <Mutation<CancelSubscriptionMutation>
        mutation={cancelSubscriptionMutation}
      >
        {(mutate) => (
          <button onClick={() => mutate()}>cancel subscription</button>
        )}
      </Mutation>
    );
  }
}
