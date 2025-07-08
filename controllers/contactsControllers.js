import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import * as contactsServices from "../services/contactsServices.js";

// GET /api/contacts?page=&limit=&favorite=
export const getAllContacts = async (req, res, next) => {
  try {
    const { page, limit, favorite } = req.query;
    const contacts = await contactsServices.listContacts(req.user.id, { page, limit, favorite });
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

// GET /api/contacts/:id
export const getOneContact = async (req, res, next) => {
  try {
    const contact = await contactsServices.getContactById(req.user.id, req.params.id);
    if (!contact) throw HttpError(404, "Contact not found");
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/contacts/:id
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await contactsServices.removeContact(req.user.id, req.params.id);
    if (!contact) throw HttpError(404, "Contact not found");
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
};

// POST /api/contacts
export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const newContact = await contactsServices.addContact(req.user.id, req.body);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

// PUT /api/contacts/:id
export const updateContact = async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { error } = updateContactSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const contact = await contactsServices.updateContact(req.user.id, req.params.id, req.body);
    if (!contact) throw HttpError(404, "Contact not found");

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/contacts/:id/favorite
export const updateStatusContact = async (req, res, next) => {
  try {
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const contact = await contactsServices.updateStatusContact(req.user.id, req.params.id, req.body.favorite);
    if (!contact) throw HttpError(404, "Contact not found");

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
