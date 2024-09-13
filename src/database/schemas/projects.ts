import mongoose, { Schema, Document } from 'mongoose';

interface IProject extends Document {
    uniqueId: string;
    name: string;
    description?: string;
    users: mongoose.Types.ObjectId[];
    vps: mongoose.Types.ObjectId[];
}

const projectSchema: Schema = new Schema({
    uniqueId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    users: [{ type: String, ref: 'User' }],
    vps: [{ type: String, ref: 'VPS' }],
});

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;