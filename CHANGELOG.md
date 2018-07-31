# Change log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [[*next-version*]] - YYYY-MM-DD
### Added
- `TimezoneSelect` component for selecting timezone.
- Added ordering for session time list.

### Changed
- Session selection condition changed to allow selecting sessions that starts in the one month and ends in the another one.
- Sessions and range cache invalidated when `ServiceSessionSelector` is destroyed.

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