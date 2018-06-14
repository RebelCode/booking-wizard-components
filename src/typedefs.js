/**
 * Booking session object.
 *
 * @typedef {Object} BookingSession
 *
 * @property {number} duration Session duration in seconds
 * @property {string} start Session start datetime in ISO8601 format
 * @property {string} end Session start datetime in ISO8601 format
 * @property {number} service Session's service ID
 * @property {number} resource Session's resource ID
 */

/**
 * Booking session object in API store, available for querying.
 *
 * @typedef {BookingSession} BookingStoredSession
 *
 * @property {number} startUnix Session start time in unix timestamp
 */

/**
 * Object that represents range for booking sessions.
 *
 * @typedef {Object} BookingSessionsRange
 *
 * @param {number} service Service ID.
 * @param {string} start Range start datetime in ISO8601.
 * @param {string} end Range end datetime in ISO8601
 */

/**
 * Function for creating datetime in some timezone.
 *
 * @function CreateDatetimeFunction
 *
 * @param {string|Date} value Any value that should be used for creating date.
 * @param {string} timezone Timezone in which date should be created
 */