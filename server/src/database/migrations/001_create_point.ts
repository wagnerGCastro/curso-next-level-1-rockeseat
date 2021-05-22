import { Knex, knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema
    .createTable('points', table => {
      table.increments('id').primary();
      table.string('image').notNullable();
      table.string('title').notNullable();

    })
}

export async function down(knex: Knex) {
  return knex.schema.dropSchema('points');
}
