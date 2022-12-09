import {connection} from "../database/database.js";

export async function postCustomersMD(req, res, next) {
    const { name, phone, cpf } = req.body;
    
    try {
        const userCPF = await connection.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf]);
        if (userCPF.rowCount !== 0) {
            console.log(userCPF.rows)
            res.sendStatus(409);
            return;
        }
        if (cpf.length !== 11) {
            res.sendStatus(400);
            return;
        }
        if (phone.length !== 10) {
            if (phone.length !== 11) {
                res.sendStatus(400);
                return;
            }
        }
        if (!name) {
            res.sendStatus(400);
            return;
        }
    } catch (error) {
        res.sendStatus(500);
    }

    next();
}