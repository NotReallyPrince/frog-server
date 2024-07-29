import { IRouter, Request, Response, Router } from "express";
import { CreateUser, createUserHelper, leadershipController } from "../controller/user.controller";
import { getTopUsersWithPoints } from "../queries/user.queries";

const router: IRouter = Router();

router.post('/init', (req: Request, res: Response) => {
    const data:CreateUser = req.body;
    
    createUserHelper(data).then((response) => {
        res.status(200).json(response)
    }).catch((err) => {
        res.status(400).json({ message:'something went wrong' })
    })  
})

router.get('/leadership-board/:userId', (req: Request, res: Response) => {
    
    leadershipController(req?.params?.userId).then((topData) => {
        res.status(200).json({users: topData})
    }).catch(err => {
        console.error(err)
        res.status(501).json({message: "Internal server error"})
    })
})

export default router;