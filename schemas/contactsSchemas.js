import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(3).required(),
    favorite: Joi.boolean(),
})

export const updateContactSchema = Joi.object({
    name: Joi.string().min(1),
    email: Joi.string().email(),
    phone: Joi.string().min(3),
    favorite: Joi.boolean(),
})

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});