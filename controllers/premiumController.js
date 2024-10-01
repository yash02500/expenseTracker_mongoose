const Razorpay = require('razorpay');
const Order = require('../models/orders');
const userController = require('./userController');
const dotenv = require('dotenv');
dotenv.config();

// making order of premium member
exports.buyPremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const amount = 2000;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }

            req.user.createOrder({orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err) {
        console.log(err);
        res.status(403).json({message: 'Something went wrong', error: err})
    }
}

// updateTransactionStatus
exports.updateTransactionStatus = async(req, res) => {
    try {
        const userId = req.user._id;
        const { payment_id, order_id} = req.body;
        // const order  = await Order.findOne({ orderid : order_id }) 
        const promise1 = Order.findOneAndUpdate(
            { orderid: order_id },
            { paymentid: payment_id, status: 'SUCCESSFUL' },
            { new: true } // Returns updated document
          );
          
        const promise2 =  User.findByIdAndUpdate(
            userId,
            { isPremiumuser: true },
            { new: true } // Returns updated document
          );          

        await Promise.all([promise1, promise2]);
        return res.status(202).json({success: true, message: "Transaction Successful", token: userController.generateToken(userId, true) });
               
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Sometghing went wrong with update' })
    }
};
