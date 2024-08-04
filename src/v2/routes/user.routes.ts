import { IRouter, NextFunction, Request, Response, Router } from "express";
import {
  CreateUser,
  createUserHelper,
  friendsDetailsPage,
  getReferalCountFromPublishedDate,
  HomePageUserDetailsController,
  leadershipController,
  signupController,
  telegramMemberCheckController,
} from "../controller/user.controller";
import passport from "../../config/passport";
import { IAdmin } from "../models/admin.model";
import { CANCELLED } from "dns";

const router: IRouter = Router();

router.post("/init", (req: Request, res: Response) => {
  const data: CreateUser = req.body;

  createUserHelper(data)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(400).json({ message: "something went wrong" });
    });
});

router.get("/leadership-board/:userId", (req: Request, res: Response) => {
  leadershipController(req?.params?.userId)
    .then((topData) => {
      res.status(200).json({ users: topData });
    })
    .catch((err) => {
      console.error(err);
      res.status(501).json({ message: "Internal server error" });
    });
});

router.get("/age-and-coins/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  HomePageUserDetailsController(userId)
    .then((user) => {
      return res.status(200).json({ user, message: "Fetched successfully" });
    })
    .catch((err) => {
      console.log(err);

      res
        .status(500)
        .json({ err: "FAILED", message: "User details fetching failed" });
    });
});

router.get("/telegram/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  telegramMemberCheckController(parseInt(id))
    .then((data) => {
      return res.status(200).json({ data, message: "Fetched successfully" });
    })
    .catch((err) => {
      res.status(500).json({ err, message: "User details fetching failed" });
    });
});

router.get("/friends/:userId", (req: Request, res: Response) => {
  const userId: any = req?.params?.userId;

  friendsDetailsPage(userId)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(501).json({ message: "Something went wrong!" });
    });
});

router.post(
  "/admin/login",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: IAdmin, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        res.status(200).json({ message: "Logged in successfully" });
      });
    })(req, res, next);
  }
);

router.post("/admin/create", (req: Request, res: Response) => {
  const body: any = req?.body;

  signupController(body)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(501).json({ message: "Something went wrong!" });
    });
});

router.get("/admin/check", (req: Request, res: Response) => {
  try {
    if (req?.isAuthenticated()) {
      return res.status(200).json({ status: true, message: "Authenticated" });
    }
    res.status(401).json({ message: "User Not authenticated", status: false });
  } catch (err) {
    res.status(501).json({ message: "Something went wrong!" });
  }
});

router.get("/user/referal-count/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  getReferalCountFromPublishedDate(id)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(501).json({ message: "Something went wrong!" });
    });
});

export default router;
