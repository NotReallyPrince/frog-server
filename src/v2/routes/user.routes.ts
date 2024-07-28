import { IRouter, Request, Response, Router } from "express";
import { CreateUser, createUserHelper } from "../controller/user.controller";

const router: IRouter = Router();

router.post('/init', (req: Request, res: Response) => {
    const data:CreateUser = req.body;
    
    createUserHelper(data).then((response) => {
        res.status(200).json(response)
    }).catch((err) => {
        res.status(400).json({ message:'something went wrong' })
    })

    
})

export default router;