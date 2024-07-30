import { IRouter, Request, Response, Router } from "express";
import { CreateUser, createUserHelper, friendsDetailsPage, leadershipController } from "../controller/user.controller";
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

router.get('/friends/:userId', (req: Request, res: Response) => {
    const userId:any = req?.params?.userId;

    friendsDetailsPage(userId).then(data => {
        res.status(200).json({data})
    }).catch(err => {
        res.status(501).json({message: 'Something went wrong!'})
    })
})

export default router;