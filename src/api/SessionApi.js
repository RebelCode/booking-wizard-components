import { Api } from '@rebelcode/std-lib'

export default class SessionsApi extends Api {
  /**
   * Storing all sessions to work correctly with range caching system.
   *
   * @type {BookingStoredSession[]}
   */
  sessions = []

  /**
   * Api constructor
   *
   * @param {HttpClient} httpClient Http client like axios
   * @param {Object<string, {method: String, endpoint: String}>} config
   * @param {RequestCache} cache Requests caching implementation.
   * @param {RangeCache} rangeCache Range cache implementation.
   * @param {Transformer} sessionReadTransformer Session read transformer.
   * @param {Function} moment Moment JS.
   */
  constructor (httpClient, config, cache, rangeCache, sessionReadTransformer, moment) {
    super(httpClient, config, cache)

    this.rangeCache = rangeCache
    this.sessionReadTransformer = sessionReadTransformer
    this.moment = moment
  }

  /**
   * Fetch session list using search query
   *
   * @param params
   *
   * @return {*}
   */
  fetch (params) {
    const uncachedRange = this.rangeCache.getUncachedRange(params)
    if (!uncachedRange) {
      return Promise.resolve(this._getSessions(params))
    }

    const fetchConfig = this.config['fetch']
    return this.http.request({
      method: fetchConfig.method,
      url: fetchConfig.endpoint,
      params
    }).then(response => {
      this.rangeCache.remember(uncachedRange)
      const sessions = response.data.items.map(session => {
        return this.sessionReadTransformer.transform(session)
      })
      this._storeSessions(sessions)
      return sessions
    })
  }

  /**
   * Get sessions by given params.
   *
   * @param {number} service Service id to get sessions for
   * @param {string} start Start range in ISO8601 format
   *
   * @return {BookingSession[]}
   */
  _getSessions({ service, start }) {
    start = this.moment(start).unix()
    return this.sessions.filter(session => {
      return session.service === service
        && session.startUnix >= start
    }).map(this._cleanSessionQueryFields.bind(this))
  }

  /**
   * Store sessions in one place.
   *
   * @param {BookingSession[]} sessions
   */
  _storeSessions(sessions) {
    this.sessions = [...this.sessions, ...sessions.map(this._addSessionQueryFields.bind(this))]
  }

  /**
   * Add helping fields on session before saving it to store.
   *
   * @param {BookingSession} session Session to save in store.
   *
   * @return {BookingStoredSession} Session with added fields.
   */
  _addSessionQueryFields (session) {
    session = Object.assign({}, session)
    session['startUnix'] = this.moment(session.start).unix()
    return session
  }

  /**
   * Remove fields that were added for saving booking session in store.
   *
   * @param {BookingStoredSession} session Session from store.
   *
   * @return {BookingSession} Booking session without querying fields.
   */
  _cleanSessionQueryFields (session) {
    session = Object.assign({}, session)
    delete session['startUnix']
    return session
  }
}
