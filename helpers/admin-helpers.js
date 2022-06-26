const userData = require("../models/user");
const brand = require("../models/brands");
const category = require("../models/category");
const Subcategory = require("../models/subcategory");
const admin = require("../models/admin");
const product = require("../models/products");
var objectId = require("mongoose").objectID;
const orderModel = require("../models/order");

module.exports = {
  doadminlogin: (adminDataa) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      const admin = await admin.findOne({ email: adminDataa.email });

      if (admin) {
        console.log("admin Email true");
        console.log(adminDataa.password);
        console.log(admin.password + "fja");
        bcrypt.compare(adminDataa.password, admin.password).then((status) => {
          if (status) {
            console.log("admin login true");
            response.admin = admin;
            response.status = true;

            resolve(response);
          } else {
            console.log("login error");
            resolve({ status: false });
          }
        });
      } else {
        console.log("Login Failed");
        resolve({ status: false });
      }
    });
  },

  //--------------------------------------------------------//
  getallusers: () => {
    return new Promise(async (resolve, reject) => {
      let users = await userData.find().lean();

      resolve(users);
    });
  },

  // --------------------------------------------------------------//
  addBrand: (data) => {
    return new Promise(async (resolve, reject) => {
      const brandNames = data.brand;
      console.log(brandNames, "sfasfasfasfas");
      const brandOld = await brand.findOne({ BrandName: brandNames });
      if (brandOld) {
        reject({ status: false, msg: "Brand already added!" });
      } else {
        const addBrand = await new brand({
          BrandName: brandNames,
        });
        await addBrand.save(async (err, result) => {
          if (err) {
            reject({ msg: "Brand not added" });
          } else {
            resolve({ result, msg: "Brand added" });
          }
        });
      }
    });
  },

  // aaaaaa//
  getbrands: () => {
    return new Promise(async (resolve, reject) => {
      const brandsdata = await brand.find({}).lean();
      resolve(brandsdata);
    });
  },
  // -----------------------------------------------//

  addcategory: (data) => {
    return new Promise(async (resolve, reject) => {
      const categoryname = data.category;
      const categorydata = await category.findOne({ category: categoryname });
      if (categorydata) {
        reject({ status: false, meg: "category already taiken" });
      } else {
        const addcategory = await new category({
          category: categoryname,
        });
        await addcategory.save();
        resolve(addcategory);
      }
    });
  },
  getallcategory: () => {
    return new Promise(async (resolve, reject) => {
      const allcategory = await category.find({}).lean();
      resolve(allcategory);
    });
  },
  addsubcategory: (Data) => {
    return new Promise(async (resolve, reject) => {
      const Subcategoryname = Data.Subcategory;
      console.log(Subcategoryname);
      const subcategorydata = await Subcategory.findOne({
        Subcategory: Subcategoryname,
      });
      const categorydata = await category.findOne({
        category: Data.categoryname,
      });
      if (subcategorydata) {
        reject({ status: false, meg: "Sub category already taiken" });
      } else {
        const addsubcategory = await new Subcategory({
          Subcategory: Subcategoryname,
          category: categorydata._id,
        });
        await addsubcategory.save(async (err, result) => {
          if (err) {
            reject({ msg: "sub category not added" });
          } else {
            resolve({ result, msg: "subcategory is added" });
          }
        });
      }
    });
  },
  getallsubcategory: () => {
    return new Promise(async (resolve, reject) => {
      const allsubcategory = await Subcategory.find({}).lean();
      resolve(allsubcategory);
    });
  },
  //------------------------------------------//

  addProduct: (data, image1, image2, image3, image4) => {
    console.log("imgae hrerer");
    return new Promise(async (resolve, reject) => {
      console.log("image add");
      const Subcategorydata = await Subcategory.findOne({
        Subcategory: data.Subcategory,
      });
      const branddata = await brand.findOne({ BrandName: data.brand });
      const categorydata = await category.findOne({ category: data.category });
      // const categorydata=await category.findOne({category:data.categoryname})
      //   console.log(product.productName+'/////////////');.
      console.log(image1);
      console.log("adddddd");
      if (!image2) {
        reject({ msg: "upload image" });
      } else {
        const newproduct = await product({
          productName: data.productName,
          description: data.description,
          price: data.price,
          discount: data.discount,
          color: data.color,
          stock: data.stock,
          size: data.size,
          Subcategory: Subcategorydata._id,
          Category: categorydata._id,
          Brand: branddata._id,
          Image: { image1, image2, image3, image4 },
        });
        await newproduct.save(async (err, res) => {
          if (err) {
          }
          resolve({ data: res, msg: "success" });
        });
      }
    });
  },
  getallproducts: () => {
    return new Promise(async (resolve, reject) => {
      const allproducts = await product.find({}).lean();
      resolve(allproducts);
    });
  },
  // -------------------------------------//
  deleteproduct: (proId) => {
    return new Promise(async (resolve, reject) => {
      let productid = proId;
      console.log("admin helper delete1");
      const removedproduct = await product.findByIdAndDelete({
        _id: productid,
      });
      console.log("admin helper delete2");
      resolve(removedproduct);
    });
  },
  getProductDetails: (proId) => {
    return new Promise(async (resolve, reject) => {
      console.log("admin edits");
      const productDetails = await product
        .findOne({ _id: proId })
        .lean()
        .then((productDetails) => {
          resolve(productDetails);
          console.log(productDetails);
        });
    });
  },

  updateProduct: (data, proId, image1, image2, image3, image4) => {
    return new Promise(async (resolve, reject) => {
      console.log("HGGGGGGGGGGGGGGGGGGGGGGGGGGGGD");
      console.log(image1);
      const SubcategoryData = await Subcategory.findOne({
        subcategory: data.subcategory,
      });
      const brandData = await brand.findOne({ brandName: data.brand });
      const categoryData = await category.findOne({ category: data.category });
      const updateProduct = await product.findByIdAndUpdate(
        { _id: proId },
        {
          $set: {
            productName: data.productName,
            description: data.description,
            price: data.price,
            discount: data.discount,
            stock: data.stock,
            subcategory: SubcategoryData._id,
            category: categoryData._id,
            brand: brandData._id,
            image: { image1, image2, image3, image4 },
          },
        }
      );
      resolve({ updateProduct, msg: "success" });
    });
  },
  // get order details
  allorders: () => {
    return new Promise(async (resolve, reject) => {
      const allorders = await orderModel
        .find({})
        .populate("product.pro_Id")
        .lean();
      resolve(allorders);
    });
  },
  orderdetails: (orderId) => {
    return new Promise(async (resolve, reject) => {
      const orderdetails = await orderModel
        .findOne({ _id: orderId })
        .populate("product.pro_Id")
        .lean();
      resolve(orderdetails);
    });
  },
  changeOrderStatus: (data) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
      const status = await orderModel.findOneAndUpdate(
        { _id: data.orderId, "product._id": data.proId },
        {
          $set: {
            "product.$.status": data.orderStatus,
          },
        }
      );
      console.log(status);
      resolve(status);
    });
  },
  unblockuser: (userId) => {
    return new Promise(async (resolve, reject) => {
      const user = await userData.findByIdAndUpdate(
        { _id: userId },
        { $set: { block: false } },
        { upsert: true }
      );
      resolve(user);
    });
  },
  blockuser: (userId) => {
    return new Promise(async (resolve, reject) => {
      const user = await userData.findByIdAndUpdate(
        { _id: userId },
        { $set: { block: true } },
        { upsert: true }
      );
      resolve(user);
    });
  },
};
