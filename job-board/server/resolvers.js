import { getJobs } from './db/jobs.js';
import { getCompany } from './db/companies.js';

export const resolvers = {
    Query: {
        jobs: () => getJobs(),
    },

    Job: {
        dateCreated: (job) => toIsoDate(job.createdAt),
        company: (job) => getCompany(job.companyId),
    },
}

function toIsoDate(dateTime) {
    return dateTime.slice(0, 'yyyy-mm-dd'.length);
}