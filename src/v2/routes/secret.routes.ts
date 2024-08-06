import { IRouter, Request, Response, Router } from "express";
import { generateToken } from "../helper/secret.helper";
import { changeStatus, createTask, deleteTokens, getTask, getTokens, getValidity, redeemToken } from "../controller/secret.controller";
import { validateJwtToken } from "../middlewares/jwtValidator";


const router: IRouter = Router();

router.post('/generate',validateJwtToken, (req: Request, res: Response) => {
    const { body } = req;
    generateToken(body).then((data) => {
      return res.status(200).json({data, message: 'Token Generated Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to generate Token" })
    })
  })

  router.get('/token', validateJwtToken,(req: Request, res: Response) => {
    console.log(req)
    getTokens().then((data) => {
      return res.status(200).json({data, message: 'Token retrieved Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to retrieve Token" })
    })
  })


  router.delete('/token/:id',validateJwtToken, (req: Request, res: Response) => {

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

  router.post('/task/create', (req: Request, res: Response) => {
    const {body} = req
    createTask(body).then((data) => {
      return res.status(200).json({data, message: 'Task Created Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to create Task validty" })
    })
  })

  router.get('/task/create', (req: Request, res: Response) => {
    getTask().then((data) => {
      return res.status(200).json({data, message: 'Validity retrieved Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to retrieve validty" })
    })
  })

  router.post('/task/change-status', (req: Request, res: Response) => {
    const {body} =req
    changeStatus(body).then((data) => {
      return res.status(200).json({data, message: 'Validity retrieved Successfully'})
    }).catch(err => {
      res.status(500).json({ err, message: "Failed to retrieve validty" })
    })
  })

  
export default router;