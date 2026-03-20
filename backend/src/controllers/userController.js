import { getCurrentUserRecord } from "../services/userService.js";

export async function getCurrentUser(_req, res, next) {
  try {
    const user = await getCurrentUserRecord(_req);
    res.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}
