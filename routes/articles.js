const express = require('express');

const { getHome, getArticles } = require('../controllers/articles');

//Main Routes - simplified for now

const router = express.Router();

router.route('/').get(getHome);
router.route('/space-news').get(getArticles);

module.exports = router;
