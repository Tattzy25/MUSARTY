import { User } from "../db/neon";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
