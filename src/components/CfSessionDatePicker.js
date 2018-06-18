/**
 * Component for selecting date from month for selecting sessions from.
 *
 * @since [*next-version*]
 *
 * @param {CreateDatetimeCapable} CreateDatetimeCapable Mixin that provides ability to work with datetime.
 * @param {{
 *  sessionTime: (string), // How to format session time,
 *  dayFull: (string), // How to format day for day heading,
 *  dayShort: (string), // How to format day for sessions,
 * }} dateFormats Map of date formats for formatting dates in UI.
 *
 * @return {object}
 */
export default function (CreateDatetimeCapable, dateFormats) {
  return {
    template: '#session-date-picker-template',

    mixins: [ CreateDatetimeCapable ],

    inject: {
      /**
       * Datepicker component, used for selecting month and day.
       *
       * @since [*next-version*]
       */
      'datepicker': 'datepicker',
    },

    data () {
      return {
        /**
         * @since [*next-version*]
         *
         * @property {String|null} selectedMonth Month that is selected in datepicker.
         */
        selectedMonth: null,
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

      /**
       * @since [*next-version*]
       *
       * @property {Boolean} loading Is sessions information for month are loading right now.
       */
      loading: {
        default: null
      },

      /**
       * @since [*next-version*]
       *
       * @property {object|null} selectedSessionLength Selected session length object.
       */
      selectedSessionLength: {
        default: null
      },

      /**
       * @since [*next-version*]
       *
       * @property {object[]} sessions List of all sessions available for current month.
       */
      availableSessions: {
        default () {
          return []
        }
      },

      /**
       * @since [*next-version*]
       *
       * @property {BookingSession[]} value Session list for selected day, `v-model` in parent
       */
      value: {},
    },

    watch: {
      /**
       * Update sync properties once selected day is changed.
       *
       * @since [*next-version*]
       *
       * @param value
       */
      selectedDay (value) {
        this.$emit('input', this.getSessionsForDay(value))
        this.$emit('update:nextAvailableDay', this.getNextAvailableDay(value))
        this.$emit('update:prevAvailableDay', this.getPrevAvailableDay(value))
      }
    },

    computed: {
      /**
       * Proxy for component's model field.
       *
       * @since [*next-version*]
       *
       * @property {object|null} value Selected day, `v-model` in parent
       */
      selectedDayProxy: {
        get () {
          return this.selectedDay
        },
        set (value) {
          this.$emit('update:selectedDay', value)
        }
      },

      /**
       * Computed property that maps days (string) to sessions (array of sessions).
       *
       * @since [*next-version*]
       *
       * @property {object} Map of dates and corresponding sessions for each of them.
       */
      daysWithSessions () {
        let daysWithSessions = {}

        const sessions = this.availableSessions
          .filter(session => session.duration === this.selectedSessionLength.sessionLength)

        for (let session of sessions) {
          const dayKey = this._getDayKey(session.start)
          if (!daysWithSessions[dayKey]) {
            daysWithSessions[dayKey] = []
          }
          daysWithSessions[dayKey].push(session)
        }
        return daysWithSessions
      },

      /**
       * List of available days with sessions.
       *
       * @since [*next-version*]
       *
       * @property {string[]}
       */
      availableDays () {
        return Object.keys(this.daysWithSessions)
      },

      /**
       * The current day to disable datepicker to it.
       *
       * @since [*next-version*]
       *
       * @property {Date}
       */
      currentDay () {
        return this.createLocalDatetime().startOf('day').toDate()
      },
    },

    methods: {
      /**
       * Event listener, fired on month change.
       *
       * @since [*next-version*]
       *
       * @param {Date} newMonth Newly selected month.
       */
      onMonthChange (newMonth) {
        this.selectedMonth = newMonth
        this.$emit('changedMonth', newMonth)
      },

      /**
       * Session list for selected day
       *
       * @since [*next-version*]
       *
       * @return {object[]}
       */
      getSessionsForDay (day) {
        let selectedDaySessions = []
        if (day) {
          selectedDaySessions = this.daysWithSessions[this._getDayKey(day)] || []
        }
        return selectedDaySessions
      },

      /**
       * Get the closest next available day with sessions.
       *
       * @since [*next-version*]
       *
       * @property {string|null} day Day for which get sessions.
       *
       * @return {string} The closest next available day with sessions.
       */
      getNextAvailableDay (day) {
        const selectedDayIndex = this.availableDays.indexOf(this._getDayKey(day))
        const availableDaysCount = this.availableDays.length
        let result = null
        if (availableDaysCount - 1 !== selectedDayIndex) {
          result = this.createLocalDatetime(this.availableDays[selectedDayIndex + 1]).format()
        }
        return result
      },

      /**
       * Get the closest previous available day with sessions.
       *
       * @since [*next-version*]
       *
       * @property {string|null} day Day for which get sessions.
       *
       * @return {string} The closest previous available day with sessions.
       */
      getPrevAvailableDay (day) {
        const selectedDayIndex = this.availableDays.indexOf(this._getDayKey(day))
        let result = null
        if (selectedDayIndex !== 0) {
          result = this.createLocalDatetime(this.availableDays[selectedDayIndex - 1]).format()
        }
        return result
      },

      /**
       * Check that given date is disabled in datepicker.
       *
       * @since [*next-version*]
       *
       * @param {Date} date Date in datepicker to check.
       *
       * @return {boolean} Is given date is disabled.
       */
      isDateDisabled (date) {
        if (this.loading) {
          return true
        }
        const dateKey = this._getDayKey(date)
        return Object.keys(this.daysWithSessions).indexOf(dateKey) === -1
      },

      /**
       * Get day key for given datetime. It will be used as as key for sessions.
       *
       * @since [*next-version*]
       *
       * @param {string|Date} value Value to get day key from.
       *
       * @return {string} Day key.
       */
      _getDayKey (value) {
        return this.createLocalDatetime(value).format(dateFormats.dayKey)
      }
    },

    components: {
      'datepicker': 'datepicker'
    }
  }
}