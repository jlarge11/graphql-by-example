import { useQuery } from '@apollo/client';
import { useParams } from 'react-router';
import JobList from '../components/JobList';
import { companyByIdQuery } from '../lib/graphql/queries';

function CompanyPage() {
  const { companyId } = useParams();

  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { id: companyId },
  });

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div class="has-text-danger"> Data unavailable</div>
  }

  const { company } = data;
  const { name, description, jobs } = company;

  return (
    <div>
      <h1 className="title">
        {name}
      </h1>
      <div className="box">
        {description}
      </div>
      <h2 className="title-is5">
        Jobs at {name}
      </h2>
      <JobList jobs={ jobs } />
    </div>
  );
}

export default CompanyPage;
