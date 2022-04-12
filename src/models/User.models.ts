import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  Table,
  TableOptions,
  UpdatedAt,
} from 'sequelize-typescript';

const tableOption: TableOptions = {
  timestamps: true,
  tableName: 'User',
};

@Table(tableOption)
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM('Actived', 'Pending'),
    defaultValue: 'Pending',
  })
  isActived: string;

  @Column({
    type: DataType.ENUM('Admin', 'User'),
    defaultValue: 'User',
  })
  role: string;

  @Column({
    type: DataType.STRING,
  })
  resetPasswordToken: string;

  @Column({
    type: DataType.DATE,
  })
  expiredPasswordToken: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}