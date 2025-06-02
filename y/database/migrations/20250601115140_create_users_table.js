exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('email', 255).unique().notNullable();
    table.string('password', 255).notNullable();
    table.string('name', 255);
    table.timestamps(true, true); 
    
    table.index('email');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};