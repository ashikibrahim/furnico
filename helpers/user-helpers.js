const userData = require("../models/user");
const bcrypt = require("bcrypt");
var nodeMailer = require("nodemailer");
const adminData = require("../models/admin");
const product = require("../models/products");
const cartModel = require("../models/cart");
const orderModel = require("../models/order");
const wishlistModel = require("../models/wishlist");
const categoryModel = require("../models/category");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");
var instance = new Razorpay({
  key_id: "rzp_test_lF7aY9wN07rlA0",
  key_secret: "TkHwqPjwpAC8GiEowVlZMEWI",
});

module.exports = {
  doSignup: (userDataa) => {
    return new Promise(async (resolve, reject) => {
      console.log("enter here!!");
      const user = await userData.findOne({ email: userDataa.email });
      if (user) {
        console.log("entry2222");
        reject({ status: false, msg: "email already taken" });
      } else {
        console.log("reached else");
        userDataa.password = await bcrypt.hash(userDataa.password, 10);

        const otpGenerator = await Math.floor(1000 + Math.random() * 9000);
        console.log("above new user");
        const newUser = await {
          name: userDataa.name,
          phone: userDataa.phone,
          email: userDataa.email,
          password: userDataa.password,
          otp: otpGenerator,

          // address: userData.address,
          // landmark: userData.landmark,
          // city: userData.city,
          // state: userData.state,
          // country: userData.country,
          // pincode: userData.pincode,
        };

        // console.log(newUser);
        if (newUser) {
          console.log("hiiii");
          try {
            const mailTransporter = nodeMailer.createTransport({
              host: "smtp.gmail.com",
              service: "gmail",
              port: 465,
              secure: true,
              auth: {
                user: "furnico.shop@gmail.com",
                pass: "sniusbhqxpjrdfgh",
              },
              tls: {
                rejectUnauthorized: false,
              },
            });

            const mailDetails = {
              from: "furnico.shop@gmail.com",
              to: userDataa.email,
              subject: "just testing nodemailer",
              text: "just random texts ",
              html: "<p>hi " + userDataa.name + "your otp " + otpGenerator + "",
            };
            mailTransporter.sendMail(mailDetails, (err, Info) => {
              if (err) {
                console.log(err);
              } else {
                console.log("email has been sent ", Info.response);
              }
            });
          } catch (error) {
            console.log(error.message + "error here ");
          }
        }
        resolve(newUser);
        // }
        // await newUser.save().then((data) => {
        //     resolve(data)
        // })
      }
    });
  },
  dologin: (userDat) => {
    // console.log(userData);
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let user = await userData.findOne({ email: userDat.email });
      // let admin=await adminData.findOne({email:userDat.email})
      // console.log(userData);
      // console.log(user.email);

      if (user) {
        console.log("hello wlcome");
        // console.log(userDat.password);
        // console.log(user.password);
        bcrypt.compare(userDat.password, user.password).then((status) => {
          if (status) {
            console.log("Login Success");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("Login Failed");
            resolve({ status: false });
          }
        });
      }
      //      else if(admin){
      //     console.log("fsuiey admin");
      //     // console.log(userDat.password);
      //     // console.log(user.password);
      //     bcrypt.compare(userDat.password,admin.password).then((status)=>{
      //         if(status){
      //             console.log('Login Success');
      //             response.admin=admin
      //             response.status=true
      //             resolve(response)
      //         }
      //         else{
      //             console.log('Login Failed');
      //             resolve({status:false})
      //         }
      //     })
      // }
      else {
        console.log("Login Failed Again");
        // resolve({status:false})
        reject({ status: false, msg: "email not registered,please signup!" });
      }
    });
  },
  doresetPasswordOtp: (resetData) => {
    return new Promise(async (resolve, reject) => {
      const user = await userData.findOne({ email: resetData.email });

      console.log(user);
      if (user) {
        // resetData.password = await bcrypt.hash(resetData.password, 10);

        const otpGenerator = await Math.floor(1000 + Math.random() * 9000);
        const newUser = await {
          email: resetData.email,
          otp: otpGenerator,
          _id: user._id,
        };
        console.log(newUser);

        try {
          console.log("wats the issue?");
          const mailTransporter = nodeMailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
              user: "furnico.shop@gmail.com",
              pass: "sniusbhqxpjrdfgh",
            },

            tls: {
              rejectUnauthorized: false,
            },
          });

          const mailDetails = {
            from: "ashiknodetest@gmail.com",
            to: resetData.email,
            subject: "just testing nodemailer",
            text: "just random texts ",
            html:
              "<p>hi " +
              "User " +
              "your link is: " +
              "http://localhost:3000/resetpassword" +
              ".",
          };
          mailTransporter.sendMail(mailDetails, (err, Info) => {
            if (err) {
              console.log(err);
            } else {
              console.log("email has been sent ", Info.response);
            }
          });
        } catch (error) {
          console.log(error.message);
        }

        resolve(newUser);
      } else {
        reject({ status: false, msg: "Email not registered, please sign up!" });
      }
    });
  },

  // <<<<<<<<<<<<<to view your products added by admin user page>>>>>>>>>>>>>>>>>>>5

  getallproducts: () => {
    return new Promise(async (resolve, reject) => {
      const allproducts = await product.find({}).lean();
      resolve(allproducts);
    });
  },
  getproductdetalis: (proId) => {
    return new Promise(async (resolve, reject) => {
      const products = await product
        .findOne({ _id: proId })
        .lean()
        .then((products) => {
          resolve(products);
        });
    });
  },

  doresetPass: (rData, rid) => {
    console.log(rData);
    return new Promise(async (resolve, reject) => {
      let response = {};
      rData.password = await bcrypt.hash(rData.password, 10);
      // console.log(rData.password+'fi');
      // console.log(userData.email+"aa");

      let userId = rid;
      console.log(userId + "12");
      let resetuser = await userData.findByIdAndUpdate(
        { _id: userId },
        { $set: { password: rData.password } }
      );

      // let user = await userData.findOne({ email: rData.email });
      // // let admin= await adminData.findOne({email:userDataaa.email})
      // // console.log(userData);
      // // console.log(user.email);
      resolve(resetuser);
    });
  },
  addToCart: (proId, userId) => {
    console.log(proId);
    console.log(userId);
    return new Promise(async (resolve, reject) => {
      console.log("product id");
      const alreadyCart = await cartModel.findOne({ user_Id: userId });
      const productss = await product.findById({ _id: proId });
      console.log(productss);
      if (alreadyCart) {
        console.log("already cart");
        let proExist = alreadyCart.products.findIndex(
          (products) => products.pro_Id == proId
        );

        if (proExist != -1) {
          console.log("proexist??");
          cartModel
            .updateOne(
              { "products.pro_Id": proId, user_Id: userId },
              {
                $inc: { "products.$.quantity": 1 },
              }
            )
            .then((response) => {
              resolve({ msg: "already in cart" });
            });
        } else {
          await cartModel
            .findOneAndUpdate(
              { user_Id: userId },
              { $push: { products: { pro_Id: proId, price: productss.price } } }
            )
            .then(async (res) => {
              resolve({ msg: "added", count: res.products.length + 1 });
            });
        }
      } else {
        console.log(userId);
        const newcart = new cartModel({
          user_Id: userId,
          products: { pro_Id: proId, price: productss.price },
        });
        await newcart.save((err, result) => {
          if (err) {
            resolve({ err: "cart not created" });
          } else {
            resolve({ msg: "cart created", count: 1 });
          }
        });
      }
    });
  },
  getcartItems: (userId) =>
    new Promise(async (resolve, reject) => {
      const cart = await cartModel
        .findOne({ user_Id: userId })
        .populate("products.pro_Id")
        .lean();

      resolve(cart);
    }),
  changeProductQuantity: (data, user) => {
    console.log(data);
    cart = data.cartid;
    pro_id = data.product;
    count = data.count;
    quantity = data.quantity;
    const procount = parseInt(count);
    console.log("checck for remove pdct");
    return new Promise(async (resolve, response) => {
      console.log("checck for remove pdct promise ");
      if (count == -1 && quantity == 1) {
        console.log("checck for remove pdct if");
        await cartModel
          .findOneAndUpdate(
            { user_Id: user._id },
            {
              $pull: { products: { _id: cart } },
            }
          )
          .then((response) => {
            resolve({ removeProduct: true });
          });
      } else {
        console.log("reached else in count and qty");
        console.log(user._id);
        console.log(data.product);
        await cartModel
          .findOneAndUpdate(
            { user: user._id, "products.pro_Id": data.product },
            { $inc: { "products.$.quantity": procount } }
          )
          .then((response) => {
            resolve(true);
          });
      }
    });
  },
  getCartCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      const user = await cartModel.findOne({ user_Id: userId });

      if (user) {
        count = user.products.length;
        console.log(count);
        resolve(count);
      } else {
        console.log("cartcount else");
        let count = 0;
        resolve(count);
      }
    });
  },
  subtotal: (user) => {
    let id = mongoose.Types.ObjectId(user);
    return new Promise(async (resolve, reject) => {
      const amount = await cartModel.aggregate([
        {
          $match: { user_Id: id },
        },
        {
          $unwind: "$products",
        },
        {
          $project: {
            id: "$products.pro_Id",
            total: { $multiply: ["$products.price", "$products.quantity"] },
          },
        },
      ]);
      let cartdata = await cartModel.findOne({ user_Id: id });
      if (cartdata) {
        amount.forEach(async (amt) => {
          await cartModel.updateMany(
            { "products.pro_Id": amt.id },
            { $set: { "products.$.subtotal": amt.total } }
          );
        });
        resolve();
      }
    });
  },
  totalamount: (userData) => {
    // console.log(userData);
    const id = mongoose.Types.ObjectId(userData);
    // console.log('----------------------------------------');
    return new Promise(async (resolve, reject) => {
      const total = await cartModel.aggregate([
        {
          $match: { user_Id: id },
        },
        {
          $unwind: "$products",
        },
        {
          $project: {
            quantity: "$products.quantity",
            price: "$products.price",
          },
        },
        {
          $project: {
            productname: 1,
            quantity: 1,
            price: 1,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ["$quantity", "$price"] } },
          },
        },
      ]);
      // console.log(total[0].total);
      // totalpaid=total[0].total;
      console.log("total amount");
      if (total.length == 0) {
        resolve({ status: true });
      } else {
        let grandTotal = total.pop();

        // await cartModel.findOneAndUpdate(
        //   { user:id},
        // {$set:{total:grandTotal.total}})
        resolve({ grandTotal, status: true });
      }
    });
  },
  deliveryCharge: (amount) => {
    return new Promise((resolve, reject) => {
      if (amount < 2000) {
        resolve(40);
      } else {
        resolve(0);
      }
    });
  },
  grandTotal: (netTotal, deliveryCharge) => {
    return new Promise((resolve, reject) => {
      const grandTotal = netTotal + deliveryCharge;
      resolve(grandTotal);
    });
  },
  removeFromcart: (data, user) => {
    return new Promise(async (resolve, reject) => {
      await cartModel
        .findOneAndUpdate(
          { user_Id: user._id },
          {
            $pull: { products: { _id: data.cart } },
          }
        )
        .then((response) => {
          resolve({ removeProduct: true });
        });
    });
  },
  placeOrder: (order, products, total, deliveryCharge, netTotal, user) => {
    return new Promise(async (resolve, reject) => {
      console.log(order, products, total);
      const status = order.paymentMethod === "cod" ? "placed" : "pending";
      //  const status=order.paymentMethod==='cod'?'placed':'pending'

      // inserting valuesfrom body to order collection
      const orderObj = await orderModel({
        user_Id: user._id,
        Total: netTotal,
        ShippingCharge: deliveryCharge,
        grandTotal: total,
        payment_status: status,
        paymentMethod: order.paymentMethod,
        ordered_on: new Date(),
        product: products.products,
        deliveryDetails: {
          name: order.fname,
          number: order.number,
          email: order.email,
          house: order.house,
          localplace: order.localplace,
          town: order.town,
          district: order.district,
          state: order.state,
          pincode: order.pincode,
        },
      });
      await orderObj.save(async (err, res) => {
        await cartModel.remove({ user: order.userId });
        resolve(orderObj);
      });
    });
  },
  getAddresses: (user) => {
    return new Promise(async (resolve, response) => {
      const Addresses = await userData.findOne({ _id: user }).lean();
      // console.log(Addresses.address);
      resolve(Addresses);
    });
  },
  getorderProducts: (orderid) => {
    console.log(orderid);
    return new Promise(async (resolve, reject) => {
      const orderdetails = await orderModel
        .findOne({ _id: orderid })
        .populate("product.pro_Id")
        .lean();
      // console.log(orderdetails);
      resolve(orderdetails);
    });
  },
  generateRazorPay: (orderId, totalamount) => {
    return new Promise((resolve, reject) => {
      var options = {
        amount: totalamount * 100,
        currency: "INR",
        receipt: "" + orderId,
      };

      instance.orders.create(options, function (err, order) {
        console.log("New order:", order);
        resolve(order);
      });
    });
  },
  verifyPayment: (details) => {
    return new Promise((resolve, reject) => {
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", "TkHwqPjwpAC8GiEowVlZMEWI");

      hmac.update(
        details["payment[razorpay_order_id]"] +
          "|" +
          details["payment[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");
      if (hmac == details["payment[razorpay_signature]"]) {
        console.log("000000000000");
        resolve();
      } else {
        console.log("5555555555555555");
        reject();
      }
    });
  },
  changePayementStatus: (orderid) => {
    return new Promise(async (resolve, reject) => {
      const changestatus = await orderModel
        .findOneAndUpdate(
          { _id: orderid },
          {
            $set: { payment_status: "placed" },
          }
        )
        .then((changestatus) => {
          resolve(changestatus);
        });
    });
  },
  getallorders: (user) => {
    return new Promise(async (resolve, reject) => {
      const allorders = await orderModel
        .find({ user_Id: user })
        .populate("product.pro_Id")
        .lean();
      resolve(allorders);
    });
  },

  addToWishlist: (proId, userId) => {
    return new Promise(async (resolve, reject) => {
      const userdt = await wishlistModel.findOne({ user_Id: userId });
      if (userdt) {
        let proExist = userdt.products.findIndex(
          (products) => products.pro_Id == proId
        );
        if (proExist != -1) {
          resolve({ err: "product already in wishlist" });
        } else {
          await wishlistModel
            .findOneAndUpdate(
              { user_Id: userId },
              { $push: { products: { pro_Id: proId } } }
            )
            .then(async (res) => {
              resolve({ msg: "added" });
            });
        }
      } else {
        const newwishlist = new wishlistModel({
          user_Id: userId,
          products: { pro_Id: proId },
        });
        await newwishlist.save((err, result) => {
          if (err) {
            resolve({ err: "not added to wishlist" });
          } else {
            resolve({ msg: "wislist created" });
          }
        });
      }
    });
  },
  getwishlist: (userId) => {
    return new Promise(async (resolve, reject) => {
      let wishlist = await wishlistModel
        .findOne({ user_Id: userId })
        .populate("products.pro_Id")
        .lean();
      resolve(wishlist);
    });
  },
  deletewishlist: (proId, userId) => {
    console.log(userId);
    console.log(proId);
    return new Promise(async (resolve, response) => {
      const remove = await wishlistModel.findOneAndUpdate(
        { user_Id: userId },
        { $pull: { products: { _id: proId.product } } } //product passedd inside data from hbs page aja
      );
      console.log(remove);
      resolve({ msg: "confirm delete" });
    });
  },
  getwishCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      const user = await wishlistModel.findOne({ user_Id: userId });
      if (user) {
        count = user.products.length;
        console.log(count);
        resolve(count);
      } else {
        console.log("wishcount else");
        let count = 0;
        resolve(count);
      }
    });
  },
  checkwishlist: (proId, userId) => {
    return new Promise(async (resolve, reject) => {
      let wishlist = await wishlistModel
        .findOne({ user_Id: userId })
        .elemMatch("products", { pro_Id: proId });
      resolve(wishlist);
    });
  },

  // addAddress: (userId,data) => {
  //   return new Promise(async (resolve, reject) => {
  //     const user = userData.findOne({ _id: userId });
  //     await userData.findOneAndUpdate(
  //       { _id: userId },
  //       {
  //         $push: {
  //           address: {
  //             fname: data.fname,
  //             lname: data.lname,
  //             house: data.house,
  //             city: data.city,
  //             district: data.district,
  //             state: data.state,
  //             pincode: data.pincode,
  //             email: data.email,
  //             mobile: data.mobile,
  //           },
  //         },
  //       }
  //     );
  //     resolve();
  //   });
  // },
  // getAddresses: (user) => {
  //   return new Promise(async (resolve, response) => {
  //     const Addresses = await userData.findOne({ _id: user }).lean();
  //     // console.log(Addresses.address);
  //     resolve(Addresses);
  //   });
  // },

  addProfile: (Data) => {
    return new Promise(async (resolve, reject) => {
      await userData.findOneAndUpdate(
        { email:Data.email },
        {
          $push: {
            address: {
              fname: Data.fname,
              lname: Data.lname,
              house:Data.house,
              city: Data.city,
              district:Data.district,
              state: Data.state,
              pincode:Data.pincode,
              email: Data.email,
              mobile: Data.mobile,
            },
          },
        }
      );
      console.log("profile Updated Saved");
      resolve();
    });
  },
  getUserDetail: (user) => {
    return new Promise(async (resolve, reject) => {
      const userDetail =await userData.findOne({email:user.email }).lean();
      resolve(userDetail);
    });
  },
  getAllCategory: () => {
    return new Promise(async (resolve, response) => {
      const allcategory = await categoryModel.find({}).lean();
      resolve(allcategory);
    });
  },

  deleteAddress:(addressId,user)=>{
    return new Promise(async(resolve,reject)=>{
      const address=await userData.updateOne({_id:user._id},{$pull:{ address: { _id: addressId } }})
      resolve()
    })
  }
};
