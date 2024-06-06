import {
  Table,
  Model,
  Column,
  DataType,
  AllowNull,
  Default,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';

@Table
export class Comment extends Model {}
