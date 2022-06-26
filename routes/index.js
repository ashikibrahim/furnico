var express = require("express");
var router = express.Router();
const userHelper = require("../helpers/user-helpers");
const user = require("../models/user");
const product = require("../models/products");
const cartModel = require("../models/cart");
const Razorpay = require("razorpay");
const orderModel = require("../models/order");

// middleware to check wether user loggedin.
const verifyLogin = (req, res, next) => {
  if (req.session.logedin) {
    next();
  } else {
    res.redirect("/login");
  }
};

/* GET home page. */

router.get("/", async function (req, res, next) {
  let user = req.session.user;
  const product = await userHelper.getallproducts();
  let cartCount = null;
  let wishcount = null;
  let category = await userHelper.getAllCategory();

  if (req.session.user) {
    cartCount = await userHelper.getCartCount(req.session.user._id);
    wishcount = await userHelper.getwishCount(req.session.user._id);
    console.log(cartCount);
  }
  // res.render('admin/productmanagement',{product,layout:false});
  res.render("index", { user, product, cartCount, wishcount, category });
});

router.get("/login", function (req, res, next) {
  res.header(
    "Cache-control",
    "no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0"
  );
  if (req.session.logedin) {
    res.redirect("/");
  } else {
    res.render("login", {
      loggErr: req.session.logedinError,
      signuperror: req.session.loggErr2,
      signupsuccess: req.session.successmsg,
      layout: false,
    });
    req.session.loggErr2 = null;
    req.session.logedinError = null;
    req.session.successmsg = null;
  }
});

router.post("/login", (req, res) => {
  console.log(req.body);
  userHelper
    .dologin(req.body)
    .then((response) => {
      if (response.user) {
        req.session.logedin = true;
        req.session.user = response.user;
        res.redirect("/");
      }
      // else if(response.admin){
      //   req.session.logedinadmin=true;
      //   req.session.user=response.admin
      //   res.redirect('')
      // }
      else {
        req.session.logedinErr = true;
        res.redirect("/login");
      }
    })
    .catch((err) => {
      req.session.logedinError = err.msg;
      res.redirect("/login");
    });
});

router.get("/signup", function (req, res, next) {
  res.render("signup", { layout: false });
});

router.post("/signup", function (req, res, next) {
  userHelper
    .doSignup(req.body)
    .then((response) => {
      console.log(response);
      req.session.otp = response.otp;
      req.session.userdetails = response;
      res.redirect("/otp");
    })
    .catch((err) => {
      req.session.loggErr2 = err.msg;
      console.log(err);
      res.redirect("/login");
    });
});

router.get("/otp", function (req, res, next) {
  res.render("otp", { layout: false });
});

router.post("/otp", async (req, res) => {
  console.log("dfsd");
  console.log(req.session.otp + "sessiom");
  console.log(req.body.otpsignup);
  if (req.session.otp == req.body.otpsignup) {
    let userData = req.session.userdetails;
    const adduser = await new user({
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      password: userData.password,
    });
    await adduser.save();
    req.session.successmsg = "you have succesfully signed in,please login";

    res.redirect("/login"); /*give msg for successfully signed in*/
  } else {
    res.redirect("/login");
  }
  // res.redirect('/')
});
router.get("/logout", function (req, res, next) {
  res.redirect("/login");
  req.session.destroy();
});

router.get("/forgotpassword", function (req, res, next) {
  res.render("forgotpassword", { layout: false });
});

router.post("/forget", async (req, res) => {
  userHelper
    .doresetPasswordOtp(req.body)
    .then((response) => {
      console.log(response);
      req.session.otp = response.otp;
      req.session.userdetails = response;
      req.session.userRID = response._id;
      // console.log(req.session.userRID+'hhhhh');
      res.redirect("/forgotpassword");
    })
    .catch((err) => {
      req.session.loggErr2 = err.msg;
      res.redirect("/login");
    });
});
router.get("/resetpassword", function (req, res, next) {
  res.render("resetpassword", { layout: false, otpErr: req.session.otpError });
});

router.post("/resetpass", async (req, res) => {
  console.log(req.body);
  if (req.body.password == req.body.confirmPassword) {
    userHelper.doresetPass(req.body, req.session.userRID).then((response) => {
      console.log(response);
      res.redirect("/Login");
      console.log("Password updated");
    });
  } else {
    console.log("password mismatch");
  }
});

router.get("/cart", verifyLogin, async (req, res) => {
  const user = req.session.user;
  let CartCount = await userHelper.getCartCount(req.session.user._id);
  console.log("cart get");
  if (CartCount > 0) {
    console.log("inside fncn cart count");

    const subtotal = await userHelper.subtotal(req.session.user._id);
    const totalamount = await userHelper.totalamount(req.session.user._id);
    const netTotal = totalamount.grandTotal.total;
    const deliveryCharge = await userHelper.deliveryCharge(netTotal);
    const cartItems = await userHelper.getcartItems(req.session.user._id);
    const grandTotal = await userHelper.grandTotal(netTotal, deliveryCharge);
    console.log("cart get22");

    console.log(cartItems);
    res.render("cart", {
      user,
      cartItems,
      subtotal,
      CartCount,
      netTotal,
      deliveryCharge,
      grandTotal,
      layout: false,
    });
  } else {
    console.log("else cart=0");
    let cartItem = await userHelper.getcartItems(req.session.user._id);
    let cartItems = cartItem ? product : [];
    // cartItem=0
    netTotal = 0;
    CartCount = 0;
    deliveryCharge = 0;
    grandTotal = 0;
    res.render("cart", {
      layout: false,
      user,
      cartItems,
      netTotal,
      CartCount,
      deliveryCharge,
      grandTotal,
    });
  }
});

router.get("/add-tocart/:id", verifyLogin, (req, res) => {
  userHelper
    .addToCart(req.params.id, req.session.user._id)
    .then((response) => {
      console.log("getting cart");
      res.json(response);
      console.log("jsonn");
      // res.redirect('/')
    })
    .catch((err) => {
      console.log(err.msg);
      res.redirect("/");
    });
});

router.post("/change-product-quantity", (req, res) => {
  console.log(req.body);
  userHelper.changeProductQuantity(req.body, req.session.user).then();
  res.json({ status: true });
});

router.post("/remove-Product-forcart", (req, res, next) => {
  console.log("shfshfjkdshfshfsh");
  userHelper.removeFromcart(req.body, req.session.user).then(() => {
    res.json({ status: true });
  });
});
// wishlist router

router.get("/checkout", verifyLogin, async (req, res) => {
  const cartItems = await userHelper.getcartItems(req.session.user._id);
  const subtotal = await userHelper.subtotal(req.session.user._id);
  const Addresses = await userHelper.getAddresses(req.session.user._id);
  const totalamount = await userHelper.totalamount(req.session.user._id);
  const netTotal = totalamount.grandTotal.total;
  const deliveryCharge = await userHelper.deliveryCharge(netTotal);
  const grandTotal = await userHelper.grandTotal(netTotal, deliveryCharge);

  console.log(Addresses);
  res.render("checkout", {
    grandTotal,
    subtotal,
    cartItems,
    deliveryCharge,
    netTotal,
    Addresses,
    user: req.session.user,
    layout: false,
  });
});

router.post("/place-order", async (req, res) => {
  console.log(req.body);
  const cartItem = await userHelper.getcartItems(req.session.user._id);
  const totalamount = await userHelper.totalamount(req.session.user._id);
  const netTotal = totalamount.grandTotal.total;
  const deliveryCharge = await userHelper.deliveryCharge(netTotal);
  const grandTotal = await userHelper.grandTotal(netTotal, deliveryCharge);
  userHelper
    .placeOrder(
      req.body,
      cartItem,
      grandTotal,
      deliveryCharge,
      netTotal,
      req.session.user
    )
    .then((response) => {
      console.log(response + "response place ordw");
      req.session.orderId = response._id;
      if (req.body["paymentMethod"] == "cod") {
        console.log("++");
        res.json({ codSuccess: true });
      } else {
        userHelper
          .generateRazorPay(response._id, grandTotal)
          .then((response) => {
            res.json(response);
          });
      }
    });
});

router.get("/viewOrderDetails", async (req, res) => {
  const user = req.session.user;
  console.log(user);
  console.log(req.session.orderId + "order id 111111111");
  userHelper.getorderProducts(req.session.orderId).then((response) => {
    const orderProducts = response;
    console.log(orderProducts + "order products 2222222");
    res.render("order-success", { orderProducts, user, layout: false });
  });
});

router.post("/verify-Payment", (req, res) => {
  console.log("verify payment post1111");
  console.log(req.body);

  userHelper
    .verifyPayment(req.body)
    .then(() => {
      userHelper.changePayementStatus(req.body["order[receipt]"]).then(() => {
        console.log("payment successful");
        res.json({ status: true });
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: "paymentfailed" });
    });
});
router.get("/allorders", verifyLogin, (req, res) => {
  userHelper.getallorders(req.session.user._id).then((response) => {
    const orders = response;
    console.log(orders);
    console.log("all orders ");
    res.render("viewallorders", { orders, layout: false });
  });
});

router.get("/orderdetails/:id", verifyLogin, (req, res) => {
  console.log(req.params.id + "orderdetailsget");
  userHelper.getorderProducts(req.params.id).then((response) => {
    let orderProducts = response;
    console.log(orderProducts);
    res.render("vieworderdetails", { orderProducts, layout: false });
  });
});

router.get("/addtowishlist/:id", verifyLogin, (req, res) => {
  userHelper
    .addToWishlist(req.params.id, req.session.user._id)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.redirect("/");
    });
});

router.get("/wishlist", async (req, res) => {
  const user = req.session.user;
  const wishcount = await userHelper.getwishCount(req.session.user._id);
  let wishlist = await userHelper.getwishlist(req.session.user);
  if (wishlist) res.render("wishlist", { wishlist, wishcount, layout: false });
});

router.post("/deletewishlist", async (req, res) => {
  console.log(req.session.user._id);
  console.log(req.body);
  userHelper.deletewishlist(req.body, req.session.user._id).then((response) => {
    res.json({ status: true });
  });
});

router.get("/product-details/:id", async (req, res) => {
  let product = await userHelper.getproductdetalis(req.params.id);
  const user = req.session.user;
  if (user) {
    let wishlist = await userHelper.checkwishlist(req.params.id, user);
    res.render("product-details", { wishlist, product, layout: false });
  }
  console.log(product);
  res.render("product-details", { product, layout: false });
});

router.get("/profile", verifyLogin, async (req, res) => {
  const user = req.session.user;
  res.render("profile", { user });
});

router.get("/addAddress", (req, res) => {
  let user = req.session.user;
  res.render("addAddress", { user });
});

router.post("/addAddress", (req, res) => {
  console.log(req.body);
  userHelper.addAddress(req.session.user._id, req.body).then((response) => {
    res.redirect("/address-page");
  });
});
router.get("/address-page", async (req, res) => {
  // console.log("hsu-------------------------------------------");
  const Addresses = await userHelper.getAddresses(req.session.user);
  console.log(Addresses);
  let user = req.session.user;
  res.render("profile", { user, Addresses });
});

module.exports = router;
