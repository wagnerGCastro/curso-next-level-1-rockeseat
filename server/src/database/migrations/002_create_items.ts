import { Knex, knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema
    .createTable('items', table => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('image').notNullable();

    })
}

export async function down(knex: Knex) {
  return knex.schema.dropSchema('items');
}
