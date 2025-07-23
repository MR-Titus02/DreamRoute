import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  plan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentPeriodEnd: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

User.hasOne(Subscription, { foreignKey: 'userId' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

export default Subscription;
