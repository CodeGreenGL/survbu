(function () {
  'use strict';

  angular.module('restlet.sdk', []);

  angular.module('restlet.sdk')
    .service('surveysStarter', ['$http', surveysStarter]);

  function surveysStarter ($http) {

    var endpoint = 'https://codegreen.restlet.net/v1';
    var globalSecurity = {};
    var securityConfigurations = {};

    this.setEndpoint = setEndpoint;

    this.configureGlobalBasicAuthentication = configureGlobalBasicAuthentication(globalSecurity);
    this.configureGlobalApiToken = configureGlobalApiToken(globalSecurity);
    this.configureGlobalOAuth2Token = configureGlobalOAuth2Token(globalSecurity);

    this.configureHTTP_BASICAuthentication = configureHTTP_BASICAuthentication;

    /**
     * Loads a list of ActionType
     *
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     {
       "$page" : "Number of the page to retrieve. Integer value.",
       "id" : "Allows to filter the collections of result by the value of field id",
       "$sort" : "Order in which to retrieve the results. Multiple sort criteria can be passed. Example: sort=age ASC,height DESC",
       "actionType" : "Allows to filter the collections of result by the value of field actionType",
       "$size" : "Size of the page to retrieve. Integer value"
     }
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     [
     {
       "actionType" : "sample actionType",
       "id" : "sample id"
     }
     ]
     */
    this.getActionTypes = function (config) {
      var url = endpoint + '/actionTypes/';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Adds a ActionType
     *
     * @param body - the payload; is of type ActionType; has the following structure:
     {
       "actionType" : "sample actionType",
       "id" : "sample id"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "actionType" : "sample actionType",
       "id" : "sample id"
     }
     */
    this.postActionTypes = function (body, config) {
      var url = endpoint + '/actionTypes/';

      return send('POST', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Loads a ActionType
     *
     * @param actionTypeid - REQUIRED - Identifier of the ActionType
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "actionType" : "sample actionType",
       "id" : "sample id"
     }
     */
    this.getActionTypesActionTypeid = function (actionTypeid, config) {
      checkPathVariables(actionTypeid, 'actionTypeid');

      var url = endpoint + '/actionTypes/' + actionTypeid + '';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Stores a ActionType
     *
     * @param actionTypeid - REQUIRED - Identifier of the ActionType
     * @param body - the payload; is of type ActionType; has the following structure:
     {
       "actionType" : "sample actionType",
       "id" : "sample id"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "actionType" : "sample actionType",
       "id" : "sample id"
     }
     */
    this.putActionTypesActionTypeid = function (actionTypeid, body, config) {
      checkPathVariables(actionTypeid, 'actionTypeid');

      var url = endpoint + '/actionTypes/' + actionTypeid + '';

      return send('PUT', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Deletes a ActionType
     *
     * @param actionTypeid - REQUIRED - Identifier of the ActionType
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     */
    this.deleteActionTypesActionTypeid = function (actionTypeid, config) {
      checkPathVariables(actionTypeid, 'actionTypeid');

      var url = endpoint + '/actionTypes/' + actionTypeid + '';

      return send('DELETE', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Loads a list of IfThisThenThat
     *
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     {
       "ifSurveySectionIdIs" : "Allows to filter the collections of result by the value of field ifSurveySectionIdIs",
       "andAnswerContainsValue" : "Allows to filter the collections of result by the value of field andAnswerContainsValue",
       "$size" : "Size of the page to retrieve. Integer value",
       "ifQuestionIdIs" : "Allows to filter the collections of result by the value of field ifQuestionIdIs",
       "ifSurveyIdIs" : "Allows to filter the collections of result by the value of field ifSurveyIdIs",
       "thenDoAction" : "Allows to filter the collections of result by the value of field thenDoAction",
       "$sort" : "Order in which to retrieve the results. Multiple sort criteria can be passed. Example: sort=age ASC,height DESC",
       "id" : "Allows to filter the collections of result by the value of field id",
       "andAnswerContainsIndex" : "Allows to filter the collections of result by the value of field andAnswerContainsIndex",
       "$page" : "Number of the page to retrieve. Integer value.",
       "onId" : "Allows to filter the collections of result by the value of field onId"
     }
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     [
     {
       "andAnswerContainsIndex" : [ 1 ],
       "andAnswerContainsValue" : [ "sample andAnswerContainsValue" ],
       "id" : "sample id",
       "ifQuestionIdIs" : "sample ifQuestionIdIs",
       "ifSurveyIdIs" : "sample ifSurveyIdIs",
       "ifSurveySectionIdIs" : "sample ifSurveySectionIdIs",
       "onId" : "sample onId",
       "thenDoAction" : "sample thenDoAction"
     }
     ]
     */
    this.getIfThisThenThats = function (config) {
      var url = endpoint + '/ifThisThenThats/';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Adds a IfThisThenThat
     *
     * @param body - the payload; is of type IfThisThenThat; has the following structure:
     {
       "andAnswerContainsIndex" : [ 1 ],
       "andAnswerContainsValue" : [ "sample andAnswerContainsValue" ],
       "id" : "sample id",
       "ifQuestionIdIs" : "sample ifQuestionIdIs",
       "ifSurveyIdIs" : "sample ifSurveyIdIs",
       "ifSurveySectionIdIs" : "sample ifSurveySectionIdIs",
       "onId" : "sample onId",
       "thenDoAction" : "sample thenDoAction"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "andAnswerContainsIndex" : [ 1 ],
       "andAnswerContainsValue" : [ "sample andAnswerContainsValue" ],
       "id" : "sample id",
       "ifQuestionIdIs" : "sample ifQuestionIdIs",
       "ifSurveyIdIs" : "sample ifSurveyIdIs",
       "ifSurveySectionIdIs" : "sample ifSurveySectionIdIs",
       "onId" : "sample onId",
       "thenDoAction" : "sample thenDoAction"
     }
     */
    this.postIfThisThenThats = function (body, config) {
      var url = endpoint + '/ifThisThenThats/';

      return send('POST', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Loads a IfThisThenThat
     *
     * @param ifThisThenThatid - REQUIRED - Identifier of the IfThisThenThat
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "andAnswerContainsIndex" : [ 1 ],
       "andAnswerContainsValue" : [ "sample andAnswerContainsValue" ],
       "id" : "sample id",
       "ifQuestionIdIs" : "sample ifQuestionIdIs",
       "ifSurveyIdIs" : "sample ifSurveyIdIs",
       "ifSurveySectionIdIs" : "sample ifSurveySectionIdIs",
       "onId" : "sample onId",
       "thenDoAction" : "sample thenDoAction"
     }
     */
    this.getIfThisThenThatsIfThisThenThatid = function (ifThisThenThatid, config) {
      checkPathVariables(ifThisThenThatid, 'ifThisThenThatid');

      var url = endpoint + '/ifThisThenThats/' + ifThisThenThatid + '';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Stores a IfThisThenThat
     *
     * @param ifThisThenThatid - REQUIRED - Identifier of the IfThisThenThat
     * @param body - the payload; is of type IfThisThenThat; has the following structure:
     {
       "andAnswerContainsIndex" : [ 1 ],
       "andAnswerContainsValue" : [ "sample andAnswerContainsValue" ],
       "id" : "sample id",
       "ifQuestionIdIs" : "sample ifQuestionIdIs",
       "ifSurveyIdIs" : "sample ifSurveyIdIs",
       "ifSurveySectionIdIs" : "sample ifSurveySectionIdIs",
       "onId" : "sample onId",
       "thenDoAction" : "sample thenDoAction"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "andAnswerContainsIndex" : [ 1 ],
       "andAnswerContainsValue" : [ "sample andAnswerContainsValue" ],
       "id" : "sample id",
       "ifQuestionIdIs" : "sample ifQuestionIdIs",
       "ifSurveyIdIs" : "sample ifSurveyIdIs",
       "ifSurveySectionIdIs" : "sample ifSurveySectionIdIs",
       "onId" : "sample onId",
       "thenDoAction" : "sample thenDoAction"
     }
     */
    this.putIfThisThenThatsIfThisThenThatid = function (ifThisThenThatid, body, config) {
      checkPathVariables(ifThisThenThatid, 'ifThisThenThatid');

      var url = endpoint + '/ifThisThenThats/' + ifThisThenThatid + '';

      return send('PUT', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Deletes a IfThisThenThat
     *
     * @param ifThisThenThatid - REQUIRED - Identifier of the IfThisThenThat
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     */
    this.deleteIfThisThenThatsIfThisThenThatid = function (ifThisThenThatid, config) {
      checkPathVariables(ifThisThenThatid, 'ifThisThenThatid');

      var url = endpoint + '/ifThisThenThats/' + ifThisThenThatid + '';

      return send('DELETE', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Loads a list of QuestionType
     *
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     {
       "$sort" : "Order in which to retrieve the results. Multiple sort criteria can be passed. Example: sort=age ASC,height DESC",
       "questionType" : "Allows to filter the collections of result by the value of field questionType",
       "id" : "Allows to filter the collections of result by the value of field id",
       "$page" : "Number of the page to retrieve. Integer value.",
       "$size" : "Size of the page to retrieve. Integer value"
     }
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     [
     {
       "id" : "sample id",
       "questionType" : "sample questionType"
     }
     ]
     */
    this.getQuestionTypes = function (config) {
      var url = endpoint + '/questionTypes/';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Adds a QuestionType
     *
     * @param body - the payload; is of type QuestionType; has the following structure:
     {
       "id" : "sample id",
       "questionType" : "sample questionType"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "id" : "sample id",
       "questionType" : "sample questionType"
     }
     */
    this.postQuestionTypes = function (body, config) {
      var url = endpoint + '/questionTypes/';

      return send('POST', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Loads a QuestionType
     *
     * @param questionTypeid - REQUIRED - Identifier of the QuestionType
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "id" : "sample id",
       "questionType" : "sample questionType"
     }
     */
    this.getQuestionTypesQuestionTypeid = function (questionTypeid, config) {
      checkPathVariables(questionTypeid, 'questionTypeid');

      var url = endpoint + '/questionTypes/' + questionTypeid + '';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Stores a QuestionType
     *
     * @param questionTypeid - REQUIRED - Identifier of the QuestionType
     * @param body - the payload; is of type QuestionType; has the following structure:
     {
       "id" : "sample id",
       "questionType" : "sample questionType"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "id" : "sample id",
       "questionType" : "sample questionType"
     }
     */
    this.putQuestionTypesQuestionTypeid = function (questionTypeid, body, config) {
      checkPathVariables(questionTypeid, 'questionTypeid');

      var url = endpoint + '/questionTypes/' + questionTypeid + '';

      return send('PUT', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Deletes a QuestionType
     *
     * @param questionTypeid - REQUIRED - Identifier of the QuestionType
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     */
    this.deleteQuestionTypesQuestionTypeid = function (questionTypeid, config) {
      checkPathVariables(questionTypeid, 'questionTypeid');

      var url = endpoint + '/questionTypes/' + questionTypeid + '';

      return send('DELETE', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Loads a list of Question
     *
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     {
       "questionChoices" : "Allows to filter the collections of result by the value of field questionChoices",
       "id" : "Allows to filter the collections of result by the value of field id",
       "questionType" : "Allows to filter the collections of result by the value of field questionType",
       "$size" : "Size of the page to retrieve. Integer value",
       "$page" : "Number of the page to retrieve. Integer value.",
       "$sort" : "Order in which to retrieve the results. Multiple sort criteria can be passed. Example: sort=age ASC,height DESC",
       "questionText" : "Allows to filter the collections of result by the value of field questionText"
     }
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     [
     {
       "id" : "sample id",
       "questionChoices" : [ "sample questionChoices" ],
       "questionText" : "sample questionText",
       "questionType" : "sample questionType"
     }
     ]
     */
    this.getQuestions = function (config) {
      var url = endpoint + '/questions/';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Adds a Question
     *
     * @param body - the payload; is of type Question; has the following structure:
     {
       "id" : "sample id",
       "questionChoices" : [ "sample questionChoices" ],
       "questionText" : "sample questionText",
       "questionType" : "sample questionType"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "id" : "sample id",
       "questionChoices" : [ "sample questionChoices" ],
       "questionText" : "sample questionText",
       "questionType" : "sample questionType"
     }
     */
    this.postQuestions = function (body, config) {
      var url = endpoint + '/questions/';

      return send('POST', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Loads a Question
     *
     * @param questionid - REQUIRED - Identifier of the Question
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "id" : "sample id",
       "questionChoices" : [ "sample questionChoices" ],
       "questionText" : "sample questionText",
       "questionType" : "sample questionType"
     }
     */
    this.getQuestionsQuestionid = function (questionid, config) {
      checkPathVariables(questionid, 'questionid');

      var url = endpoint + '/questions/' + questionid + '';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Stores a Question
     *
     * @param questionid - REQUIRED - Identifier of the Question
     * @param body - the payload; is of type Question; has the following structure:
     {
       "id" : "sample id",
       "questionChoices" : [ "sample questionChoices" ],
       "questionText" : "sample questionText",
       "questionType" : "sample questionType"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "id" : "sample id",
       "questionChoices" : [ "sample questionChoices" ],
       "questionText" : "sample questionText",
       "questionType" : "sample questionType"
     }
     */
    this.putQuestionsQuestionid = function (questionid, body, config) {
      checkPathVariables(questionid, 'questionid');

      var url = endpoint + '/questions/' + questionid + '';

      return send('PUT', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Deletes a Question
     *
     * @param questionid - REQUIRED - Identifier of the Question
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     */
    this.deleteQuestionsQuestionid = function (questionid, config) {
      checkPathVariables(questionid, 'questionid');

      var url = endpoint + '/questions/' + questionid + '';

      return send('DELETE', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Loads a list of ResourceVersion
     *
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     {
       "$size" : "Size of the page to retrieve. Integer value",
       "$sort" : "Order in which to retrieve the results. Multiple sort criteria can be passed. Example: sort=age ASC,height DESC",
       "$page" : "Number of the page to retrieve. Integer value.",
       "dataVersion" : "Allows to filter the collections of result by the value of field dataVersion",
       "id" : "Allows to filter the collections of result by the value of field id",
       "resourceId" : "Allows to filter the collections of result by the value of field resourceId"
     }
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     [
     {
       "dataVersion" : "sample dataVersion",
       "id" : "sample id",
       "resourceId" : "sample resourceId"
     }
     ]
     */
    this.getResourceVersions = function (config) {
      var url = endpoint + '/resourceVersions/';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Adds a ResourceVersion
     *
     * @param body - the payload; is of type ResourceVersion; has the following structure:
     {
       "dataVersion" : "sample dataVersion",
       "id" : "sample id",
       "resourceId" : "sample resourceId"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "dataVersion" : "sample dataVersion",
       "id" : "sample id",
       "resourceId" : "sample resourceId"
     }
     */
    this.postResourceVersions = function (body, config) {
      var url = endpoint + '/resourceVersions/';

      return send('POST', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Loads a ResourceVersion
     *
     * @param resourceVersionid - REQUIRED - Identifier of the ResourceVersion
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "dataVersion" : "sample dataVersion",
       "id" : "sample id",
       "resourceId" : "sample resourceId"
     }
     */
    this.getResourceVersionsResourceVersionid = function (resourceVersionid, config) {
      checkPathVariables(resourceVersionid, 'resourceVersionid');

      var url = endpoint + '/resourceVersions/' + resourceVersionid + '';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Stores a ResourceVersion
     *
     * @param resourceVersionid - REQUIRED - Identifier of the ResourceVersion
     * @param body - the payload; is of type ResourceVersion; has the following structure:
     {
       "dataVersion" : "sample dataVersion",
       "id" : "sample id",
       "resourceId" : "sample resourceId"
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "dataVersion" : "sample dataVersion",
       "id" : "sample id",
       "resourceId" : "sample resourceId"
     }
     */
    this.putResourceVersionsResourceVersionid = function (resourceVersionid, body, config) {
      checkPathVariables(resourceVersionid, 'resourceVersionid');

      var url = endpoint + '/resourceVersions/' + resourceVersionid + '';

      return send('PUT', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Deletes a ResourceVersion
     *
     * @param resourceVersionid - REQUIRED - Identifier of the ResourceVersion
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     */
    this.deleteResourceVersionsResourceVersionid = function (resourceVersionid, config) {
      checkPathVariables(resourceVersionid, 'resourceVersionid');

      var url = endpoint + '/resourceVersions/' + resourceVersionid + '';

      return send('DELETE', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Loads a list of SurveySection
     *
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     {
       "questionIds" : "Allows to filter the collections of result by the value of field questionIds",
       "$sort" : "Order in which to retrieve the results. Multiple sort criteria can be passed. Example: sort=age ASC,height DESC",
       "heading" : "Allows to filter the collections of result by the value of field heading",
       "id" : "Allows to filter the collections of result by the value of field id",
       "$size" : "Size of the page to retrieve. Integer value",
       "introductionMessage" : "Allows to filter the collections of result by the value of field introductionMessage",
       "$page" : "Number of the page to retrieve. Integer value."
     }
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     [
     {
       "heading" : "sample heading",
       "id" : "sample id",
       "introductionMessage" : "sample introductionMessage",
       "questionIds" : [ "sample questionIds" ]
     }
     ]
     */
    this.getSurveySections = function (config) {
      var url = endpoint + '/surveySections/';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Adds a SurveySection
     *
     * @param body - the payload; is of type SurveySection; has the following structure:
     {
       "heading" : "sample heading",
       "id" : "sample id",
       "introductionMessage" : "sample introductionMessage",
       "questionIds" : [ "sample questionIds" ]
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "heading" : "sample heading",
       "id" : "sample id",
       "introductionMessage" : "sample introductionMessage",
       "questionIds" : [ "sample questionIds" ]
     }
     */
    this.postSurveySections = function (body, config) {
      var url = endpoint + '/surveySections/';

      return send('POST', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Loads a SurveySection
     *
     * @param surveySectionid - REQUIRED - Identifier of the SurveySection
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "heading" : "sample heading",
       "id" : "sample id",
       "introductionMessage" : "sample introductionMessage",
       "questionIds" : [ "sample questionIds" ]
     }
     */
    this.getSurveySectionsSurveySectionid = function (surveySectionid, config) {
      checkPathVariables(surveySectionid, 'surveySectionid');

      var url = endpoint + '/surveySections/' + surveySectionid + '';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Stores a SurveySection
     *
     * @param surveySectionid - REQUIRED - Identifier of the SurveySection
     * @param body - the payload; is of type SurveySection; has the following structure:
     {
       "heading" : "sample heading",
       "id" : "sample id",
       "introductionMessage" : "sample introductionMessage",
       "questionIds" : [ "sample questionIds" ]
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "heading" : "sample heading",
       "id" : "sample id",
       "introductionMessage" : "sample introductionMessage",
       "questionIds" : [ "sample questionIds" ]
     }
     */
    this.putSurveySectionsSurveySectionid = function (surveySectionid, body, config) {
      checkPathVariables(surveySectionid, 'surveySectionid');

      var url = endpoint + '/surveySections/' + surveySectionid + '';

      return send('PUT', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Deletes a SurveySection
     *
     * @param surveySectionid - REQUIRED - Identifier of the SurveySection
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     */
    this.deleteSurveySectionsSurveySectionid = function (surveySectionid, config) {
      checkPathVariables(surveySectionid, 'surveySectionid');

      var url = endpoint + '/surveySections/' + surveySectionid + '';

      return send('DELETE', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Loads a list of Survey
     *
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     {
       "$sort" : "Order in which to retrieve the results. Multiple sort criteria can be passed. Example: sort=age ASC,height DESC",
       "introductionMessage" : "Allows to filter the collections of result by the value of field introductionMessage",
       "$page" : "Number of the page to retrieve. Integer value.",
       "$size" : "Size of the page to retrieve. Integer value",
       "sectionIds" : "Allows to filter the collections of result by the value of field sectionIds",
       "id" : "Allows to filter the collections of result by the value of field id",
       "completionMessage" : "Allows to filter the collections of result by the value of field completionMessage"
     }
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     [
     {
       "completionMessage" : "sample completionMessage",
       "id" : "sample id",
       "introductionMessage" : "sample introductionMessage",
       "sectionIds" : [ "sample sectionIds" ]
     }
     ]
     */
    this.getSurveys = function (config) {
      var url = endpoint + '/surveys/';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Adds a Survey
     *
     * @param body - the payload; is of type Survey; has the following structure:
     {
       "completionMessage" : "sample completionMessage",
       "id" : "sample id",
       "introductionMessage" : "sample introductionMessage",
       "sectionIds" : [ "sample sectionIds" ]
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "completionMessage" : "sample completionMessage",
       "id" : "sample id",
       "introductionMessage" : "sample introductionMessage",
       "sectionIds" : [ "sample sectionIds" ]
     }
     */
    this.postSurveys = function (body, config) {
      var url = endpoint + '/surveys/';

      return send('POST', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Loads a Survey
     *
     * @param surveyid - REQUIRED - Identifier of the Survey
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "completionMessage" : "sample completionMessage",
       "id" : "sample id",
       "introductionMessage" : "sample introductionMessage",
       "sectionIds" : [ "sample sectionIds" ]
     }
     */
    this.getSurveysSurveyid = function (surveyid, config) {
      checkPathVariables(surveyid, 'surveyid');

      var url = endpoint + '/surveys/' + surveyid + '';

      return send('GET', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    /**
     * Stores a Survey
     *
     * @param surveyid - REQUIRED - Identifier of the Survey
     * @param body - the payload; is of type Survey; has the following structure:
     {
       "completionMessage" : "sample completionMessage",
       "id" : "sample id",
       "introductionMessage" : "sample introductionMessage",
       "sectionIds" : [ "sample sectionIds" ]
     }
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     *   * Status code : 200 - Payload :
     {
       "completionMessage" : "sample completionMessage",
       "id" : "sample id",
       "introductionMessage" : "sample introductionMessage",
       "sectionIds" : [ "sample sectionIds" ]
     }
     */
    this.putSurveysSurveyid = function (surveyid, body, config) {
      checkPathVariables(surveyid, 'surveyid');

      var url = endpoint + '/surveys/' + surveyid + '';

      return send('PUT', url, addSecurityConfiguration(config, 'HTTP_BASIC'), body);
    };

    /**
     * Deletes a Survey
     *
     * @param surveyid - REQUIRED - Identifier of the Survey
     * @param config - Object describing the request to be made and how it should be processed. The object has following properties:
     * @param config.params - Map of strings or objects which will be serialized with the paramSerializer and appended as query parameters.
     * @param config.headers - Map of strings or functions which return strings representing HTTP headers to send to the server.
     *
     * @throws will throw an error if a required parameter is not set
     *
     * @returns {HttpPromise} - a promise resolved with the response from the server.
     * In case of success (status in the 2XX range)
     */
    this.deleteSurveysSurveyid = function (surveyid, config) {
      checkPathVariables(surveyid, 'surveyid');

      var url = endpoint + '/surveys/' + surveyid + '';

      return send('DELETE', url, addSecurityConfiguration(config, 'HTTP_BASIC'));
    };

    function configureHTTP_BASICAuthentication(username, key) {
      securityConfigurations.HTTP_BASIC = {
        type: 'BASIC',
        token: 'Basic ' + btoa(username + ':' + key)
      };
    }

    function isNotAuthenticated (securityRequirementName) {
      return securityRequirementName === '_NONE';
    }

    /**
     * Enhances the provided request configuration with the configured
     * security requirements.
     *
     * One might notice that the security requirements are not explicitly defined
     * in the method signature. The reason is that one method might have zero,
     * one or more security requirement(s), so security requirements are recovered
     * dynamically from the `arguments`.
     *
     * The security configuration is defined as follow:
     *  - If no specific security requirements is defined for the method then:
     *    - if a global security is set the call will be authenticated
     *    - if no security is configured then the call will be unauthenticated
     *  - If a specific security requirements is defined for the method then:
     *    - one of them is configured and the first of them is used for the authentication
     *    - none of them is configured and an error is thrown
     *
     * @param {Object} config - a configuration object used inside the requests
     * which can contain among other things the headers & the params
     * @param {String...} requirement - the name of the security scheme to support
     */
    function addSecurityConfiguration (config) {
      var securityRequirements = Array.prototype.slice.call(arguments, 1);

      return securityConfigurationHelper(config, globalSecurity,
        securityConfigurations, isNotAuthenticated, 
        securityRequirements);
    }

    /**
     * Sends a request to server.
     *
     * @param methodName - The name of method: GET, POST, PUT, DELETE
     * @param url - url
     * @param body - body
     * @param config - Object describing the request to be made and how it should be processed.
     * @returns{HttpPromise} a promise object
     */
    function send (methodName, url, config, body) {
      return sendHelper ($http, methodName, url, config, body);
    };

    /**
     * Sets a new endpoint.
     *
     * @param newEndPoint - the endpoint to be set.
     */
    function setEndpoint (newEndPoint) {
      endpoint = newEndPoint;
    }
  }

  function securityConfigurationHelper (config, globalSecurity, 
    securityConfigurations, isNotAuthenticated, 
    securityRequirements) {
    
    if (securityRequirements.length === 0) {
      return enhanceWithGlobalSecurityIfRequired(config, globalSecurity);
    }

    for (var i = 0; i < securityRequirements.length; i++) {
      var securityRequirementName = securityRequirements[i];
      var securityConfig = securityConfigurations[securityRequirementName];

      if (isNotAuthenticated(securityRequirementName)) {
        return angular.copy(config);
      } else if (angular.isDefined(securityConfig)) {
        return enhanceConfigurationWithSpecificSecurity(config, securityConfig);
      }
    }

    throw new Error('There is no configured security scheme found among: ' + securityRequirements.join(', '));
  }

  function enhanceWithGlobalSecurityIfRequired (config, globalSecurity) {
    if (!isEmpty(globalSecurity)) {
      config = angular.copy(config);
      config = enhanceConfigurationWithSpecificSecurity(config, globalSecurity);
    }

    return config;
  }

  function enhanceConfigurationWithSpecificSecurity (config, securityConfig) {
    config = angular.copy(config) || {};

    if (!config.headers) {
      config.headers = {};
    }

    if (!config.params) {
      config.params = {};
    }

    if (securityConfig.type === 'BASIC') {
      config.headers.Authorization = securityConfig.token;
    } else if (securityConfig.type === 'API_KEY' && securityConfig.placement === 'HEADER') {
      config.headers[securityConfig.name] = securityConfig.token;
    } else if (securityConfig.type === 'API_KEY' && securityConfig.placement === 'QUERY') {
      config.params[securityConfig.name] = securityConfig.token;
    } else if (securityConfig.type === 'OAUTH2') {
      config.headers.Authorization = securityConfig.token;
    } else {
      throw new Error('Cannot update config for unknown scheme');
    }

    return config;
  }

  /**
   * Validates the path variables to ensure that those are properly defined
   * since any variable defined in the path should be defined to avoid having
   * something like '/foo/undefined/bar'
   *
   * The arguments are dynamically recovered from the `arguments` object and
   * are looked for by pair where
   *   - the 2n set (even indexes) are the values
   *   - the 2n + 1 set (odd indexes) are the labels for the error reports
   */
  function checkPathVariables () {

    var errors = [];

    for (var i = 0; i < arguments.length; i += 2) {
      if (angular.isUndefined(arguments[ i ])) {
        errors.push(arguments[ i + 1 ]);
      }
    }

    if (errors.length > 0) {
      throw new Error('Missing required parameter: ' + errors.join(', '));
    }
  };

  /**
   * Sets up the authentication to be performed through basic auth.
   *
   * @param username - the user's username
   * @param password - the user's password
   */
  function configureGlobalBasicAuthentication (globalSecurity) {
    return function (username, password) {
      globalSecurity.type = 'BASIC';
      globalSecurity.token = 'Basic ' + btoa(username + ':' + password);
    };
  };

  /**
   * Sets up the authentication to be performed through oAuth2 protocol
   * meaning that the Authorization header will contain a Bearer token.
   *
   * @param token - the oAuth token to use
   */
  function configureGlobalOAuth2Token (globalSecurity) {
    return function (token) {
      globalSecurity.type = 'OAUTH2';
      globalSecurity.token = 'Bearer ' + token;
    };
  };

  /**
   * Sets up the authentication to be performed through API token.
   *
   * @param tokenName - the name of the query parameter or header based on the location parameter.
   * @param tokenValue - the value of the token.
   * @param location - the location of the token, either header or query.
   */
  function configureGlobalApiToken (globalSecurity) {
    return function (tokenName, tokenValue, location) {
      if (angular.isUndefined(location)) {
        location = 'header';
      }

      if (location !== 'header' && location !== 'query') {
        throw new Error('Unknown location: ' + location);
      }

      globalSecurity.type = 'API_KEY';
      globalSecurity.placement = location;
      globalSecurity.name = tokenName;
      globalSecurity.token = tokenValue;
    };
  };

  /**
   * Sends a request to server.
   *
   * @param $http - the angular $http provider
   * @param methodName - The name of method: GET, POST, PUT, DELETE
   * @param url - url
   * @param body - body
   * @param config - Object describing the request to be made and how it should be processed.
   * @returns{HttpPromise} a promise object
   */
  function sendHelper ($http, methodName, url, config, body) {

    config = config || {};

    return $http({
      method: methodName,
      url: url,
      params: angular.extend({}, config.params),
      data: body,
      headers: angular.extend({}, config.headers)
    });
  };

  function isEmpty (obj) {
    return Object.keys(obj).length === 0;
  }

})();