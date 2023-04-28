
# Universe Hubs

A lightweight, minimalistic  API client developed in JavaScript with the following goals in mind:

Small, single purpose module, i.e. talk to the rest API
Works in a environment
No abstraction over  data, what you see is what you get
Clean api
Small bundle footprint
Minimal request validation
Predictable and consistent responses
Full test coverage

## Installation

Install my-project with npm

```bash
  npm install 
  
```
    
## Deployment

To deploy this project run

```bash
  npm start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`CACHE_EXPIRATION_TIME`


## Optimizations

Caching: caching is an effective technique to reduce the number of API calls and improve application performance. Memory-cache package to cache dataBut there's space to build a more robust caching solution like Redis or Memcached for more flexibility and scalability.

Error handling: catch block is currently handling  errors. However,there's room to build a  more detailed error messages to help with debugging. For example,   log the error stack trace or provide a custom error message that describes the error in more detail.

Query parameters: more query parameters could be added  to my API endpoints to allow users to filter and sort the results.Such as to be able  filter by date, author, category, or location.

Pagination: add page numbers make it easier for users to navigate through the results.

Response compression: the response data can be compressed to reduce the amount of data transmitted over the network.Considering to use middleware such as compression or zlib to compress the response data before sending it to the client.

Rate limiting: rate limiting should be implement to prevent abuse and ensure fair usage of the API. Considering to use express-rate-limit to limit the number of requests per IP address or per API key.

Monitoring: monitor the  application and ensure that it's running smoothly. Tools such as  PM2 can automatically restart your application if it crashes or becomes unresponsive, and it can also generate logs and performance metrics.

Security: security messures are crucial to protect the API from attacks, such as XSS, CSRF, and SQL injection. Packages like helmet, csurf, and sequelize to add security features to the  application.

## Roadmap

- Additional query parameters to be added

- Rate limiting


## Tech Stack

**Client:** EJS, CSS, BOOTSRAP

**Server:** Node, Express


## API Reference

#### Get all items

```http
  GET /
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `query parameters` | `string` | Returns the latest articles on space news for today. |

#### Get item

```http
  GET /this-week-news
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `query parameters` | `string` | Returns a list of articles from space news published this week. |

#### Get item


```http
  GET /space-news/${title_contains}
  ```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `query parameters`      | `string` | **Required**. title_contains |
 Returns a list of articles within the search criteria

#### Get item



## License

[MIT](https://choosealicense.com/licenses/mit/)

