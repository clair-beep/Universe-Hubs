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
    console.log('query object:', req.query.title_contains);

    const limit = parseInt(req.query.limit) || 10; // number of results to return per page
    const offset = parseInt(req.query.offset) || 0; // number of results to skip

    console.log('Fetching space news...');
    const cachedData = cache.get(
      `spaceNews_${limit}_${offset}_${req.query.title_contains}`,
    );
    let spaceNews;
    if (cachedData != null && JSON.stringify(req.query) === cachedData.query) {
      console.log('Using cached data...');
      spaceNews = cachedData;
    } else {
      console.log('Fetching data from API...');
      const response = await axios.get(
        'https://api.spaceflightnewsapi.net/v4/articles',
        {
          params: {
            ...req.query,
            limit,
            offset,
          },
        },
      );
      console.log('Data fetched from API:', response.data.results);
      spaceNews = response.data.results;
      console.log('spaceNews:', spaceNews);
      console.log('Number of properties:', Object.keys(spaceNews).length);
      console.log('First item:', spaceNews[0]);

      cache.put(
        `spaceNews_${limit}_${offset}_${req.query.title_contains}`,
        spaceNews,
        CACHE_EXPIRATION_TIME,
      );
    }

    res.render('space-news', {
      spaceNews: spaceNews,
      search_criteria: req.query.title_contains,
      limit,
      offset,
      prevPage:
        offset - limit >= 0
          ? `?limit=${limit}&offset=${offset - limit}&title_contains=${
              req.query.title_contains
            }`
          : null,
      nextPage:
        spaceNews.length >= limit
          ? `?limit=${limit}&offset=${offset + limit}&title_contains=${
              req.query.title_contains
            }`
          : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

exports.getThisWeekNews = async (req, res) => {
  try {
    const today = new Date();
    const weekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay(),
    );
    const weekEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + (6 - today.getDay()),
    );
    const startString = weekStart.toISOString();
    const endString = weekEnd.toISOString();
    const response = await axios.get(
      'https://api.spaceflightnewsapi.net/v4/articles',
      {
        params: {
          start_date: startString,
          end_date: endString,
        },
      },
    );
    const spaceNews = response.data.results;
    res.render('this-week-headlines', { spaceNews: spaceNews });
    console.log('Space news for this week:', spaceNews);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
