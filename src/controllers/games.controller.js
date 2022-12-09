import {connection} from "../database/database.js";

export async function getGames(req, res){
    const { name } = req.query;
    let games;

    try {
        if (name) {
            games = await connection.query(`
            SELECT 
                games.id,
                games.name,
                games.image,
                games."stockTotal",
                games."pricePerDay",
                categories.name AS "categoryName"
            FROM 
                games 
            JOIN 
                categories 
            ON 
                games."categoryId"=categories.id 
            WHERE 
                games.name 
            ILIKE 
                '${name}%';`
            );
        } else {
            games = await connection.query(`
            SELECT 
                games.id,
                games.name,
                games.image,
                games."stockTotal",
                games."pricePerDay",
                categories.name AS "categoryName"
            FROM 
                games 
            JOIN 
                categories 
            ON 
                games."categoryId"=categories.id;`
            );
        }
        res.send(games.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}
export async function postGames(req, res){
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        await connection.query(
            `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`,
            [name, image, stockTotal, categoryId, pricePerDay]
        );
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}