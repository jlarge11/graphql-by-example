import { useParams } from 'react-router';
import JobList from '../components/JobList';
import { useCompany } from '../lib/graphql/hooks';

function CompanyPage() {
  const { companyId } = useParams();
  const { company, loading, error } = useCompany(companyId);

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div class="has-text-danger"> Data unavailable</div>
  }

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
