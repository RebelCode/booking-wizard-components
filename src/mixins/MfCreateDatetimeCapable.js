/**
 * Create mixin that provides functionality to create datetimes.
 *
 * @since [*next-version*]
 *
 * @param {moment} moment Moment JS.
 *
 * @return {CreateDatetimeCapable}
 */
export default function MfCreateDatetimeCapable (moment) {
  return {
    inject: {
      /**
       * Function for creating moment instance in given timezone.
       *
       * @since [*next-version*]
       *
       * @property {CreateDatetimeFunction} createDatetime
       */
      createDatetime: {
        from: 'createDatetime',
        default () {
          return (value, timezone) => {
            return moment.tz(value, timezone || 'UTC')
          }
        }
      }
    },
    methods: {
      /**
       * Create moment object in local timezone.
       *
       * @param {moment|string|Date} value Datetime value that can be accepted by moment.
       *
       * @return {moment}
       */
      createLocalDatetime (value = null) {
        if (!value) {
          value = moment()
        }
        return this.createDatetime(value, this.timezone)
      },
    }
  }
}