const axios = require('axios');

const paginate = () => {
  return async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1; // current page
      const limit = 5; // limit of articles per page
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      // Get articles based on pagination params
      const response = await axios.get(
        'https://api.spaceflightnewsapi.net/v4/articles',
        {
          params: {
            _start: startIndex,
            _limit: limit,
          },
        },
      );
      const results = response.data.results;
      const count = response.data.count;

      const pagination = {
        total_pages: Math.ceil(count / limit), // total number of pages
        current_page: page, // current page
        next_page: page < Math.ceil(count / limit) ? page + 1 : null, // next page if it exists
        prev_page: page > 1 ? page - 1 : null, // previous page if it exists
      };

      res.locals.pagination = pagination;
      res.locals.results = results;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  };
};

module.exports = paginate;
