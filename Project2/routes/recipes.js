const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes');
const { recipeValidationRules, validate } = require('../middleware/validate');


/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - ingredients
 *         - instructions
 *       properties:
 *         title:
 *           type: string
 *           description: Recipe title
 *         description:
 *           type: string
 *           description: Recipe description
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ingredients
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *           description: Step-by-step instructions
 *         prepTime:
 *           type: integer
 *           description: Preparation time in minutes
 *         cookTime:
 *           type: integer
 *           description: Cooking time in minutes
 *         servings:
 *           type: integer
 *           description: Number of servings
 *         difficulty:
 *           type: string
 *           enum: [Easy, Medium, Hard]
 *         category:
 *           type: string
 *           description: Recipe category
 *         createdDate:
 *           type: string
 *           format: date-time
 *         lastModified:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Recipe management API
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Returns all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: List of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Server error
 */
router.get('/', recipesController.getAllRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Get recipe by id
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Recipe id
 *     responses:
 *       200:
 *         description: Recipe found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 *       400:
 *         description: Invalid ID format
 *       500:
 *         description: Server error
 */
router.get('/:id', recipesController.getRecipeById);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the created recipe
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', recipeValidationRules(), validate, recipesController.createRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Update a recipe by id
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Recipe id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       204:
 *         description: Recipe updated successfully
 *       400:
 *         description: Invalid input or ID format
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
router.put('/:id', recipeValidationRules(), validate, recipesController.updateRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Delete a recipe by id
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Recipe id
 *     responses:
 *       204:
 *         description: Recipe deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', recipesController.deleteRecipe);

module.exports = router;