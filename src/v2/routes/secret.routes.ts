import { IRouter, Request, Response, Router } from "express";
import { generateToken } from "../helper/secret.helper";
import { deleteTokens, getTokens, getValidity, redeemToken } from "../controller/secret.controller";
import { isAuthenticated } from "../middlewares/requestValidators/auth.middleware";

const router: IRouter = Router();

router.post('/generate',isAuthenticated, (req: Request, res: Response) => {
    const { body } = req;
    generateToken(body).then((data) => {
      return res.status(200).json({data, message: 'Token Generated Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to generate Token" })
    })
  })

  router.get('/token', isAuthenticated,(req: Request, res: Response) => {
    console.log(req)
    getTokens().then((data) => {
      return res.status(200).json({data, message: 'Token retrieved Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to retrieve Token" })
    })
  })


  router.delete('/token/:id',isAuthenticated, (req: Request, res: Response) => {

    const {id} =req.params
    deleteTokens(id).then((data) => {
      return res.status(200).json({data, message: 'Token deleted Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to delete Token" })
    })
  })

  router.post('/token/redeem', (req: Request, res: Response) => {
    const {body} =req
    redeemToken(body).then((data) => {
      return res.status(200).json({data, message: 'Token redeemed Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to Redeem Token" })
    })
  })

  router.get('/token/validity', (req: Request, res: Response) => {
   
    getValidity().then((data) => {
      return res.status(200).json({data, message: 'Validity retrieved Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to retrieve validty" })
    })
  })


  
export default router;