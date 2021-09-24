import { Joi } from 'celebrate';

export const paginationRoute = {
  searchQueryColumn: Joi.string().allow(null, ''),
  searchQueryValue: Joi.string().allow(null, ''),
  page: Joi.number().required(),
  limit: Joi.number(),
  orderBySort: Joi.string(),
  status: Joi.string().valid('active', 'inactive', 'both'),
  order: Joi.string().valid('ASC', 'DESC'),
  select: Joi.array().items(Joi.string()),
};
