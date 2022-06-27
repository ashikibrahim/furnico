var express = require("express");
var router = express.Router();
const adminHelper = require("../helpers/admin-helpers");
const admin = require("../models/admin");
var Storage = require("../middleware/multer");
const category = require("../models/category");
const product = require("../models/products");
const brand = require("../models/brands");

router.get("/", function (req, res, next) {
  res.render("admin/adminlogin", { layout: false });
});

router.post("/alogin", function (req, res, next) {
  console.log("hiiii");
  adminHelper.doadminlogin(req.body).then((response) => {
    if (response.admin) {
      req.session.adminlogin = true;
      req.session.admin = response.admin;
      res.redirect("/admin/adminhome");
    } else {
      res.redirect("/admin");
    }
  });
  res.redirect("/admin/adminhome");
});

router.get("/adminhome", function (req, res, next) {
  console.log("hellooooo");
  res.render("admin/adminhome", { layout: false });
});

router.get("/productmanagement", async function (req, res, next) {
  console.log("products!!!");

  // const alert = req.flash("msg");
  const product = await adminHelper.getallproducts();
  res.render("admin/productmanagement", { product, layout: false });
});

router.get("/addproduct", async function (req, res, next) {
  console.log("adddproducts!!!");
  const category = await adminHelper.getallcategory();
  const brandname = await adminHelper.getbrands();
  const subcategory = await adminHelper.getallsubcategory();
  console.log(brandname);
  res.render("admin/addproduct", {
    category,
    subcategory,
    brandname,
    admin: true,
    layout: false,
  });
});

router.post(
  "/addProduct",
  Storage.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  function (req, res) {
    let img1 = req.files.image1[0].filename;
    let img2 = req.files.image2[0].filename;
    let img3 = req.files.image3[0].filename;
    let img4 = req.files.image4[0].filename;
    console.log("ggggsdfydfyg");
    console.log(img1, img2, img3, img4);
    adminHelper
      .addProduct(req.body, img1, img2, img3, img4)
      .then((response) => {
        console.log(response);
        res.redirect("/admin/productmanagement");
      });
  }
);

router.get("/delete-product/:id", (req, res) => {
  console.log("delete111");
  const proId = req.params.id;
  console.log("delete111.55555");
  adminHelper.deleteproduct(proId).then((response) => {
    console.log("delete222");
    req.session.removedproduct = response;
    // const alert=req.flash('msg')
    // req.flash('msg', 'You Deleted successfully!')
    res.redirect("/admin/productmanagement");
  });
  console.log(proId);
});

  router.get("/edit-Product/:id", async (req, res) => {
    console.log("product details");
    let product = await adminHelper.getProductDetails(req.params.id);
    console.log(product);
    const category = await adminHelper.getallcategory();
    const brandName = await adminHelper.getbrands();
    const subcategory = await adminHelper.getallsubcategory();
    console.log("got all details");
    console.log(product.productName);
    res.render("admin/edit-Product", {
      subcategory,
      category,
      brandName,
      product,
      admin: true,
      layout: false,
    });
   
  });

router.post(
  "/edit-Product/:id",
  Storage.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  function (req, res) {
    const proId = req.params.id;
    const img1 = req.files.image1
      ? req.files.image1[0].filename
      : req.body.image1;
    const img2 = req.files.image2
      ? req.files.image2[0].filename
      : req.body.image2;
    const img3 = req.files.image3
      ? req.files.image3[0].filename
      : req.body.image3;
    const img4 = req.files.image4
      ? req.files.image4[0].filename
      : req.body.image4;
    console.log(img1, img2, img3, img4);
    adminHelper
      .updateProduct(req.body, proId, img1, img2, img3, img4)
      .then((response) => {
        console.log(response);
        
        res.redirect("/admin/productmanagement");
      });

  }
);

router.get("/addbrand", function (req, res, next) {
  console.log("adddproducts!!!");
  res.render("admin/addbrand", { layout: false, Err: req.session.loggE });
  req.session.loggE = null;
});

router.post("/addbrandname", function (req, res, next) {
  console.log(req.body);
  adminHelper
    .addBrand(req.body)
    .then((response) => {
      res.redirect("admin/addbrand", { layout: false });
    })
    .catch((err) => {
      req.session.loggE = err.msg;
      res.redirect("/admin/addbrand");
    });
});

router.get("/addcategory", (req, res) => {
  adminHelper.getallcategory().then((allcategory) => {
    // console.log(allcategory);
    res.render("admin/addcategory", { allcategory, layout: false });
  });
});
router.post("/addcategory", (req, res) => {
  adminHelper
    .addcategory(req.body)
    .then((response) => {
      res.redirect("/admin/addcategory");
    })
    .catch((error) => {
      req.session.loggE = error.msg;
      res.redirect("/admin/addcategory");
    });
});
router.post("/addsubcategory", (req, res) => {
  console.log(req.body);
  adminHelper
    .addsubcategory(req.body)
    .then((response) => {
      res.redirect("/admin/addcategory");
    })
    .catch((err) => {
      req.session.loge = err.msg;
      res.redirect("/admin/addcategory");
    });
});

router.get("/usermanagement", (req, res) => {
  adminHelper.getallusers().then((user) => {
    console.log(user);
    res.render("admin/usermanagement", { user, layout: false, admin: true });
  });
});
// block and unblock user

router.get("/Blockuser/:id", (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  console.log("sdjfhusguasuashguahshasdgs");
  adminHelper.blockuser(userId).then((response) => {
    console.log(response);
    res.json({ msg: "you blocked", status: true });
  });
});

router.get("unblockuser/:id", (req, res) => {
  const userId = req.params.id;
  adminHelper.unblockuser(userId).then((response) => {
    res.json({ msg: "you have unblocked", status: true });
  });
});

router.get("/ordermanagement", (req, res) => {
  adminHelper.allorders().then((response) => {
    const allorders = response;
    res.render("admin/ordermanagement", { allorders, layout: false });
  });
});
router.get("/viewOrderProducts/:id", (req, res) => {
  adminHelper.orderdetails(req.params.id).then((response) => {
    const order = response;
    res.render("admin/orderdetails", { order, admin: true });
  });
});

router.post("/changeOrderStatus", (req, res) => {
  console.log("change order staus -----------------------");
  console.log(req.body);
  adminHelper.changeOrderStatus(req.body).then((response) => {
    console.log(response);
    res.json({ modified: true });
  });
});

module.exports = router;
