const dialogFlow = require('dialogflow')
const structJson = require('structjson')
const uuidV4 = require('uuid/v4')
const mongoose = require('mongoose')
const projectId = process.env.GOOGLE_PROJECT_ID
const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: JSON.parse(process.env.GOOGLE_PRIVATE_KEY)
}

const languageCode = 'en-US'

const sessionClient = new dialogFlow.SessionsClient({
  projectId,
  credentials
});

const RegistrationModel = mongoose.model('registration')

module.exports = {
  textQuery: async (text, sessionUserId, parameters = {}) => {
    let self = module.exports
    const request = {
      session: sessionClient.sessionPath(
        projectId,
        sessionUserId
      ),
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
  eventQuery: async (event, sessionUserId, parameters = {}) => {
    let self = module.exports
    const request = {
      session: sessionClient.sessionPath(
        projectId,
        sessionUserId
      ),
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
    const self = module.exports
    const queryResult = responses[0].queryResult
    switch (queryResult.action) {
      case 'recommendcourses-yes':
        if (queryResult.allRequiredParamsPresent) {
          self.saveRegistration(queryResult.parameters.fields)
        }
        break;
    }
    return responses
  },
  saveRegistration: async fields => {
    const registration = new RegistrationModel({
      name: fields.name.stringValue,
      address: fields.address.stringValue,
      phone: fields.phone.stringValue,
      email: fields.email.stringValue,
      dateSent: Date.now()
    })
    try {
      const reg = await registration.save()
      console.log('registration success: ', reg)
    } catch (e) {
      console.log('registration failed: ', e)
    }
  }
}