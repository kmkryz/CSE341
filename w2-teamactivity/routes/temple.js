const routes = require('express').Router();
const temples = require('../controllers/temple.js');
const db = require('../models');
const Temple = db.temples;

const apiKey = 'Ezl0961tEpx2UxT25v2uKFK91qdNAr5npRlMT1zLcE3Mg68XwZj3N8Dyp1R8IvFenrVwHRllOUxF8Og00l0n9NcaYMtH68pgdv7N';

exports.create = (req, res) => {
    /*
    swagger.description = 'API key is needed: Ezl0961tEpx2UxT25v2uKFK91qdNAr5npRlMT1zLcE3Mg68XwZj3N8Dyp1R8IvFenrVwHRllOUxF8Og00l0n9NcaYMtH68pgdv7N'
    */
   //validate request
   if (!req.body.name) {
    res.status(400).send({message: 'Name is required'});
    return;
   }

   //create a temple
   const temple = new Temple({
    temple_id: req.body.temple_id,
    name: req.body.name,
    description: req.body.description,
   });
}

routes.get('/', temples.findAll);
routes.get('/:temple_id', temples.findOne);

routes.post('/', temples.create);

module.exports = routes;
