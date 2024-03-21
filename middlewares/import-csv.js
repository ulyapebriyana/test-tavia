import multer from "multer";
import csvToJson from 'convert-csv-to-json'
import fs from 'fs'
import Joi from "joi";

import { errorClientHandler, errorServerHandler } from "../helpers/response-handler.js";

const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/csv') {
            return cb(null, false);
        }
        cb(null, true);
    }
}).single("csvFile");

const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    mobilePhone: Joi.string().required(),
    phone: Joi.string().required(),
    placeOfBirth: Joi.string().required(),
    birthDate: Joi.string().required(),
    gender: Joi.string().required(),
    maritalStatus: Joi.string().required(),
    bloodType: Joi.string().required(),
    religion: Joi.string().required(),
    identityType: Joi.string().required(),
    identityNumber: Joi.string().required(),
    isPermanent: Joi.boolean().required(),
    identityExpireDate: Joi.string().required(),
    postalCode: Joi.string().required(),
    citizenIdAddress: Joi.string().required(),
    residentialAddress: Joi.string().required()
});

const importCsv = (req, res, next) => {
    try {
        upload(req, res, (err) => {
            if (err) {
                console.log(err);
            }
            if (!req.file) return errorClientHandler(res, 400, "something wrong with file and must be csv type")

            const fileInputName = req.file.path

            const jsonParsed = csvToJson.fieldDelimiter(',').getJsonFromCsv(fileInputName);

            fs.unlinkSync(fileInputName);

            let errorValidated = []

            const validatedData = jsonParsed.map(data => {
                const { error, value } = schema.validate(data);
                if (error) {
                    errorValidated.push(error.message)
                }
                return value;
            });

            if (errorValidated.length > 0) return errorClientHandler(res, 422, errorValidated)

            req.jsonData = validatedData;

            next()
        })
    } catch (error) {
        return errorServerHandler(res, error)
    }
}
export default importCsv