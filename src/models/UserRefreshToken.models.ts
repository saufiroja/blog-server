import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  TableOptions,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './User.models';

const tableOption: TableOptions = {
  timestamps: true,
  tableName: 'UserRefreshToken',
};

@Table(tableOption)
export class UserRefreshToken extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refreshToken: string;

  @Column({
    type: DataType.DATE,
  })
  expiredAt: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @ForeignKey(() => User)
  @Column
  userId: string;

  @BelongsTo(() => User, 'userId')
  user: User;
}
