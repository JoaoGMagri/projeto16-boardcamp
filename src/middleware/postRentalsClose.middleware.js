import { connection } from "../database/database.js";

export async function postRentalsCloseMD(req, res, next){
    const {id} = req.params;
    let delayFee = 0;

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
        if(rentals.rowCount === 0){
            res.sendStatus(400);
            return;
        }
        if(rentals.rows[0].returnDate !== null){
            res.sendStatus(400);
            return;
        }
        const now = new Date("2022-12-13");
        const past = new Date(rentals.rows[0].rentDate);
        const diff = Math.abs(now.getTime() - past.getTime());
        let days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        days = days - rentals.rows[0].daysRented;
        
        const games = await connection.query(`
            SELECT 
                *
            FROM 
                games 
            WHERE 
                id=$1;
            `,
            [rentals.rows[0].gameId]
        );
        console.log(days);
        if(days > 0){
            delayFee = days * games.rows[0].pricePerDay;
        }
        
        req.obj = {now, delayFee, id}
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }    

    next();
}