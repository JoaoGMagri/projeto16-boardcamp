import { connection } from "../database/database.js";

export async function postRentalsCloseMD(req, res, next) {
    const { id } = req.params;

    try {
        const rentals = await connection.query(`
        SELECT 
            *
        FROM 
            rentals 
        WHERE 
            "id"=$1;
        `,
            [id]
        );
        if (rentals.rowCount === 0) {
            res.sendStatus(404);
            return;
        }
        if (rentals.rows[0].returnDate === null) {
            res.sendStatus(400);
            return;
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

    next();
}