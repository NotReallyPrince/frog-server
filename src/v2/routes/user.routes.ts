import { IRouter, Request, Response, Router } from "express";
import { CreateUser, createUserHelper, HomePageUserDetailsController, leadershipController, telegramMemberCheckController } from "../controller/user.controller";
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

router.get('/age-and-coins/:userId', (req: Request, res: Response) => {
    const {userId} = req.params;
  
    if(!userId){
      return res.status(400).json({ message: "User ID is required" })
    }
  
    HomePageUserDetailsController(userId).then((user) => {
    
      return res.status(200).json({user, message: 'Fetched successfully'})
    }).catch(err => {
      console.log(err);
      
      res.status(500).json({ err, message: "User details fetching failed" })
    })
  })

  router.get('/telegram/:id', (req: Request, res: Response) => {
    const { id } = req.params;
  
    if(!id){
      return res.status(400).json({ message: "User ID is required" })
    }
  
    telegramMemberCheckController(parseInt(id)).then((data) => {
      return res.status(200).json({data, message: 'Fetched successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "User details fetching failed" })
    })
  })


export default router;