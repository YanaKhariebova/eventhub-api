import { findAllCategories } from "../services/categoryService.js";

// GET /categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await findAllCategories();
    res.status(200).json({ data: categories });
  } catch (err) {
    next(err);
  }
};
