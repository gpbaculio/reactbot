const dialogFlow = require('dialogflow')
const structJson = require('structjson')

const config = require('../config/keys')


const projectId = config.googleProjectId
console.log('projectId ', projectId)
const languageCode = config.dialogFlowSessionLanguageCode
console.log('languageCode ', languageCode)
const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey
}
console.log('credentials ', credentials)

const sessionClient = new dialogFlow.SessionsClient({
  projectId,
  credentials
});
const sessionPath = sessionClient.sessionPath(
  config.googleProjectId,
  config.dialogFlowSessionId
);

console.log('sessionPath ', sessionPath)

module.exports = {
  textQuery: async (text, parameters = {}) => {
    let self = module.exports
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text,
          // The language used by the client (en-US)
          languageCode,
        },
      },
      queryParams: {
        payload: {
          data: parameters
        }
      }
    };
    let responses = await sessionClient.detectIntent(request)
    responses = await self.handleAction(responses)
    return responses
  },
  eventQuery: async (event, parameters = {}) => {
    let self = module.exports
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          // The query to send to the dialogflow agent
          name: event,
          parameters: structJson.jsonToStructProto(parameters),
          // The language used by the client (en-US)
          languageCode,
        },
      }
    };
    let responses = await sessionClient.detectIntent(request)
    responses = await self.handleAction(responses)
    return responses
  },
  handleAction: responses => {
    return responses
  }
}