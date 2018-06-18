/**
 * Component for selecting duration of service.
 *
 * @since [*next-version*]
 *
 * @return {object}
 */
export default function () {
  return {
    template: '#session-duration-picker-template',

    inject: {
      /**
       * Function for transforming duration in seconds to human readable format.
       *
       * @since [*next-version*]
       */
      'humanizeDuration': 'humanizeDuration'
    },

    props: {
      /**
       * @since [*next-version*]
       *
       * @property {object|null} value Selected session duration, `v-model` in parent
       */
      value: {},

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
    },

    computed: {
      /**
       * Proxy for component's model field.
       *
       * @since [*next-version*]
       *
       * @property {object|null} value Selected session duration, `v-model` in parent
       */
      valueProxy: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
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
          this.valueProxy = this.service.sessionLengths[0]
        }
      }
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
    }
  }
}