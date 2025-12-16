import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8080/v1/graphql',
    credentials: 'include',
    headers: {
      'x-hasura-admin-secret': 'hasura-admin-secret-change-me',
    },
  }),
  cache: new InMemoryCache(),
});

export const GET_RESUMES = gql`
  query GetResumes($userId: String!) {
    resume(where: { userId: { _eq: $userId } }) {
      id
      name
      email
      isPublic
      experiences {
        id
        title
        company
      }
      educations {
        id
        degree
        school
      }
      skills {
        id
        name
      }
    }
  }
`;

export default client;
