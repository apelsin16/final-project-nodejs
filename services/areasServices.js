import Area from '../db/models/Area.js';
import Recipe from '../db/models/Recipe.js';
import Category from '../db/models/Category.js';
import { sequelize } from '../db/models/index.js';

export const getAreas = async (categoryName = null) => {
    if (!categoryName) {
        // Якщо категорія не вказана, повертаємо всі області
        const areas = await Area.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
        });
        return areas;
    }

    // Фільтруємо області за категорією використовуючи підзапит
    const areas = await Area.findAll({
        attributes: ['id', 'name'],
        where: {
            id: {
                [sequelize.Sequelize.Op.in]: sequelize.literal(`(
                    SELECT DISTINCT r."areaId"
                    FROM recipes r
                    JOIN categories c ON r."categoryId" = c.id
                    WHERE c.name = '${categoryName}' AND r."areaId" IS NOT NULL
                )`)
            }
        },
        order: [['name', 'ASC']],
    });

    return areas;
};
