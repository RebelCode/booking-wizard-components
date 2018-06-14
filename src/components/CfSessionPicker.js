/**
 * Component for selecting booking sessions with needed duration.
 *
 * @since [*next-version*]
 *
 * @param {moment} moment MomentJS.
 * @param {{
 *  sessionTime: (string), // How to format session time,
 *  dayFull: (string), // How to format day for day heading,
 *  dayShort: (string), // How to format day for sessions,
 * }} dateFormats Map of date formats for formatting dates in UI.
 *
 * @return {object}
 */
export default function CfSessionPicker (moment, dateFormats) {
  return {
    template: '#session-picker-template',

    inject: {
      /**
       * Function for transforming duration in seconds to human readable format.
       *
       * @since [*next-version*]
       */
      'humanizeDuration': 'humanizeDuration',

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

    data () {
      return {
        /**
         * @since [*next-version*]
         *
         * @property {object|null} selectedSessionLength Selected session length object.
         */
        selectedSessionLength: null,
      }
    },

    props: {
      /**
       * @since [*next-version*]
       *
       * @property {String|null} selectedDay Selected day to show sessions from.
       */
      selectedDay: {
        default: null
      },

      /**
       * Waiting for this structure:
       * {
         *  `id`: Number, // service ID
         *  `sessionLengths`: Array of {
         *    `sessionLength`: Number // session duration in seconds
         *  }
         * }
       * @since [*next-version*]
       *
       * @property {object|null} service Selected service to choose sessions for.
       */
      service: {
        type: Object
      },

      /**
       * @since [*next-version*]
       *
       * @property {object[]} Array of sessions for current day.
       */
      sessions: {
        default () {
          return []
        }
      },

      /**
       * @since [*next-version*]
       *
       * @property {string|null} timezone Name of timezone in which sessions will be displayed.
       */
      timezone: {
        default: null
      },

      /**
       * @since [*next-version*]
       *
       * @property {object|null} value Selected session, `v-model` in parent
       */
      value: {},

      /**
       * The previous closest available day with sessions.
       *
       * @since [*next-version*]
       *
       * @property {string|null}
       */
      prevAvailableDay: {
        default: null
      },

      /**
       * The next closest available day with sessions.
       *
       * @since [*next-version*]
       *
       * @property {string|null}
       */
      nextAvailableDay: {
        default: null
      },
    },

    watch: {
      /**
       * Watch by `service` property change and, if it's changed, select first available
       * session length. `immediate` option fire this watcher on component mount.
       *
       * @since [*next-version*]
       */
      service: {
        immediate: true,
        handler () {
          this.selectedSessionLength = this.service.sessionLengths[0]
        }
      }
    },

    computed: {
      /**
       * Sessions that matches selected duration
       *
       * @since [*next-version*]
       *
       * @return {object[]}
       */
      visibleSessions () {
        return this.sessions.filter((session) => {
          return session.duration === this.selectedSessionLength.sessionLength
        })
      },

      /**
       * Formatted day label for selected day row.
       *
       * @since [*next-version*]
       *
       * @property {string}
       */
      selectedDayLabel () {
        return this.createLocalDatetime(this.selectedDay).format(dateFormats.dayFull)
      },

      /**
       * Formatted day label for session selection row.
       *
       * @since [*next-version*]
       *
       * @property {string}
       */
      selectedDaySessionsLabel () {
        return this.createLocalDatetime(this.selectedDay).format(dateFormats.dayShort)
      },
    },

    methods: {
      /**
       * Get string representation of session duration.
       *
       * @since [*next-version*]
       *
       * @param {object} sessionLength Session length.
       *
       * @return {string} String representing duration, human readable.
       */
      sessionLengthLabel (sessionLength) {
        return this.humanizeDuration(sessionLength.sessionLength * 1000, {
          units: ['w', 'd', 'h', 'm'],
          round: true
        })
      },

      /**
       * Session label for representing session in UI.
       *
       * @since [*next-version*]
       *
       * @param {object} session Session object to get label for.
       *
       * @return {*}
       */
      sessionLabel (session) {
        return this.createLocalDatetime(session.start).format(dateFormats.sessionTime)
      },

      /**
       * Check that session is currently selected session.
       *
       * @since [*next-version*]
       *
       * @param {object} session Session to check.
       *
       * @return {boolean}
       */
      isSelected (session) {
        return this.value
          && this.value.start === session.start
          && this.value.end === session.end
          && this.value.resource === session.resource
      },

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

      /**
       * Select session.
       *
       * @since [*next-version*]
       *
       * @param {object} session
       */
      select (session) {
        this.$emit('input', session)
      },

      /**
       * Navigate to the nearest previous day with available sessions.
       *
       * @since [*next-version*]
       */
      goToPrevDay () {
        this.$emit('update:selectedDay', this.prevAvailableDay)
      },

      /**
       * Navigate to the nearest next day with available sessions.
       *
       * @since [*next-version*]
       */
      goToNextDay () {
        this.$emit('update:selectedDay', this.nextAvailableDay)
      },

      /**
       * Remove selected day value.
       *
       * @since [*next-version*]
       */
      unselectDay () {
        this.$emit('update:selectedDay', null)
      }
    }
  }
}
  