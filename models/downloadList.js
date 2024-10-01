const mongoose = require('mongoose');

const downloadlistSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileUrl:{
        type: String
    }
});

module.exports = mongoose.model('DownloadList', downloadlistSchema);



