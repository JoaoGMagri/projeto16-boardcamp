import {connection} from "../database/database.js";

export async function postGamesMD(req, res, next) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    
    try {
        const game = await connection.query(`SELECT * FROM games WHERE name=$1;`, [name]);
        if (game.rowCount !== 0) {
            res.sendStatus(409);
            return;
        }
        const categoriesID = await connection.query("SELECT * FROM categories WHERE id=$1;", [categoryId]);
        if (categoriesID.rowCount === 0) {
            res.sendStatus(400);
            return;
        }
        if (!name) {
            res.sendStatus(400);
            return;
        }
        if (stockTotal <= 0) {
            res.sendStatus(400);
            return;
        }
        if (pricePerDay <= 0) {
            res.sendStatus(400);
            return;
        }
        
    } catch (error) {
        res.sendStatus(500);
    }

    next();
}