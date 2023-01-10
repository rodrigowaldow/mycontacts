const CategoryRepository = require('../repositories/CategoryRepository');

class CategoryController {
  async index(req, res) {
    const { orderBy } = req.query;

    const categories = await CategoryRepository.findAll(orderBy);

    res.json(categories);
  }

  // Error Handler (Middleware Express) -> Manipulador de erros

  async show(req, res) {
    // Obter um registro
    const { id } = req.params;
    const category = await CategoryRepository.findById(id);

    if (!category) {
      // 404: Not found
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  }

  async store(req, res) {
    // Criar um novo registro
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const categoryExists = await CategoryRepository.findByName(name);

    if (categoryExists) {
      // 400: Bad request
      return res.status(400).json({ error: 'This category is already exists' });
    }

    const category = await CategoryRepository.create({ name });
    // 204: No content
    res.json(category);
  }

  async update(req, res) {
    // Editar um registro
    const { id } = req.params;
    const { name } = req.body;

    const categoryExists = await CategoryRepository.findById(id);
    if (!categoryExists) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const contactByNameExists = await CategoryRepository.findByName(name);
    if (contactByNameExists) {
      return res.status(400).json({ error: 'This category is already exists' });
    }

    const category = await CategoryRepository.update(id, { name });

    res.json(category);
  }

  async delete(req, res) {
    // Deletar um registro
    const { id } = req.params;

    await CategoryRepository.delete(id);

    // 204: No content
    res.sendStatus(204);
  }
}

module.exports = new CategoryController();
