import path from "path"
import process from "process";
import { google } from "googleapis"

const KEYFILEPATH = path.join(process.cwd(), "config/gdrive-credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

export default auth