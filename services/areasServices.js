import Area from '../db/models/Area.js';

export const getAreas = async () => {
    const areas = await Area.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
    });

    return areas;
};
