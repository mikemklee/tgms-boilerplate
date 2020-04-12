import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { RouteComponentProps } from 'react-router-dom';

import { LoginMutation, LoginMutationVariables } from '../../schemaTypes';
import { meQuery } from '../../graphql/queries/me';
import { userFragment } from '../../graphql/fragments/userFragment';
import { Form } from '../../shared/Form';
import { Section } from '../../shared/Section';

const loginMutation = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ...UserInfo
    }
  }

  ${userFragment}
`;

export default class LoginView extends React.Component<
  RouteComponentProps<{}>
> {
  render() {
    return (
      <Mutation<LoginMutation, LoginMutationVariables>
        update={(cache, { data }) => {
          if (!data || !data.login) {
            return;
          }

          cache.writeQuery({
            query: meQuery,
            data: { me: data.login },
          });
        }}
        mutation={loginMutation}
      >
        {(mutate, { client }) => (
          <Section>
            <Form
              buttonText='login'
              onSubmit={async (data) => {
                // optional reset cache
                if (client) await client.resetStore();

                const response = await mutate({
                  variables: data,
                });
                console.log('Login response', response);
                this.props.history.push('/account');
              }}
            />
          </Section>
        )}
      </Mutation>
    );
  }
}
