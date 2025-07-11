import Category from '../db/models/Category.js';

export const getCategories = async () => {
    const categories = await Category.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
    });

    return categories;
};
