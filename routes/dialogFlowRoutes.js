
const chatBot = require('../chatBot/chatBot')

module.exports = app => {

  app.post('/api/df_text_query', async (req, res) => {
    try {
      const responses = await chatBot.textQuery(
        req.body.text,
        req.body.parameters
      );
      res.send({ result: responses[0].queryResult })
    } catch (error) {
      res.send({ error })
    }
  })

  app.post('/api/df_event_query', async (req, res) => {
    try {
      const responses = await chatBot.eventQuery(
        req.body.event,
        req.body.parameters
      );
      res.send({ result: responses[0].queryResult })
    } catch (error) {
      res.send({ error })
    }
  })

}