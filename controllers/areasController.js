import ctrlWrapper from '../helpers/controllerWrapper.js';
import * as areasServices from '../services/areasServices.js';

const getAreas = async (req, res) => {
    const { category } = req.query;
    const areas = await areasServices.getAreas(category);
    res.status(200).json({ areas });
};

export default {
    getAreas: ctrlWrapper(getAreas),
};
