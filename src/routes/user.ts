import { Request, Response, Router } from 'express';
import { CreateUser, createUserHelper, getLeadershipBoard, getUserDetailsById, getUserDetailsByTgId, myFriendsList } from '../helper/user.helper';

const router = Router();

router.post('/init', (req:Request, res:Response) => {
  const data:CreateUser = req.body;
  
  createUserHelper(data).then((user) => { 
    res.status(200).json(user);
  }).catch((e) => {
    console.log(e);
    res.status(400).json({ message:'something went wrong' })
  })
})

router.get('/verification/:userId', (req: Request, res: Response) => {
  const {userId} = req.params;
  
  if(!userId){
    return res.status(400).json({ message: "User ID is required" })
  }

  getUserDetailsById(userId).then((user) => {
    const data = {
      isPremium: user?.premium ? true : false,
      accountAge: user?.createdAt ? true : false,
      activityLevel: true,
      ogStatus: true
    }
    return res.status(200).json({data, message: 'Fetched successfully'})
  }).catch(err => {
    res.status(500).json({ err, message: "User details fetching failed" })
  })
})

router.get('/age-and-coins/:userId', (req: Request, res: Response) => {
  const {userId} = req.params;

  if(!userId){
    return res.status(400).json({ message: "User ID is required" })
  }

  getUserDetailsByTgId(userId).then((user) => {
    const data = {
      points: user?.point?.point,
      agePoint: user?.age,
      apeInclude: user?.apeInclude
    }
    return res.status(200).json({data, message: 'Fetched successfully'})
  }).catch(err => {
    console.log(err);
    
    res.status(500).json({ err, message: "User details fetching failed" })
  })
})

router.get('/age/:userId', (req: Request, res: Response) => {
  const {userId} = req.params;

  if(!userId){
    return res.status(400).json({ message: "User ID is required" })
  }

  getUserDetailsByTgId(userId).then((user) => {
    const data = {
      age: user?.createdAt
    }
    
    return res.status(200).json({data, message: 'Fetched successfully'})
  }).catch(err => {
    res.status(500).json({ err, message: "User details fetching failed" })
  })
})

router.get('/leadership-board', (req: Request, res: Response) => {
  const page: any = req.params.page || 1;
  const perPage: any = req.params?.perPage || 100;
  getLeadershipBoard(page, perPage).then((user) => {
    return res.status(200).json({data: user, message: 'Fetched successfully'})
  }).catch(err => {
    res.status(500).json({ err, message: "User details fetching failed" })
  })
})

router.get('/myfriends/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  if(!id){
    return res.status(400).json({ message: "User ID is required" })
  }

  myFriendsList(parseInt(id)).then((data) => {
    return res.status(200).json({data, message: 'Fetched successfully'})
  }).catch(err => {
    res.status(500).json({ err, message: "User details fetching failed" })
  })
})

export default router