/**
 * Filter for getting sessions using the duration.
 *
 * @since [*next-version*]
 */
export default {
  inject: [
    'humanizeDuration'
  ],
  watch: {
    /**
     * Watch for filter's value change and select first values for the next filters.
     *
     * @since [*next-version*]
     *
     * @param {string} newValue
     * @param {string} oldValue
     */
    'filter.duration' (newValue, oldValue) {
      if (this.isSeeding || !newValue || !oldValue) {
        return
      }
      const filtersAfterCurrent = this.filters.slice(this.filters.indexOf('duration') + 1)
      for (const key of filtersAfterCurrent) {
        this.filter[key] = Object.keys(this[`${key}FilterValues`])[0]
      }
    }
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
      if (!this.service) {
        return []
      }

      const sessionTypeLabel = sessionType => {
        const duration = this.humanizeDuration(sessionType.data.duration * 1000, {
          units: ['w', 'd', 'h', 'm'],
          round: true
        })
        return !!sessionType.label ? `${sessionType.label} (${duration})` : duration
      }

      return this.service.sessionTypes
        .filter(sessionType => this.filterAgainstPreviousFilters('duration', sessionType))
        .reduce((acc, sessionType) => {
          acc[sessionType.id] = sessionTypeLabel(sessionType)
          return acc
        }, {})
    },
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
     * Check whether the session satisfies filter value.
     *
     * @since [*next-version*]
     *
     * @param {string} filterValue
     * @param {BookingSession} session
     *
     * @return {boolean}
     */
    durationFilterCorrespondsToSession (filterValue, session) {
      const foundSessionType = this.service.sessionTypes.find(trSessionType => trSessionType.id === filterValue)
      if (!foundSessionType) {
        return false
      }
      return foundSessionType.data.duration === session.duration
    },

    /**
     * Check whether the session type corresponds to the filter's value.
     *
     * @since [*next-version*]
     *
     * @param {string} sessionTypeId
     * @param {ServiceSessionType} sessionType
     *
     * @return {boolean}
     */
    durationInSessionType (sessionTypeId, sessionType) {
      const foundSessionType = this.service.sessionTypes.find(trSessionType => trSessionType.id === sessionTypeId)
      if (!foundSessionType) {
        return false
      }
      return sessionType.data.duration === foundSessionType.data.duration
    },
  }
}
