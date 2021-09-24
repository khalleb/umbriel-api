import { ILike, SelectQueryBuilder } from 'typeorm';

import { env } from '@shared/env';

type StatusType = 'active' | 'inactive' | 'both';

export interface IPagination {
  limit: number;
  page: number;
  orderBySort?: string;
  status?: StatusType;
  order?: 'ASC' | 'DESC';
  select?: string[];
  searchQueryColumn?: string;
  searchQueryValue?: string;
}
export interface IPaginationAwareObject {
  total: number | any;
  list: Array<any> | any;
}

export const paginate = async ({
  builder,
  page,
  limit,
  status,
  leftJoinAndSelect,
  leftJoinAndSelectProperty,
  leftJoinAndSelectAlias,
  select,
  conditionKey,
  conditionValue,
  orderBySort,
  order,
  searchQueryColumn,
  searchQueryValue,
}: {
  builder: SelectQueryBuilder<any>;
  page?: number;
  limit?: number;
  status?: StatusType;
  leftJoinAndSelect?: boolean;
  leftJoinAndSelectProperty?: string;
  leftJoinAndSelectAlias?: string;
  select?: string[];
  conditionKey?: string;
  conditionValue?: any;
  orderBySort?: string;
  order?: 'ASC' | 'DESC';
  searchQueryColumn?: string;
  searchQueryValue?: string;
}): Promise<IPaginationAwareObject> => {
  if (leftJoinAndSelect) {
    builder.leftJoinAndSelect(leftJoinAndSelectProperty as string, leftJoinAndSelectAlias as string);
  }
  if (select && select.length > 0) {
    builder.select(select);
  }

  page = page || 1;
  limit = limit || Number(env.PAGE_SIZE) || 10;

  if (!status) {
    status = 'both';
  }

  if (orderBySort) {
    builder.orderBy(orderBySort, order || 'ASC');
  }

  let conditionWhere = {};
  if (status === 'active') {
    conditionWhere = { active: true };
  } else if (status === 'inactive') {
    conditionWhere = { active: false };
  }
  if (searchQueryColumn && searchQueryValue) {
    conditionWhere = { ...conditionWhere, [searchQueryColumn]: ILike(`%${searchQueryValue}%`) };
  }

  const skip: number = (page - 1) * limit;
  let res;
  if (conditionKey && conditionValue) {
    res = await builder.skip(skip).take(limit).where(conditionKey, conditionValue).getMany();
  } else {
    res = await builder.skip(skip).take(limit).where(conditionWhere).getMany();
  }
  const total = builder;
  const count: number = await total.getCount();
  const list = res || [];
  return {
    total: count,
    list,
  };
};
