import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getCompany } from '../lib/graphql/queries';
import JobList from '../components/JobList';

function CompanyPage() {
  const { companyId } = useParams();

  const [company, setCompany] = useState();

  useEffect(() => {
    getCompany(companyId).then(setCompany);
  }, [ companyId ]);

  if (!company) {
    return <div>Loading...</div>
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
