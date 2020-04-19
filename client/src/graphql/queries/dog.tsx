import { gql } from 'apollo-boost';

export const dogQuery = gql`
  query DogQuery {
    dog {
      ...DogInfo
    }
  }

  fragment DogInfo on Dog {
    imgUrl
  }
`;
