import { Request, response, Response } from 'express';
import { connection as knex } from '../../config/database';

class PointController {

  async index(req: Request, res: Response) {
    const result = await knex('points').select('*');
    return res.json(result);
  }

  async filters(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parsedItems = String(items).split(',').map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return res.json(points);
  }


  async show(req: Request, res: Response) {
    const { id } = req.params;
    const point = await knex('points').select('*').where('id', id).first();

    if(!point) {
      return response.status(400).json({ message: 'Point not found.'});
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      //.select('items.title')

    return res.json({point, items});
  }

  async store(req: Request, res: Response) {
    const  {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = req.body;

    const trx = await knex.transaction();

    const point = {
      image: 'https://images.unsplash.com/photo-1566454825481-4e48f80aa4d7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    }

    const insertedIds = await trx('points').insert(point);

    const point_id = insertedIds[0];

    const pointItems = items.map((itemId: number) => {
      return {
        item_id: itemId,
        point_id: point_id
      }
    });

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return res.json({ id: point_id, ...point });
  }

}

export default new PointController();
