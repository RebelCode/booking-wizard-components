/**
 * Booking session object.
 *
 * @typedef {Object} BookingSession
 *
 * @property {Number} duration Session duration in seconds
 * @property {Number} startUnix Session start time in unix timestamp
 * @property {Number} endUnix Session end time in unix timestamp
 * @property {String} start Session start time in ISO8601
 * @property {String} end Session end time in ISO8601
 * @property {Number} service Session's service ID
 * @property {Number} resource Session's resource id
 */

/**
 * Object that represents range for booking sessions.
 *
 * @typedef {Object} BookingSessionsRange
 *
 * @param {Number} service Service ID.
 * @param {String} start Range start datetime in ISO8601.
 * @param {String} end Range end datetime in ISO8601
 */