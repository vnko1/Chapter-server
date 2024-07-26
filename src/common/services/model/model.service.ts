import {
  CreateOptions,
  Model,
  ModelStatic,
  UpdateOptions,
  DestroyOptions,
  FindOptions,
  FindAndCountOptions,
} from 'sequelize';

import { AppService } from '../app/app.service';

import { ModelServiceInterface } from './model.interface';

export abstract class ModelService<TModel extends Model>
  extends AppService
  implements ModelServiceInterface<TModel>
{
  constructor(private readonly model: ModelStatic<TModel>) {
    super();
  }

  add(data: any, opt?: CreateOptions): Promise<TModel> {
    return this.model.create(data, opt);
  }

  edit<T extends object>(
    data: T,
    opt: UpdateOptions,
  ): Promise<[affectedCount: number]> {
    return this.model.update(data, opt);
  }

  delete(opt: DestroyOptions): Promise<number> {
    return this.model.destroy(opt);
  }

  findByPk<M extends string | number>(
    pk: M,
    opt?: FindOptions,
  ): Promise<TModel> {
    return this.model.findByPk(pk, opt);
  }

  findOne(opt?: FindOptions): Promise<TModel> {
    return this.model.findOne(opt);
  }

  findAll(opt?: FindOptions): Promise<TModel[]> {
    return this.model.findAll(opt);
  }

  findAndCountAll(
    opt?: Omit<FindAndCountOptions<any>, 'group'>,
  ): Promise<{ rows: TModel[]; count: number }> {
    return this.model.findAndCountAll(opt);
  }
}
