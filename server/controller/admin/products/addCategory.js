const bcrypt = require("bcryptjs");
const Category = require("../../../models/inventory/Category");
const { roles } = require("../../../config/roles");

module.exports = {
  categoryList: async (req, res, next) => {
    const categories = await Category.find();
    if (categories.length === 0) {
      res.status(200).json({ categories: "No Data Available", success: true });
    } else {
      res.status(200).json({ categories: categories, success: true });
    }
  },

  addCategory: async (req, res, next) => {
    const { categoryName } = req.body;
    const foundCat = await Category.findOne({ category_name: categoryName });
    if (foundCat) {
      return res.status(400).json({
        msg: `Category "${categoryName}" is already in use`,
        success: false,
      });
    }

    const newCat = new Category({
      category_name: categoryName,
      date_updated: Date.now(),
    });

    await newCat.save().then((cat) => {
      res.status(200).json({
        success: true,
        message: "Succesfully Saved",
        category: cat,
      });
    });
  },

  updateCategoryName: async (req, res, next) => {
    try {
      const { category_name, _id } = req.body;
      const cat = await Category.findById(_id);

      if (cat) {
        if (cat.category_name === category_name) {
          return res.status(200).json({ categories: cat, success: true });
        } else {
          let catNameToFind = await Category.findOne({ category_name });

          if (catNameToFind) {
            return res
              .status(400)
              .json({ err: "Category Name already exist", success: false });
          } else {
            updateCatName(category_name, _id).then((data) => {
              return res.status(200).json({ categories: data, success: true });
            });
          }
        }
      }
    } catch (err) {
      res.status(400).json({ err: "Category doesn't exist", success: false });
    }
  },
};

var updateCatName = async (category_name, _id) => {
  let result = await Category.findByIdAndUpdate(
    _id,
    { category_name, date_updated: Date.now() },
    {
      new: true,
      useFindAndModify: false,
    }
  );
  if (!result) {
    const err = "may mali eh";
    return err;
  } else {
    return result;
  }
};
