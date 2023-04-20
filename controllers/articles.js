const CACHE_EXPIRATION_TIME = 60 * 1000;
const axios = require('axios');
const cache = require('memory-cache');

exports.getHome = async (req, res) => {
  try {
    res.render('index');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

exports.getArticles = async (req, res) => {
  try {
    console.log('Fetching space news...');
    const cachedData = cache.get('spaceNews');
    let spaceNews;
    if (cachedData != null) {
      console.log('Using cached data...');
      spaceNews = cachedData;
    } else {
      console.log('Fetching data from API...');
      const response = await axios.get(
        'https://api.spaceflightnewsapi.net/v4/articles',
        {
          params: req.query,
        },
      );
      console.log('Data fetched from API:', response.data.results);
      spaceNews = response.data.results;
      console.log('spaceNews:', spaceNews);
      console.log('Number of properties:', Object.keys(spaceNews).length);
      console.log('First item:', spaceNews[0]);

      cache.put('spaceNews', spaceNews, CACHE_EXPIRATION_TIME);
    }
    res.render('space-news', { spaceNews: spaceNews });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
