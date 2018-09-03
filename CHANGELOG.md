# Change log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [[*next-version*]] - YYYY-MM-DD
## [0.1.7] - 2018-09-03
### Fixed
- Bug when today became unavailable after clicking on some day and timezone was west of Greenwich. 

### Changed
- After entering into edit mode, all session displayed automatically without need of navigating to the another day.

## [0.1.6] - 2018-08-30
### Added
- `timezone` property on `SessionDatePicker`.

## [0.1.5] - 2018-08-13
### Added
- `TimezoneSelect` component for selecting timezone.
- Added ordering for session time list.

### Changed
- Session selection condition changed to allow selecting sessions that starts in the one month and ends in the another one.
- Sessions and range cache invalidated when `ServiceSessionSelector` is destroyed.
- Edit mode allows to preview date and session without loading all sessions.

## [0.1.4] - 2018-06-27
### Added
- `DateNavigator` component to switch days using "next", "prev" buttons.
- Ability to work with sessions that are longer than 1 day duration.

## [0.1.3] - 2018-06-15
### Added
- Added ability to select timezone in which sessions will be shown.

## [0.1.2] - 2018-06-09
### Fixed
- Current day in month is not highlighted for selecting if there are no sessions available for this day.