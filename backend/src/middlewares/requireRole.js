import { HttpError } from "../utils/httpError.js";

export function requireRole(...allowedRoles) {
  return function checkRole(req, _res, next) {
    if (!req.currentUser) {
      return next(
        new HttpError(401, "Current user not identified", {
          code: "UNAUTHENTICATED",
        })
      );
    }

    if (!allowedRoles.includes(req.currentUser.role)) {
      return next(
        new HttpError(403, "You do not have permission to perform this action", {
          code: "FORBIDDEN",
          allowedRoles,
          currentRole: req.currentUser.role,
        })
      );
    }

    return next();
  };
}
