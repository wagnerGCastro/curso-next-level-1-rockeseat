
import { connection as knex } from '../../config/database';

import { Request, Response } from 'express';

class ItemController {

  async index(req: Request, res: Response) {
    const result = await knex('items').select('*');

    const serializedItems = result.map(item => {
      return {
        title: item.name,
        image_url: `http://localhost:3334/static/uploads/${item.image}`
      }
    })
    return res.json(serializedItems);
  }

}

export default new ItemController();
