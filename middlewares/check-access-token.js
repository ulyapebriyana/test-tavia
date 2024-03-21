import jwt from "jsonwebtoken";

import { errorServerHandler, errorClientHandler, successHandler } from "../helpers/response-handler.js"

const CheckAccessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) return errorClientHandler(res, 401, "token is required")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return errorClientHandler(res, 401, "token invalid")
      req.currentUser = decoded
      next();
    })
  } catch (error) {
    errorServerHandler(res, error)
  }
}

export default CheckAccessToken