const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

// const getAllRecipes = async (req, res) => {
//   try {
//     const result = await mongodb
//       .getDb()
//       .db()
//       .collection('recipes')
//       .find();
//     const recipes = await result.toArray();
//     res.setHeader('Content-Type', 'application/json');
//     res.status(200).json(recipes);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const getAllRecipes = async (req, res) => {
  try {
    const db = mongodb.getDb(); // getDb() already returns the database instance
    const result = await db.collection('recipes').find().toArray();
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ message: err.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid recipe ID format' });
    }
    
    const recipeId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection('recipes')
      .findOne({ _id: recipeId });
      
    if (!result) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    const recipe = {
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      servings: req.body.servings,
      difficulty: req.body.difficulty,
      category: req.body.category,
      createdDate: new Date(),
      lastModified: new Date()
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('recipes')
      .insertOne(recipe);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ message: 'Error creating recipe' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid recipe ID format' });
    }

    const recipeId = new ObjectId(req.params.id);
    const recipe = {
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      servings: req.body.servings,
      difficulty: req.body.difficulty,
      category: req.body.category,
      lastModified: new Date()
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('recipes')
      .updateOne({ _id: recipeId }, { $set: recipe });

    if (response.modifiedCount > 0) {
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
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid recipe ID format' });
    }

    const recipeId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('recipes')
      .deleteOne({ _id: recipeId });

    if (response.deletedCount > 0) {
      res.status(204).send();
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