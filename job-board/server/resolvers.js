import { getJobs, getJob } from './db/jobs.js';
import { getCompany } from './db/companies.js';

export const resolvers = {
    Query: {
        company: (_root, { id }) => getCompany(id), 
        job: (_root, { id }) => getJob(id), 
        jobs: () => getJobs(),
    },

    Job: {
        date: (job) => toIsoDate(job.createdAt),
        company: (job) => getCompany(job.companyId),
    },
}

function toIsoDate(dateTime) {
    return dateTime.slice(0, 'yyyy-mm-dd'.length);
}