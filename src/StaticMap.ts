import mongoose from 'mongoose';

export interface IStaticMaps {
    name: string;
    value: string;
    type: 'string'|'json'|'array',
    comments?: string;
    comments_time?: Date;
    modified?: Date;
    modified_by?: string;
}

const schema = new mongoose.Schema<IStaticMaps>({
    name: { type: String, required: true },
    value: { type: String, default: '' },
    type: { type: String, required: true, enum: ['string', 'json', 'array'] },

    comments: { type: String, required: false },
    comments_time: { type: Date, required: false },

    modified: { type: Date, required: false },
    modified_by: { type: String, required: false },
});

export default mongoose.model('StaticMaps', schema);
