const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true  
    },
    paymentid:{
        type: String
    },
    orderid:{
        type: String
    },
    status:{
        type: String
    }
});

module.exports = mongoose.model('Order', orderSchema);


