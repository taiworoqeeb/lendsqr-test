// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */


module.exports = {
  development: {
    client: 'mysql',
      connection: {
        user: 'Abdulraqeeb',
        password: null,
        database: 'lendsqr_test'
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
