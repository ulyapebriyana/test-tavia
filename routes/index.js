import express from "express"

import user from "../controllers/user-controller.js"
import employee from "../controllers/employee-controller.js"
import CheckRefreshToken from "../middlewares/check-refresh-token.js"
import CheckAccessToken from "../middlewares/check-access-token.js"
import uploadMiddleware from "../middlewares/upload-file.js";
import importCsv from "../middlewares/import-csv.js";
import getEmployeeProfile from "../middlewares/getEmployeeProfile.js"
import createDriveFolder from "../middlewares/create-drive-folder.js"

const router = express.Router()

router.post("/sign-up", user.signUp)
router.post("/sign-in", user.signIn)
router.get('/refresh-token', CheckRefreshToken, user.refreshToken);
router.post("/resend-verify-email", user.resendVerifyEmail)
router.get("/verify-email/:token", user.verifyEmail)
router.post("/forgot-password", user.forgotPassword)
router.put("/reset-password/:token", user.resetPassword)
router.delete('/sign-out', CheckRefreshToken, user.signOut);

router.post("/employees", CheckAccessToken, employee.createData)
router.get("/employees/export", employee.exportData)
router.post("/employees/import", importCsv, employee.importData)
router.post("/employees/upload-data/:email", getEmployeeProfile, uploadMiddleware, createDriveFolder, employee.uploadData)

export default router
