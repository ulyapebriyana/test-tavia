import { google } from "googleapis"

import auth from "../libs/googel-drive-auth.js";


const createDriveFolder = async (req, res, next) => {
    const email = req.currentEmployee
    const service = google.drive({ version: 'v3', auth });
    const parentFolderId = '1wK12Pr7HUElsLJvY3Py2Osu8XwEJJcC6';
    const fileMetadata = {
        name: `${email.id} - ${email.fullName}`,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId],
    };

    try {
        const hisDrive = await email.getDrive()

        if (!hisDrive) {

            const file = await service.files.create({
                resource: fileMetadata,
                fields: 'id',
            });
            const folderId = file.data.id;
            //create permission
            await service.permissions.create({
                resource: {
                    type: "user",
                    role: "writer",
                    emailAddress: "ulyapebriyanaalisaputra@gmail.com",  // Please set your email address of Google account.
                },
                fileId: folderId,
                fields: "id",
                transferOwnership: false,
                moveToNewOwnersRoot: true,
            })

            //save drive id to database
            const saveDrive = await email.createDrive({
                driveId: folderId
            })

            req.driveId = saveDrive.driveId;
        } else {  
            req.driveId = hisDrive.driveId;
        }

        next()


    } catch (err) {
        // TODO(developer) - Handle error
        throw err;
    }
}

export default createDriveFolder