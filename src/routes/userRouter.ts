import express from "express";
import { UserController } from "../controllers/UserController";
import { verifyJwt } from "../middleware/jwt";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/auth", userController.signIn.bind(userController));
userRouter.post("/follow", verifyJwt, userController.createFollow.bind(userController));
userRouter.delete("/follow", verifyJwt, userController.deleteFollow.bind(userController));

export { userRouter };
