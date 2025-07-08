import User from './User.js';
import Contact from './Contact.js';

User.hasMany(Contact, { foreignKey: 'owner', onDelete: 'CASCADE' });
Contact.belongsTo(User, { foreignKey: 'owner' });

export { User, Contact };