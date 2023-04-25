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
