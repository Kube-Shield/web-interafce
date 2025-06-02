const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Hash the password
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  // Inserts seed entries
  await knex('users').insert([
    {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Administrator'
    }
  ]);
};