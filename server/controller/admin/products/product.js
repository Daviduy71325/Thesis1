const bcrypt = require('bcryptjs');
const { roles } = require('../../../config/roles');

const ProductDetails = require('../../../models/inventory/ProductDetails');
const ProductInventory = require('../../../models/inventory/ProductInventory');
const Category = require('../../../models/inventory/Category');
const Counter = require('../../../models/inventory/counter');

module.exports = {
  grantAccess: (action, resource) => {
    return async (req, res, next) => {
      try {
        const permission = roles.can(req.user.role)[action](resource);
        if (!permission.granted) {
          return res.status(401).json({
            error: "You don't have enough permission to perform this action",
          });
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  },

  productList: async (req, res, next) => {
    try {
      const products = await ProductInventory.find().populate({
        path: 'prodId',
        model: ProductDetails,
        populate: { path: 'category', select: 'category_name', model: Category },
      });
      //const products = await ProductDetails.find().populate('category');

      if (products.length === 0) {
        res.status(400).json({ msg: 'No data available', success: false });
      } else {
        res.status(200).json({ products: products, success: true });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: err, success: false });
    }
  },

  addProduct: async (req, res, next) => {
    try {
      const prod = {
        product_name: req.body.product.product_name,
        unit_price: req.body.product.unit_price,
        markup_price: req.body.product.markup_price,
        SRP: req.body.product.SRP,
        description: req.body.product.description,
        category: req.body.product.category,
      };

      const findProduct = await ProductDetails.findOne({
        product_name: prod.product_name.toUpperCase(),
      });

      if (findProduct) {
        return res
          .status(400)
          .json({ msg: `Product Name ${findProduct.product_name} already exist`, success: false });
      }
      const ProductCodeTeset = await prodCode(prod.category);

      const newProduct = new ProductDetails({
        _id: ProductCodeTeset,
        product_name: prod.product_name.toUpperCase(),
        unit_price: prod.unit_price,
        markup_price: prod.markup_price,
        SRP: prod.SRP,
        description: prod.description,
        category: prod.category,
        date_updated: Date.now(),
      });

      const newProductInventory = new ProductInventory({
        prodId: newProduct._id,
        stock_onhand: 0,
      });

      const prodInvtSaved = await newProductInventory.save().then((prodInt) => {
        return prodInt;
      });

      await newProduct.save().then(async (prod) => {
        const productNew = await ProductInventory.findById({ _id: prodInvtSaved._id }).populate({
          path: 'prodId',
          model: ProductDetails,
          populate: { path: 'category', select: 'category_name', model: Category },
        });

        res.status(200).json({
          success: true,
          message: 'Succesfully Saved',
          product: productNew,
        });
      });
    } catch (err) {
      res.status(400).json({ msg: err, success: false });
    }
  },

  productInventory: async (req, res, next) => {
    const test = await ProductInventory.find().populate({
      path: 'prodId',
      model: ProductDetails,
      populate: { path: 'category', model: Category },
    });

    res.json({ test: test });
  },
};

var prodCode = async (catid) => {
  //Pang generate ng product code, depende sa category
  try {
    const cat = await Category.findById({ _id: catid });

    const catAbbv = cat.category_abbreviation;

    const prod = await new Promise((resolve, reject) => {
      Counter.findOneAndUpdate(
        { id: catAbbv },
        { $inc: { seq: 1 } },
        { new: true, useFindAndModify: false },
        (error, result) => {
          if (error) {
            console.error(JSON.stringify(error));
            return reject(error);
          }

          const prodId = result.id;

          const newproductCode = `${prodId}-0${result.seq}`;
          resolve(newproductCode);
        }
      );
    });

    return prod;
  } catch (err) {
    return err;
  }
};
