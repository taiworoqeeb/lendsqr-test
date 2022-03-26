/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
    return knex.schema
        .createTable('users', table => {
            table.string('id', 10).notNullable().unique().primary();
            table.string('email').notNullable().unique();
            table.string('fullname').notNullable();
            table.string('username').notNullable().unique();
            table.string('password').notNullable();
            table.string('pin').notNullable();
            table.bigInteger('money').notNullable().defaultTo(0);
            table.timestamp('createdAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        });

  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
