const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const result = await db.collection('users').find().toArray();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const userId = new ObjectId(req.params.id);
    const result = await db.collection('users').findOne({ _id: userId });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const user = req.body;
    const result = await db.collection('users').insertOne(user);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const userId = new ObjectId(req.params.id);
    const user = req.body;
    const result = await db.collection('users')
      .replaceOne({ _id: userId }, user);
    if (result.modifiedCount > 0) {
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
    const db = mongodb.getDb();
    const userId = new ObjectId(req.params.id);
    const result = await db.collection('users').deleteOne({ _id: userId });
    if (result.deletedCount > 0) {
      res.status(200).send();
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