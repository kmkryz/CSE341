const { body, validationResult } = require('express-validator');

const recipeValidationRules = () => {
  return [
    body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    body('ingredients').isArray().withMessage('Ingredients must be an array'),
    body('instructions').isArray().withMessage('Instructions must be an array'),
    body('prepTime').isInt({ min: 0 }).withMessage('Prep time must be a positive number'),
    body('cookTime').isInt({ min: 0 }).withMessage('Cook time must be a positive number'),
    body('servings').isInt({ min: 1 }).withMessage('Servings must be at least 1'),
    body('difficulty').isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
    body('category').trim().notEmpty().withMessage('Category is required')
  ];
};

const userValidationRules = () => {
    return [
      body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
      body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must provide a valid email'),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
    ];
  };

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
    recipeValidationRules,
    userValidationRules,
    validate
  };