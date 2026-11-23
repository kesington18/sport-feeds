import {Router} from 'express';

export const matchRouter = Router();

matchRouter.get("/", (res, req) => {
    res.statusCode(200).json({
        message: "Matches List"
    })
})