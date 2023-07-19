const db = require('../../db');

module.exports = {
  GET: async(req, res) => {
    const { product_id, page, count } = req.query;
    const offset = (page - 1) * count;

    const queryQ = `
      SELECT
        q.id AS question_id,
        q.body AS question_body,
        q.date_written AS question_date,
        q.asker_name,
        q.helpful AS question_helpfulness,
        CASE
          WHEN q.reported = 1 THEN true
          ELSE false
        END AS reported
      FROM
        questions AS q
      WHERE
        q.product_id = $1
      ORDER BY
        q.id
      LIMIT $2 OFFSET $3
    `;

    try {
      const resultQ = await db.query(queryQ, [ product_id, count, offset ]);
      const questions = resultQ.rows;

      console.log(`${ questions.length } question(s) fetched!`);

      for (const question of questions) {
        const queryA = `
          SELECT
            a.id AS answer_id,
            a.body,
            a.date_written AS date,
            a.answerer_name,
            a.helpful AS helpfulness,
            COALESCE(
              jsonb_agg(jsonb_build_object('id', ap.id, 'url', ap.url)),
              '[]'
            ) AS photos
          FROM
            answers AS a
          LEFT JOIN
            answers_photos AS ap ON a.id = ap.answer_id
          WHERE
            a.question_id = $1
          GROUP BY
            a.id
        `;

        const resultA = await db.query(queryA, [ question.question_id ]);
        question.answers = resultA.rows;
      }

      res.status(200).json({
        product_id,
        results: questions,
      });

    } catch(err) {
      res.status(500).json({
        error: `Error fetching questions for product: ${ product_id }`
      });
    }
  },

  /* (errors):
    > "SequelizeUniqueConstraintError: Validation error" **
    > "duplicate key value violates unique constraint 'questions_pkey'"

    > NOTE: needed to sync table ID sequences (in schema)! **
  */
  POST: async(req, res) => {
    const { product_id, body, name, email } = req.body;

    const strQuery = `
      INSERT INTO questions (product_id, body, asker_name, asker_email)
      VALUES ($1, $2, $3, $4)
    `;

    try {
      await db.query(
        strQuery, [ product_id, body, name, email ]
      );

      console.log(`${ name } posted question: ${ body }`);

      res.status(201).json({
        success: true,
        message: 'Question posted!'
      });

    } catch(err) {
      res.status(500).json({
        error: `Error posting question: ${ body }`
      });
    }
  },

  UPVOTE: async(req, res) => {
    const { question_id } = req.params;

    const strQuery = `
      UPDATE questions
      SET helpful = helpful + 1
      WHERE id = $1
    `;

    try {
      await db.query(
        strQuery, [ question_id ]
      );

      console.log('Helpfulness updated (+1)!');

      res.status(204).end();

    } catch(err) {
      res.status(500).json({
        error: `Error upvoting question: ${ question_id }`
      });
    }
  },

  REPORT: async(req, res) => {
    const { question_id } = req.params;

    const strQuery = `
      UPDATE questions
      SET reported = 1
      WHERE id = $1
    `;

    try {
      await db.query(
        strQuery, [ question_id ]
      );

      console.log('Question reported!');

      res.status(204).end();

    } catch(err) {
      res.status(500).json({
        error: `Error reporting question: ${ question_id }`
      });
    }
  }
};