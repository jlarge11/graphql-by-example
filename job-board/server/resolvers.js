import { GraphQLError } from 'graphql';
import { getJobs, getJob, getJobsByCompany, createJob } from './db/jobs.js';
import { getCompany } from './db/companies.js';

export const resolvers = {
    Query: {
        company: async (_root, { id }) => {
            const company = await getCompany(id);

            if (!company) {
                handleNotFound('Company', id);
            }

            return company;
        },
        job: async (_root, { id }) => {
            const job = await getJob(id)

            if (!job) {
                handleNotFound('Job', id);
            }

            return job;
        }, 
        jobs: () => getJobs(),
    },

    Mutation: {
        createJob: (_root, { input: { title, description } }) => {
            const companyId = 'FjcJCHJALA4i';

            return createJob({ companyId, title, description });
        },
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id),
    },

    Job: {
        date: (job) => toIsoDate(job.createdAt),
        company: (job) => getCompany(job.companyId),
    },
}

function toIsoDate(dateTime) {
    return dateTime.slice(0, 'yyyy-mm-dd'.length);
}

function handleNotFound(resourceName, resourceId) {
    throw new GraphQLError(`No ${resourceName} found with ID ${resourceId}.`, {
        extensions: { code: 'NOT_FOUND' }
    });
}