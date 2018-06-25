/**
 * Component for selecting available booking session for given service.
 *
 * @usage
 * `<service-session-selector :service="service" v-model="session"></service-session-selector>`
 *
 * @since [*next-version*]
 *
 * @param {CreateDatetimeCapable} CreateDatetimeCapable Mixin that provides ability to work with datetime.
 * @param {SessionsApi} sessionsApi Session API wrapper, used for querying sessions.
 * @param {{
 *  dayKey: (string), // How to format day as a key,
 *  sessionTime: (string), // How to format session time,
 *  dayFull: (string), // How to format day for day heading,
 * }} dateFormats Map of date formats for formatting dates in UI.
 *
 * @return {object}
 */
export default function CfServiceSessionSelector (CreateDatetimeCapable, sessionsApi, dateFormats) {
  return {
    template: '#service-session-selector-template',

    mixins: [ CreateDatetimeCapable ],

    inject: {
      /**
       * Session length picker component, allows to select session.
       *
       * @since [*next-version*]
       */
      'session-time-picker': 'session-time-picker',

      /**
       * Date picker component, allows to select date of month.
       *
       * @since [*next-version*]
       */
      'session-date-picker': 'session-date-picker',

      /**
       * Session duration picker component, allows to select session duration.
       *
       * @since [*next-version*]
       */
      'session-duration-picker': 'session-duration-picker',

      /**
       * Date navigation component, for switching between days.
       *
       * @since [*next-version*]
       */
      'date-navigator': 'date-navigator',

      /**
       * Session transformer for transforming sessions for interacting with them in the UI.
       *
       * @since [*next-version*]
       */
      'sessionReadTransformer': 'sessionReadTransformer'
    },
    data () {
      return {
        /**
         * @since [*next-version*]
         *
         * @property {String|null} selectedDay Selected day to show sessions from.
         */
        selectedDay: null,

        /**
         * @since [*next-version*]
         *
         * @property {object[]} sessions List of sessions for current month.
         */
        sessions: [],

        /**
         * @since [*next-version*]
         *
         * @property {Boolean} isSessionsLoading Is sessions are loading right now.
         */
        isSessionsLoading: false,

        /**
         * @since [*next-version*]
         *
         * @property {Boolean} isEditing Is selector in edit mode now.
         */
        isEditing: false,

        /**
         * @since [*next-version*]
         *
         * @property {object} preloadedSession Session that was chosen when component was created.
         */
        preloadedSession: null,

        /**
         * The previous closest available day with sessions.
         *
         * @since [*next-version*]
         *
         * @property {string|null}
         */
        prevAvailableDay: null,

        /**
         * The next closest available day with sessions.
         *
         * @since [*next-version*]
         *
         * @property {string|null}
         */
        nextAvailableDay: null,

        /**
         * Session list for selected day
         *
         * @since [*next-version*]
         *
         * @property {BookingSession[]}
         */
        selectedDaySessions: [],

        /**
         * @since [*next-version*]
         *
         * @property {object} sessionDuration Selected session duration
         */
        sessionDuration: null,
      }
    },
    watch: {
      /**
       * Watch by `service` property change and, if it's changed, refresh all selected values.
       * `immediate` option fire this watcher on component mount.
       *
       * @since [*next-version*]
       */
      service: {
        immediate: true,
        handler () {
          this.sessionDuration = null
          this.$nextTick(this._setCleanStateValues)
        }
      },

      /**
       * Watch for selected sessions change, and if selected session duration is 1 day or more,
       * and day have only one session, select that session.
       *
       * @since [*next-version*]
       *
       * @param {BookingSession[]} sessions List of sessions for selected day.
       */
      selectedDaySessions (sessions) {
        if (this.isDailyDuration && sessions.length === 1) {
          this.session = sessions[0]
        }
      }
    },
    props: {
      /**
       * @since [*next-version*]
       *
       * @property {BookableService|null} service Selected service to choose sessions for.
       */
      service: {
        default: null
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
      value: {}
    },
    computed: {
      /**
       * Computed proxy for model. This is used to allow child components
       * change value of parent's model.
       *
       * @since [*next-version*]
       *
       * @property {object}
       */
      session: {
        /**
         * Model getter.
         *
         * @since [*next-version*]
         *
         * @return {object}
         */
        get () {
          return this.value
        },

        /**
         * Setter for model.
         *
         * @since [*next-version*]
         *
         * @param {object} newValue
         */
        set (newValue) {
          this.$emit('input', newValue)
        }
      },

      /**
       * @since [*next-version*]
       *
       * @property {String} Label for describing selected session in human readable format.
       */
      selectedSessionLabel () {
        if (!this.value) {
          return null
        }
        const sessionStart = this.createLocalDatetime(this.value.start)
        return sessionStart.format(dateFormats.sessionTime) + ', ' + sessionStart.format(dateFormats.dayFull)
      },

      /**
       * Is selected session duration more or equal to day.
       *
       * @since [*next-version*]
       *
       * @return {boolean}
       */
      isDailyDuration () {
        if (!this.sessionDuration) {
          return false
        }
        return this.sessionDuration.sessionLength >= 86400
      }
    },
    /**
     * Hook that would be triggered when component is created. Here
     * we are checking if value is already set, and if so we are in the
     * edit mode.
     *
     * @since [*next-version*]
     */
    created () {
      if (this.value) {
        this.isEditing = true
        this.editSession()
      }
    },
    methods: {
      /**
       * When the picker in the edit mode (so session is preloaded), this allows
       * to edit that session time.
       *
       * @since [*next-version*]
       */
      editSession () {
        this.isSessionsLoading = true

        this.preloadedSession = this.sessionReadTransformer.transform(this.value)
        const sessionStart = this.createLocalDatetime(this.preloadedSession.start)

        this.selectedDay = sessionStart.toDate()
        this.sessionDuration = this.service.sessionLengths.find(sessionLength => {
          return sessionLength.sessionLength === this.preloadedSession.duration
        })

        this.loadSessions(sessionStart).then(() => {
          this.isEditing = false
        })
      },

      /**
       * Add preloaded session to all sessions to work with them.
       *
       * @since [*next-version*]
       *
       * @param {object} sessions All sessions.
       * @param {object} preloadedSession Session that was selected when picker was opened.
       *
       * @return {*}
       */
      _addPreloadedSession (sessions, preloadedSession = null) {
        if (!preloadedSession) {
          return sessions
        }

        const preselectedInFetched = sessions.find(session => {
          return this._sessionsIsSame(session, preloadedSession)
        })

        if (preselectedInFetched) {
          return sessions
        }

        sessions.push(preloadedSession)
        return sessions
      },

      /**
       * Check that sessions are the same.
       *
       * @since [*next-version*]
       *
       * @param {BookingSession} a First session to check
       * @param {BookingSession} b Second session to check
       *
       * @return {boolean}
       */
      _sessionsIsSame (a, b) {
        return a.service === b.service &&
          a.resource === b.resource &&
          a.start === b.start &&
          a.end === b.end
      },

      /**
       * Clean old values and set new, clean ones to select session.
       *
       * @since [*next-version*]
       */
      _setCleanStateValues () {
        if (this.isEditing) {
          return
        }

        this.selectedDay = null
        this.sessions = []

        this.$nextTick(() => {
          if (this.service) {
            this.loadSessions(this.createLocalDatetime().toDate())
          }
        })
      },

      /**
       * Load sessions from API for given month.
       *
       * @since [*next-version*]
       *
       * @param {Date} month Month for which sessions should be loaded.
       *
       * @return {Promise<any>}
       */
      loadSessions (month) {
        this.isSessionsLoading = true
        return sessionsApi.fetch(this._prepareSessionRequestParams(month)).then(sessions => {
          this.sessions = this._addPreloadedSession(sessions, this.preloadedSession)
          this.isSessionsLoading = false
        }, error => {
          console.error(error)
          this.isSessionsLoading = false
        })
      },

      /**
       * Get params for retrieving sessions for month.
       *
       * @since [*next-version*]
       *
       * @param {Date} month Month for which sessions should be loaded.
       *
       * @return {{service: Number, start: (string), end: (string)}}
       */
      _prepareSessionRequestParams (month) {
        const currentDay = this.createLocalDatetime()

        const firstDayOfMonth = this.createLocalDatetime(month).startOf('month')
        const lastDayOfMonth = this.createLocalDatetime(month).endOf('month')

        const start = (currentDay.isAfter(firstDayOfMonth) ? currentDay : firstDayOfMonth).startOf('day').format()
        const end = lastDayOfMonth.endOf('day').format()

        return {
          service: this.service.id,
          start,
          end
        }
      }
    },
    components: {
      'session-time-picker': 'session-time-picker',
      'session-duration-picker': 'session-duration-picker',
      'session-date-picker': 'session-date-picker',
      'date-navigator': 'date-navigator'
    }
  }
}
