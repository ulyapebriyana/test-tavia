import fs from 'fs';
import stream from "stream"
import { google } from "googleapis"

import auth from '../libs/googel-drive-auth.js';
import { Employee } from "../models/index.js"
import { errorServerHandler, errorClientHandler, successHandler } from "../helpers/response-handler.js"

const self = {}

self.createData = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            mobilePhone,
            phone,
            placeOfBirth,
            birthDate,
            gender,
            maritalStatus,
            bloodType,
            religion,
            identityType,
            identityNumber,
            isPermanent,
            identityExpireDate,
            postalCode,
            citizenIdAddress,
            residentialAddress
        } = req.body;

        const newEmployee = await Employee.create({
            firstName,
            lastName,
            email,
            mobilePhone,
            phone,
            placeOfBirth,
            birthDate,
            gender,
            maritalStatus,
            bloodType,
            religion,
            identityType,
            identityNumber,
            isPermanent,
            identityExpireDate,
            postalCode,
            citizenIdAddress,
            residentialAddress
        });

        return successHandler(res, 201, "employee created successfully", newEmployee)

    } catch (error) {
        return errorServerHandler(res, error)
    }
}

self.importData = async (req, res) => {
    try {
        const jsonData = req.jsonData

        const data = await Employee.bulkCreate(jsonData);

        return successHandler(res, 201, "successfully insert to database", data)

    } catch (error) {
        return errorServerHandler(res, error)
    }
}



self.exportData = async (req, res) => {
    try {
        const employees = await Employee.findAll();

        if (employees.length === 0) return errorClientHandler(res, 404, "No employee data found")

        const csvFields = [
            "firstName",
            "lastName",
            "email",
            "mobilePhone",
            "phone",
            "placeOfBirth",
            "birthDate",
            "gender",
            "maritalStatus",
            "bloodType",
            "religion",
            "identityType",
            "identityNumber",
            "isPermanent",
            "identityExpireDate",
            "postalCode",
            "citizenIdAddress",
            "residentialAddress"
        ];

        const csvData = employees.map(employee => csvFields.map(field => employee[field]).join(','));

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=employeesData.csv");

        return successHandler(res, 200, "successfully export to csv", {})

    } catch (error) {
        return errorServerHandler(res, error)
    }
}


self.uploadData = async (req, res) => {
    try {
        const files = req.files;
        const driveId = req.driveId

        files.forEach((file) => {
            const filePath = `uploads/${req.currentEmployee.id} - ${req.currentEmployee.fullName}/${file.filename}`;
            fs.rename(file.path, filePath, (err) => {
                if (err) {
                    return errorServerHandler(res, err)
                }
            });
        });

        files.map(async (file) => {
            const bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer);
            const { data } = await google.drive({ version: "v3", auth }).files.create({
                media: {
                    mimeType: file.mimeType,
                    body: bufferStream,
                },
                requestBody: {
                    name: file.originalname,
                    parents: [driveId],
                },
                fields: "id,name",
            });
        })

        return successHandler(res, 200, "File upload successful", {})
    } catch (error) {
        return errorServerHandler(res, error)
    }
}


export default self