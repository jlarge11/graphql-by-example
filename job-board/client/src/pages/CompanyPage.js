import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getCompany } from '../lib/graphql/queries';
import JobList from '../components/JobList';

function CompanyPage() {
  const { companyId } = useParams();

  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const company = await getCompany(companyId);

        setState({
          company,
          loading: false,
          error: false,
        });
      } catch {
        setState({
          company: null,
          loading: false,
          error: true,
        });
      }
    })();
  }, [ companyId ]);

  const { company, loading, error } = state;

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div> Data unavailable</div>
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
