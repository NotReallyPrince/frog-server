import { IRouter, Router } from "express";
import { CreateUser } from "../../helper/user.helper";

const router: IRouter = Router();

router.post('/init', (req: Request, res: Response) => {
    const data:CreateUser = req.body;
    
})