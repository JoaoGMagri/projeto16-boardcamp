import {connection} from "../database/database.js";

export async function postCategoriesMD(req, res, next) {
    const { name } = req.body;
    
    try {
        const categories = await connection.query("SELECT * FROM categories WHERE name=$1;", [name]);
        if (categories.rowCount !== 0) {
            res.sendStatus(409);
            return;
        }
        
    } catch (error) {
        res.sendStatus(500);
    }

    next();
}