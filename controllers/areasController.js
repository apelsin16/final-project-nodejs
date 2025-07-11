import ctrlWrapper from '../helpers/controllerWrapper.js';
import * as areasServices from '../services/areasServices.js';

const getAreas = async (req, res) => {
    const areas = await areasServices.getAreas();
    res.status(200).json({ areas });
};

export default {
    getAreas: ctrlWrapper(getAreas),
};
