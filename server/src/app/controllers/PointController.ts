
import { connection as knex } from '../../config/database';

class PointController {

  async index(req: any, res: any) {
    const result = await knex('points').select('*');
    return res.json(result);
  }

  async store(req: any, res: any) {
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

    const insertedIds = await trx('points').insert({
      image: 'image-falke',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    });

    const pointItems = items.map((itemId: number) => {
      return {
        item_id: itemId,
        point_id: insertedIds[0]
      }
    });

    await trx('point_items').insert(pointItems);

    return res.json({ message: 'success' });
  }

}

export default new PointController();
