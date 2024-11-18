const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
  try {
    const result = await mongodb
      .getDb()
      .db()
      .collection('users')
      .find({}, { projection: { password: 0 } }); 
    const users = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection('users')
      .findOne({ _id: userId }, { projection: { password: 0 } }); 

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await mongodb
      .getDb()
      .db()
      .collection('users')
      .findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,  // Note: In Week 4, we'll add password hashing here
      createdDate: new Date(),
      lastModified: new Date()
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('users')
      .insertOne(user);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ message: 'Error creating user' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const userId = new ObjectId(req.params.id);

    // Check if email is being changed and if it's already in use
    if (req.body.email) {
      const existingUser = await mongodb
        .getDb()
        .db()
        .collection('users')
        .findOne({ email: req.body.email, _id: { $ne: userId } });

      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,  // Note: In Week 4, we'll add password hashing here
      lastModified: new Date()
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('users')
      .updateOne({ _id: userId }, { $set: user });

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('users')
      .deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};