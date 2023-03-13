import { UserEntity } from "../entities/UserEntity";

declare global {
  namespace Express {
    interface Request {
      user: UserEntity;
    }
  }
}
