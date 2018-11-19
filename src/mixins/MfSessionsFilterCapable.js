export default function MfSessionsFilterCapable () {
  return {
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
    props: {
      /**
       * Ordered list of filters.
       *
       * @since [*next-version*]
       */
      filters: {
        default () {
          return [ 'duration', 'staffMember' ]
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
            for (const key of this.filters) {
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
      filterAgainstPreviousFilters (filterType, sessionType) {
        const currentFilterPosition = this.filters.indexOf(filterType)
        const filtersBefore = this.filters.slice(0, currentFilterPosition)

        for (let checkingFilter of filtersBefore) {
          const values = !!this[`${checkingFilter}FilterValues`].length
          if (!values) {
            return true
          }
          let checkResult = !!this[`${checkingFilter}InSessionType`] ? this[`${checkingFilter}InSessionType`](this.filter[checkingFilter], sessionType) : true
          if (!checkResult) {
            return false
          }
        }
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
        for (const key of this.filters) {
          if (!this[`${key}FilterValues`] || !this[`${key}FilterValues`].length) {
            continue
          }
          this.filter[key] = Object.keys(this[`${key}FilterValues`]).find(value => this[`${key}FilterCorrespondsToSession`](value, session))
        }
      }
    }
  }
}
