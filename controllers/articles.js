const axios = require('axios');
const cache = require('memory-cache');

exports.getHome = async (req, res) => {
  try {
    const today = new Date();
    const weekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay(),
    );
    const startString = weekStart.toISOString();
    const queryParams = `published_at__gte=${startString}`;

    const todaysDate = today.toISOString().slice(0, 10);
    const url = `https://api.spaceflightnewsapi.net/v4/articles/?published_at__gte=2023-04-21`;

    const response = await axios.get(url);
    let spaceNews = response.data.results;
    spaceNews.forEach((obj) => {
      const dateString = obj.published_at;
      const date = new Date(dateString);
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);

      obj.published_at = formattedDate;
    });

    console.log('Number of properties:', Object.keys(spaceNews).length);

    console.log(spaceNews[0]);
    res.render('index', { queryParams: queryParams, spaceNews: spaceNews });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

exports.getArticles = async (req, res) => {
  try {
    const cacheExpirationTime = 60000;

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
      //console.log('Data fetched from API:', response.data.results);
      spaceNews = response.data.results;
      spaceNews.forEach((obj) => {
        const dateString = obj.published_at;
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        obj.published_at = formattedDate;
      });

      //console.log('spaceNews:', spaceNews);
      //console.log('Number of properties:', Object.keys(spaceNews).length);
      //console.log('First item:', spaceNews[0]);

      cache.put(
        `spaceNews_${limit}_${offset}_${req.query.title_contains}`,
        spaceNews,
        cacheExpirationTime,
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
    const cacheExpirationTime = 60000;
    let spaceNews;

    const limit = parseInt(req.query.limit) || 10; // number of results to return per page
    const offset = parseInt(req.query.offset) || 0; // number of results to skip

    const today = new Date();
    const startString =
      req.query.published_at__gte ||
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay(),
      ).toISOString();

    // Check if data is already in cache
    const cachedData = cache.get(
      `this-week-headlines${limit}_${offset}_${startString}`,
    );

    if (cachedData != null && JSON.stringify(req.query) === cachedData.query) {
      console.log('Using cached data...');
      spaceNews = cachedData;
    } else {
      // If data is not in cache, fetch it from the API
      const response = await axios.get(
        'https://api.spaceflightnewsapi.net/v4/articles',
        {
          params: {
            start_date: startString,
            limit,
            offset,
          },
        },
      );

      spaceNews = response.data.results;
      spaceNews.forEach((obj) => {
        const dateString = obj.published_at;
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        obj.published_at = formattedDate;
      });

      // Store data in cache
      cache.put(
        `this-week-headlines-${limit}_${offset}_${startString}`,
        spaceNews,
        cacheExpirationTime,
      );
    }

    res.render('this-week-headlines', {
      spaceNews: spaceNews,
      start_date: startString,
      limit,
      offset,
      prevPage:
        offset - limit >= 0
          ? `?limit=${limit}&offset=${
              offset - limit
            }&published_at__gte=s=${startString}`
          : null,
      nextPage:
        spaceNews.length >= limit
          ? `?limit=${limit}&offset=${
              offset + limit
            }&published_at__gte=${startString}`
          : null,
      sort: 'published_at', // add this line to sort by published_at
      order: 'desc', // add this line to sort in ascending order
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
