
const { db,mysqldb } = require('./.env')

module.exports = {

	/*
	client: 'postgresql',
	connection: db,
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		tableName: 'knex_migrations'
	}
	*/

	client: 'mysql2',
	connection: mysqldb,
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		tableName: 'knex_migrations'
	}
};
