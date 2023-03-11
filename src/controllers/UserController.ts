import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { UserService } from "../services/UserService";
import { UserEntity } from "../entities/UserEntity";

export class UserController {
  private readonly userService = new UserService();

  /**
   * 소셜 로그인
   */
  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const querySchema = Joi.object({
        code: Joi.string().required(),
      });

      const query = await querySchema.validateAsync(req.query);

      const result = await this.userService.signIn(query);

      res.status(200).json({ ...result });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * 팔로우 신청
   */
  public async createFollow(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserEntity = req.user;
      const querySchema = Joi.object({
        writerId: Joi.number().required(),
      });

      const query = await querySchema.validateAsync(req.query);

      await this.userService.createFollow(user.id, query.writerId);

      res.status(200).json({ message: "SUCCESS_FOLLOWING" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * 팔로우 삭제
   */
  public async deleteFollow(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserEntity = req.user;
      const querySchema = Joi.object({
        writerId: Joi.number().required(),
      });

      const query = await querySchema.validateAsync(req.query);

      await this.userService.deleteFollow(user.id, query.writerId);

      res.status(200).json({ message: "SUCCESS_DELETE" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
