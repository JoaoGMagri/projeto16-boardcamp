import {connection} from "../database/database.js";

export async function putCustomersMD(req, res, next) {
    const { name, phone, cpf } = req.body;
    const { id } = req.params;
    
    try {
        const userCPF = await connection.query(
            "SELECT * FROM customers WHERE cpf=$1 AND id<>$2",
            [cpf, id]
        );
        if (userCPF.rowCount > 0) {
            return res.sendStatus(409);
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