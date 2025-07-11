import ctrlWrapper from '../helpers/controllerWrapper.js';
import * as categoriesServices from '../services/categoriesServices.js';

const getCategories = async (req, res) => {
    const categories = await categoriesServices.getCategories();
    res.status(200).json({ categories });
};

export default {
    getCategories: ctrlWrapper(getCategories),
};
