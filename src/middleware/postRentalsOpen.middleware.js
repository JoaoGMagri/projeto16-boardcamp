import { connection } from "../database/database.js";
import dayjs from "dayjs";

export async function postRentalsOpenMD(req, res, next){
    const { customerId, gameId, daysRented } = req.body;
    const rendDate= dayjs().format("YYYY-MM-DD");

    try {
        if(daysRented <= 0){
            res.sendStatus(400);
            return;
        }

        const customers = await connection.query(`
            SELECT 
                *
            FROM 
                customers 
            WHERE 
                id=$1;
            `,
            [customerId]
        );
        if(customers.rowCount === 0){
            res.sendStatus(400);
            return;
        }
        
        const games = await connection.query(`
            SELECT 
                *
            FROM 
                games 
            WHERE 
                id=$1;
            `,
            [gameId]
        );
        if(games.rowCount === 0){
            res.sendStatus(400);
            return;
        }

        const rentals = await connection.query(`
            SELECT 
                *
            FROM 
                rentals 
            WHERE 
                "gameId"=$1;
            `,
            [gameId]
        );
        const stock = games.rows[0].stockTotal - rentals.rowCount;
        if(stock <= 0){
            res.sendStatus(400);
            return;
        }

        const originalPrice = games.rows[0].pricePerDay + Number(daysRented);
        
        req.obj = {customerId, gameId, rendDate, daysRented,originalPrice}
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }    

    next();
}