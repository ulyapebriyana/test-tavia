import Employee from "../models/employee.js"

import { errorClientHandler } from "../helpers/response-handler.js"

const getEmployeeProfile = async (req, res, next) => {
    try {
        const email = await req.params.email
        const existedEmail = await Employee.findOne({ where: {email: email} })
        if (!existedEmail) return errorClientHandler(res, 404, "user not found")
        req.currentEmployee = existedEmail
        next()
    } catch (error) {
        console.log(`hello error: ${error}`);
    }
}

export default getEmployeeProfile