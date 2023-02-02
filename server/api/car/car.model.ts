import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

mongoose.set('strictQuery', false) //явное указание значения по умолчанию, что бы не было предупреждения в консол

const CarSchema = new Schema({
    brand: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        trim: true,
        min:1930,
        max:2050
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
});

export default mongoose.model("info", CarSchema);