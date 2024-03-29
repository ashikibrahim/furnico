const Mongoose = require("mongoose");
const orderSchema = new Mongoose.Schema({
  user_Id: { type: Mongoose.Schema.Types.ObjectId, ref: "user" },
  paymentMethod: { type: String },
  product: [
    {
      pro_Id: { type: Mongoose.Schema.Types.ObjectId, ref: "product" },
      price: { type: Number },
      quantity: { type: Number, default: 1 },
      subtotal: { type: Number, default: 0 },
      status:{type:String,default:'Order placed'}
    },
  ],
  deliveryDetails:
    {
      name: String,
      number: String,
      email: String,
      house: String,
      localplace: String,
      town: String,
      district: String,
      state: String,
      pincode: Number,
    }
,
  Total:{type:Number},
  ShippingCharge:{type:Number},
  grandTotal: { type: Number, default: 0 },
  ordered_on: { type: Date },
  payment_status: { type: String },
});
const orderModel = Mongoose.model("order", orderSchema);
module.exports = orderModel;