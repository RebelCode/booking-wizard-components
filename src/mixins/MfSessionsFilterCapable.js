export default function MfSessionsFilterCapable () {
  return {
    inject: [
      'humanizeDuration'
    ],
    data () {
      return {
        /**
         * @since [*next-version*]
         *
         * @property {object} sessionFilters List of filter values applied to the sessions list.
         */
        filter: {
          duration: null,
          staffMember: null
        }
      }
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
          this.$nextTick(() => {
            for (const key of Object.keys(this.filter)) {
              if (!this[`${key}FilterValues`]) {
                continue
              }
              this.filter[key] = Object.keys(this[`${key}FilterValues`])[0]
            }
          })
        }
      },

      /**
       * Unselect day and session when filter is changed.
       *
       * @since [*next-version*]
       */
      filter: {
        deep: true,
        handler () {
          this.session = null
          this.selectedDay = null
        }
      },
    },
    computed: {
      /**
       * @var {number|boolean} selectedSessionDuration Selected session duration.
       *
       * @since [*next-version*]
       */
      selectedSessionDuration () {
        if (!this.filter.duration) {
          return false
        }
        const selectedSession = this.service.sessionTypes.find(sessionType => sessionType.id === this.filter.duration)
        return selectedSession ? selectedSession.data.duration : false
      },

      /**
       * @var {object<string, string>} durationFilterValues List of values for session duration.
       *
       * @since [*next-version*]
       */
      durationFilterValues () {
        const sessionTypeLabel = sessionType => {
          const duration = this.humanizeDuration(sessionType.data.duration * 1000, {
            units: ['w', 'd', 'h', 'm'],
            round: true
          })
          return !!sessionType.label ? `${sessionType.label} (${duration})` : duration
        }

        return this.service.sessionTypes.reduce((acc, sessionType) => {
          acc[sessionType.id] = sessionTypeLabel(sessionType)
          return acc
        }, {})
      },

      /**
       * @var {BookingSession[]} filteredSessions List of sessions that passes all filters.
       *
       * @since [*next-version*]
       */
      filteredSessions () {
        return this.sessions.filter(session => {
          return Object.keys(this.filter).reduce((acc, key) => {
            return acc && (!!this.filter[key] ? this[`${key}FilterPassed`](session) : true)
          }, true)
        })
      }
    },
    methods: {
      /**
       * Check whether the session passes the duration filter.
       *
       * @since [*next-version*]
       *
       * @param {BookingSession} session Session to check.
       *
       * @return {boolean} Whether the session passes the duration filter.
       */
      durationFilterPassed (session) {
        return session.duration === this.selectedSessionDuration
      },

      /**
       * Check whether the session passes the staff member filter.
       *
       * @since [*next-version*]
       *
       * @param {BookingSession} session Session to check.
       *
       * @return {boolean} Whether the session passes the staff member filter.
       */
      staffMemberFilterPassed (session) {
        return true
      },

      /**
       * Select filters that correspond to given session for given service.
       *
       * @since [*next-version*]
       *
       * @param {BookingSession} session
       */
      selectFilters (session) {
        for (const key of Object.keys(this.filter)) {
          if (!this[`${key}FilterValues`] || !this[`${key}FilterValues`].length) {
            continue
          }
          // this.filter[key] = Object.keys(this[`${key}FilterValues`]).find(value => this[`${key}FilterPassed`](session))
        }
      }
    }
  }
}
