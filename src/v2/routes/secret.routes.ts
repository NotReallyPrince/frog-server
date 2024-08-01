import { IRouter, Request, Response, Router } from "express";
import { generateToken } from "../helper/secret.helper";
import { deleteTokens, getTokens, redeemToken } from "../controller/secret.controller";

const router: IRouter = Router();

router.post('/generate', (req: Request, res: Response) => {
    const { body } = req;
    generateToken(body).then((data) => {
      return res.status(200).json({data, message: 'Token Generated Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to generate Token" })
    })
  })

  router.post('/token', (req: Request, res: Response) => {
    getTokens().then((data) => {
      return res.status(200).json({data, message: 'Token retrieved Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to retrieve Token" })
    })
  })


  router.delete('/token/:id', (req: Request, res: Response) => {

    const {id} =req.params
    deleteTokens(id).then((data) => {
      return res.status(200).json({data, message: 'Token deleted Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to delete Token" })
    })
  })

  router.post('/token/redeem', (req: Request, res: Response) => {

    const {body} =req.body
    redeemToken(body).then((data) => {
      return res.status(200).json({data, message: 'Token deleted Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to delete Token" })
    })
  })

  
export default router;