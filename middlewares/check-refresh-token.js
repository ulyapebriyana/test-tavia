import jwt from "jsonwebtoken";

import { errorServerHandler, errorClientHandler, successHandler } from "../helpers/response-handler.js"
import { User } from "../models/index.js"

const CheckRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return errorClientHandler(res, 401, "token is required")
    const users = await User.findAll({ where: { refreshToken: refreshToken } })
    if(users.length < 1) return errorClientHandler(res, 404, "refresh token not found")
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) errorClientHandler(res, 401, "refresh token invalid")
      req.currentUser = decoded
      next();
    });
  } catch (error) {
    return errorServerHandler(res, error)
  }
}

export default CheckRefreshToken