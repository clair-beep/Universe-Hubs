const express = require('express');

const {
  getHome,
  getArticles,
  getThisWeekNews,
} = require('../controllers/articles');

//Main Routes - simplified for now

const router = express.Router();

router.route('/').get(getHome);
router.route('/space-news').get(getArticles);
router.get('/this-week-headlines', getThisWeekNews);

module.exports = router;
