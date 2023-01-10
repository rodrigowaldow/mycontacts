const ContactRepository = require('../repositories/ContactRepository');

class ContactController {
  async index(req, res) {
    const { orderBy } = req.query;
    // Listar todos os registros
    const contacts = await ContactRepository.findAll(orderBy);

    res.json(contacts);
  }

  async show(req, res) {
    // Obter um registro
    const { id } = req.params;
    const contact = await ContactRepository.findById(id);

    if (!contact) {
      // 404: Not found
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  }

  async store(req, res) {
    // Criar um novo registro
    const {
      name, email, phone, category_id,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const contactExists = await ContactRepository.findByEmail(email);

    if (contactExists) {
      // 400: Bad request
      return res.status(400).json({ error: 'This e-mail is already in use' });
    }

    const contact = await ContactRepository.create({
      name, email, phone, category_id,
    });
    // 204: No content
    res.json(contact);
  }

  async update(req, res) {
    // Editar um registro
    const { id } = req.params;
    const {
      name, email, phone, category_id,
    } = req.body;

    const contactExists = await ContactRepository.findById(id);
    if (!contactExists) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const contactByEmailExists = await ContactRepository.findByEmail(email);
    if (contactByEmailExists && contactByEmailExists.id !== id) {
      return res.status(400).json({ error: 'This e-mail is already in use' });
    }

    const contact = await ContactRepository.update(id, {
      name, email, phone, category_id,
    });

    res.json(contact);
  }

  async delete(req, res) {
    // Deletar um registro
    const { id } = req.params;

    await ContactRepository.delete(id);

    // 204: No content
    res.sendStatus(204);
  }
}

// Singleton
module.exports = new ContactController();
