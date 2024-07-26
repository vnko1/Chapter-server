import {
  CreateOptions,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  UpdateOptions,
} from 'sequelize';

export interface ModelServiceInterface<T> {
  add(data: any, opt?: CreateOptions): Promise<T>;

  edit<T extends object>(
    data: T,
    opt: UpdateOptions,
  ): Promise<[affectedCount: number]>;

  delete(opt: DestroyOptions): Promise<number>;

  findByPk<M extends string | number>(pk: M, opt?: FindOptions): Promise<T>;

  findOne(opt?: FindOptions): Promise<T>;

  findAll(opt?: FindOptions): Promise<T[]>;

  findAndCountAll(opt?: Omit<FindAndCountOptions<any>, 'group'>): Promise<{
    rows: T[];
    count: number;
  }>;
}
