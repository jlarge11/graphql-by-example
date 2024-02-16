import { GraphQLError } from 'graphql';
import { getJobs, getJob, getJobsByCompany, createJob, updateJob, deleteJob, countJobs } from './db/jobs.js';
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
        jobs: async (_root, { limit, offset }) => {
            const items = await getJobs(limit, offset);
            const totalCount = await countJobs();

            return { items, totalCount };
        },
    },

    Mutation: {
        createJob: (_root, { input: { title, description } }, { user }) => {
            if (!user) {
                handleUnauthenticated();
            }

            const { companyId } = user;
            return createJob({ companyId, title, description });
        },

        updateJob: async (_root, { input: { id, title, description } }) => {
            if (!user) {
                handleUnauthenticated();
            }

            const job = await updateJob({ id, title, description, companyId });

            if (!job) {
                handleNotFound('Job', id);
            }

            return job;
        },

        deleteJob: async (_root, { id }, { user }) => {
            if (!user) {
                handleUnauthenticated();
            }

            const job = await deleteJob(id, user.companyId);

            if (!job) {
                handleNotFound('Job', id);
            }

            return job;
        },
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id),
    },

    Job: {
        date: (job) => toIsoDate(job.createdAt),
        company: (job, _args, { companyLoader }) => {
            return companyLoader.load(job.companyId);
        },
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

function handleUnauthenticated() {
    throw new GraphQLError(`Unauthenticated`, {
        extensions: { code: 'UNAUTHENTICATED' }
    });
}