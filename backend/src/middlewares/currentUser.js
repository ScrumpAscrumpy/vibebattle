import { findUserById, findUserByRole } from "../services/userService.js";

export async function currentUser(req, _res, next) {
  try {
    const userId = req.headers["x-user-id"] || req.query.userId;
    const role = req.query.role;

    if (role) {
      req.currentUser = await findUserByRole(String(role).toUpperCase());
      return next();
    }

    if (userId) {
      req.currentUser = await findUserById(String(userId));
      return next();
    }

    req.currentUser = null;
    return next();
  } catch (error) {
    next(error);
  }
}
