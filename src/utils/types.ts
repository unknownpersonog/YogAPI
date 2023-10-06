export type PartialInfo = {
    email: String,
    discordId: String,
    verified: String,
    vps: [
        {
            id: String,
        }
    ],
}

export interface Settings {
    companyName: String,

    smtp: {
        host: String,
        port: Number,
        user: String,
        pass: String,
        mail: String
    }
}
