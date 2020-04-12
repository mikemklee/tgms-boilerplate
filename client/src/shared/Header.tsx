import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import styled from 'styled-components';

import { MeQuery } from '../schemaTypes';
import { meQuery } from '../graphql/queries/me';

const HeaderContainer = styled.div`
  height: 50px;
  border: 1px dashed #bbb;
  padding: 10px;
  width: 100%;
  background-color: rgb(255, 254, 252);
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const HeaderLink = styled(Link)`
  align-items: center;
  color: inherit;
  user-select: none;
  width: auto;
  display: block;
  padding: 4px 10px;
  border-radius: 3px;
  margin-left: 4px;
  margin-right: 4px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: rgba(50, 50, 50, 0.08);
  }

  &:first-of-type {
    margin-right: auto;
  }
`;

export default class Header extends React.Component {
  render() {
    return (
      <HeaderContainer>
        <HeaderLink to='/'>Project name</HeaderLink>
        <Query<MeQuery> query={meQuery}>
          {({ data, loading }) => {
            if (loading || !data) {
              return null;
            }

            if (!data.me) {
              return (
                <>
                  <HeaderLink to='/login'>login</HeaderLink>
                  <HeaderLink to='/register'>register</HeaderLink>
                </>
              );
            }

            // user logged in
            return <HeaderLink to='/account'>account</HeaderLink>;
          }}
        </Query>
      </HeaderContainer>
    );
  }
}
