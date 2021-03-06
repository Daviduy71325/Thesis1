/* eslint-disable */
import axios from "axios";
import router from "../../router";

const state = {
  categories: {},
  catName: "",
  errorManageProduct: ""
};

const getters = {
  categoryList: state => state.categories
};

const actions = {
  async categoryList({ commit }, catData) {
    try {
      commit("CATEGORY_LIST_REQUEST");
      let res = await axios.get("http://localhost:5000/api/admin/categoryList");
      if (res.data.success) {
        commit("CATEGORY_LIST_RESULT", res);
        return res;
      }
    } catch (err) {
      commit("CATEGORY_LIST_ERROR", err);
    }
  },

  async addCategory({ commit }, catData) {
    try {
      let res = await axios.post(
        "http://localhost:5000/api/admin/addCategory",
        {
          categoryName: catData.categoryName,
          category_abbreviation: catData.catAbbv
        }
      );

      if (res.data.success === true) {
        commit("NEW_CATEGORY_SUCCESS", res);

        return res;
      }
    } catch (err) {
      const error = { data: err.response.data };
      return error;
    }
  },

  async editCategory({ commit }, catData) {
    try {
      let res = await axios.put(
        "http://localhost:5000/api/admin/updateCategoryName",
        {
          _id: catData.id,
          category_name: catData.catName,
          catStatus: catData.catStatus
        }
      );

      if (res.data.success === true) {
        commit("EDIT_CATEGORY_SUCCESS", res);

        return res;
      }
    } catch (err) {
      const error = { data: err.response.data };
      commit("EDIT_CATEGORY_ERROR", error);
      return error;
    }
  }
};

const mutations = {
  CATEGORY_LIST_REQUEST() {
    state.errorManageProduct = null;
  },
  CATEGORY_LIST_RESULT(state, catData) {
    state.categories = catData.data.categories;
    state.errorManageProduct = null;
  },
  NEW_CATEGORY_SUCCESS(state, catData) {
    this.catName = catData.data.categories;
  },
  EDIT_CATEGORY_SUCCESS(state, catData) {
    state.catName = catData.data.categories.category_name;
  },
  EDIT_CATEGORY_ERROR(state, error) {
    state.error = error.data.err;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
