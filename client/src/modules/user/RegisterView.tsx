import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { RouteComponentProps } from 'react-router-dom';

import { RegisterMutation, RegisterMutationVariables } from '../../schemaTypes';
import { Form } from '../../shared/Form';
import { Section } from '../../shared/Section';

const registerMutation = gql`
  mutation RegisterMutation($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

export default class RegisterView extends React.Component<
  RouteComponentProps<{}>
> {
  render() {
    return (
      <Mutation<RegisterMutation, RegisterMutationVariables>
        mutation={registerMutation}
      >
        {(mutate) => (
          <Section>
            <Form
              buttonText='register'
              onSubmit={async (data) => {
                const response = await mutate({
                  variables: data,
                });
                console.log('Register response', response);
                this.props.history.push('/login');
              }}
            />
          </Section>
        )}
      </Mutation>
    );
  }
}
