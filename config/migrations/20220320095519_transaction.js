/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('transactions', table => {
        table.string('id', 10).notNullable().unique().primary();
        table.string('user_id', 10).notNullable().references('id').inTable('users');
        table.string('bank_name');
        table.string('sender')
        table.string('receiver');
        table.string('account_no');
        table.bigInteger('amount');
        table.string('transaction_details');
        table.dateTime('reference_no').defaultTo(knex.fn.now());
        table.timestamp('createdAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('transactions');
};
