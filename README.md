# Product Management HTML Client

A simple HTML client for managing products. This client connects to the same Rails API backend as the React client, but uses vanilla HTML and JavaScript with Bootstrap 5 for styling.

## Features

- View all products
- Filter products by availability
- Add new products
- Edit existing products
- Delete products
- Responsive design with Bootstrap 5

## Setup Instructions

1. Make sure the Rails API server is running on port 3001
   ```
   cd ../product_management_app
   rails server -p 3001
   ```

2. Install Node.js if you don't have it already

3. Start the HTML client server
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3002`

## Technologies Used

- HTML5
- JavaScript (Vanilla)
- Bootstrap 5 (via CDN)
- Node.js (for the simple server)

## Port Usage

- Rails API: http://localhost:3001
- React Client: http://localhost:3000
- HTML Client: http://localhost:3002 