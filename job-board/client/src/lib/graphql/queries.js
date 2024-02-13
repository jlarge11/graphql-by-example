import { ApolloClient, gql, InMemoryCache, createHttpLink, ApolloLink, concat } from '@apollo/client';
import { getAccessToken } from '../auth';

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' });

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` } 
    });
  }

  return forward(operation);
})

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
      id
      title
      date
      description

      company {
        id
        name
      }
  }
`;

const jobByIdQuery  = gql`
  query Job ($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export const companyByIdQuery = gql`
  query Company($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
        date
        description
      }
    }
  }
`;

export async function getJob(id) {
  const { data } = await apolloClient.query({
    query: jobByIdQuery,
    variables: { id },
  });

  return data.job;
}

export async function getJobs() {
  const query = gql`
    query Jobs {
      jobs {
        id
        title
        date

        company {
          id
          name
        }
      }
    }
  `;

    
  const { data } = await apolloClient.query({
    query,
    fetchPolicy: 'network-only',
  });

  return data.jobs;
}

export async function createJob({ title, description }) {
  const mutation  = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${jobDetailFragment}
  `;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { input: { title, description } },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: {id: data.job.id },
        data, 
      });
    },
  });

  return data.job;
}