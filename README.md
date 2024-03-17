# Q&A API — Atelier

This project is an implementation of my Q&A API for Atelier, an innovative e-commerce platform specializing in fashion apparel, built primarily using Node.js, Express, and PostgreSQL. It provides endpoints for managing data retrieval, storage, and update operations (in accordance with upvote and report functionalities) for the questions and answers specific to each product.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Ayamagucci/SDC-qAndA
    ```

2. Navigate to the project directory:

    ```bash
    cd your_repository
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory with the following environment variables:

    ```plaintext
    PORT=3000
    USER=your_username
    HOST=localhost
    DB=your_database_name
    PW=your_password
    DB_PORT=5432
    ```

    Replace `your_username`, `your_database_name`, and `your_password` with your PostgreSQL credentials.

5. Start the server:

    ```bash
    npm start
    ```

## Database Schema

The database schema is defined in the SQL file `schema.sql`. You can view the schema [here](https://github.com/Ayamagucci/SDC-qAndA/blob/main/db/schema.sql).

## Usage

### Endpoints

#### Questions

- **GET /qa/questions/:product_id**
  - Retrieves questions for a specific product.
  - Parameters:
    - `product_id`: ID of the product.
    - `page`: Page number (optional).
    - `count`: Number of questions per page (optional).
  - Returns: Questions related to the specified product.

- **POST /qa/questions**
  - Posts a new question for a product.
  - Request Body:
    ```json
    {
      "product_id": 123,
      "body": "Your question here",
      "name": "Your name",
      "email": "Your email"
    }
    ```
  - Returns: Success message upon posting the question.

- **PUT /qa/questions/:question_id/helpful**
  - Upvotes a question.
  - Parameters:
    - `question_id`: ID of the question.
  - Returns: Success message upon upvoting the question.

- **PUT /qa/questions/:question_id/report**
  - Reports a question.
  - Parameters:
    - `question_id`: ID of the question.
  - Returns: Success message upon reporting the question.

#### Answers

- **GET /qa/questions/:question_id/answers**
  - Retrieves answers for a specific question.
  - Parameters:
    - `question_id`: ID of the question.
    - `page`: Page number (optional).
    - `count`: Number of answers per page (optional).
  - Returns: Answers related to the specified question.

- **POST /qa/questions/:question_id/answers**
  - Posts a new answer for a question.
  - Parameters:
    - `question_id`: ID of the question.
  - Request Body:
    ```json
    {
      "body": "Your answer here",
      "name": "Your name",
      "email": "Your email",
      "photos": ["photo_url1", "photo_url2"]
    }
    ```
  - Returns: Success message upon posting the answer.

- **PUT /qa/answers/:answer_id/helpful**
  - Upvotes an answer.
  - Parameters:
    - `answer_id`: ID of the answer.
  - Returns: Success message upon upvoting the answer.

- **PUT /qa/answers/:answer_id/report**
  - Reports an answer.
  - Parameters:
    - `answer_id`: ID of the answer.
  - Returns: Success message upon reporting the answer.
