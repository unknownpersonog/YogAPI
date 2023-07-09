import mongoose from 'mongoose';

export async function connectDb() {
    await mongoose
        .connect(`${process.env.MONGODB_DATABASE_URI}`)
        .then(() => console.log('Connected to Databased.'))
        .catch((err) => console.log('Error occured while connecting: ' + err))
}
