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
      },

      /**
       * Function for creating moment object in local timezone.
       *
       * @since [*next-version*]
       *
       * @param {CreateLocalDatetimeFunction} createLocalDatetime
       */
      createLocalDatetime: {
        default () {
          return (value = null) => {
            if (!value) {
              value = moment()
            }
            return this.createDatetime(value, this.timezone)
          }
        }
      },

      /**
       * Function for creating date strings.
       *
       * @since [*next-version*]
       *
       * @param {CreateDateStringFunction} createDateString
       */
      createDateString: {
        default () {
          return (value) => {
            return moment(value).format('YYYY-MM-DD')
          }
        }
      }
    }
  }
}