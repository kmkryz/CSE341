const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllRecipes = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const result = await db.collection('recipes').find().toArray();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const recipeId = new ObjectId(req.params.id);
    const result = await db.collection('recipes').findOne({ _id: recipeId });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const recipe = req.body;
    const result = await db.collection('recipes').insertOne(recipe);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const recipeId = new ObjectId(req.params.id);
    const recipe = req.body;
    const result = await db.collection('recipes')
      .replaceOne({ _id: recipeId }, recipe);
    if (result.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const recipeId = new ObjectId(req.params.id);
    const result = await db.collection('recipes').deleteOne({ _id: recipeId });
    if (result.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
};