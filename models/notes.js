const  mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema  = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    noteTitle:{
        type: String
    },
    noteDiscription:{
        type: String
    },
    tag:{
        type: String,
        default: 'General'
    },
    noteDate:{
        type: Date,
        default: Date.now
    }
})  

module.exports = mongoose.model('notes' , notesSchema);