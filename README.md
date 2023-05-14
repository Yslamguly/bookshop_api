# Online Bookstore

This project is an API for an online bookstore which allows customers to easily browse and purchase books. The users of this app can do their shopping in a friendly user interface. The app is built using NodeJS and ReactJS, and data is stored in a PostgreSQL database. Postman was used for testing the API. For the front end please, visit the this repo [here] (https://github.com/Yslamguly/bookshop_front)

## Stack

- NodeJS
- ReactJS
- PostgreSQL

## Main Features

1. **Stripe Payment** - Customers can pay for their orders using Stripe payment integration.
2. **Email Verification System** - Users are required to verify their email addresses before they can make purchases.
3. **Authentication with Google** - Users can log in using their Google accounts.
4. **Reset Password** - Users can reset their passwords if they forget them.
5. **Authorization with JSON Token** - User authentication is done using JSON Web Tokens (JWTs).
6. **Shopping Cart** - Customers can add books to their shopping cart and view their order summary.
7. **Pagination** - Book lists are paginated for easier browsing.
8. **Filtering and Sorting Books** - Customers can filter and sort books based on various criteria such as author, genre, and price.
9. **Responsive Design** - The app is designed to be responsive and work well on devices of all sizes.

## Installation and Usage

1. Clone the repository: `git clone https://github.com/yourusername/online-bookstore.git`
2. Install dependencies: `npm install`
3. Set up the database by running the SQL scripts in the `database/initial.db` file.
4. Set up environment variables by creating a `.env` file based.
5. Start the server: `npm start`
6. You can test the API with Postman

## Testing

1. Run tests: `npm run test`

## Contributing

Contributions are welcome! Please open an issue or pull request for any changes or feature requests.

## License

This project is licensed under the MIT License.
