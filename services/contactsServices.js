import { Contact } from "../models/Contact.js";
import HttpError from "../helpers/HttpError.js";

export const listContacts = async (ownerId, { page = 1, limit = 20, favorite }) => {
  const offset = (page - 1) * limit;
  const where = { owner: ownerId };
  if (favorite !== undefined) {
    where.favorite = favorite === "true"; // запитання true/false з query
  }
  const contacts = await Contact.findAll({ where, limit, offset });
  return contacts;
};

export const getContactById = async (ownerId, contactId) => {
  const contact = await Contact.findOne({ where: { id: contactId, owner: ownerId } });
  return contact;
};

export const removeContact = async (ownerId, contactId) => {
  const contact = await getContactById(ownerId, contactId);
  if (!contact) {
    return null;
  }
  await contact.destroy();
  return contact;
};

export const addContact = async (ownerId, data) => {
  const newContact = await Contact.create({ ...data, owner: ownerId });
  return newContact;
};

export const updateContact = async (ownerId, contactId, updatedData) => {
  const contact = await getContactById(ownerId, contactId);
  if (!contact) {
    return null;
  }
  await contact.update(updatedData);
  return contact;
};

export const updateStatusContact = async (ownerId, contactId, favorite) => {
  const contact = await getContactById(ownerId, contactId);
  if (!contact) {
    return null;
  }
  contact.favorite = favorite;
  await contact.save();
  return contact;
};
