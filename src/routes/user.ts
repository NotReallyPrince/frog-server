import { Request, Response, Router } from 'express';
import { CreateUser, createUserHelper } from '../helper/user.helper';

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

export default router