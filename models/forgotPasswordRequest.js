const mongoose = require('mongoose');

const forgotPasswordRequestSchema = new mongoose.Schema({
   userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true  
    },
    uuid:{
        type: String
    },
});

module.exports = mongoose.model('ForgotPasswordRequest', forgotPasswordRequestSchema);

