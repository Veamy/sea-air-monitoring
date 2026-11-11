# Requirements

Variant: duty operator, subsystem 1 "Event log" (ARGUS, topic 1: automated workstation of the shift duty officer of the surface and air situation monitoring center).

The subsystem supports observation and record keeping only. It does not select targets and does not control weapons.

## User tasks

| ID  | Task                                                                   | Frequency            | Urgency   | Consequence of error or delay                                          |
| --- | ---------------------------------------------------------------------- | -------------------- | --------- | ---------------------------------------------------------------------- |
| T1  | Follow the stream of incoming events and keep the picture of the shift | continuous           | high      | a new event is missed, and the operator works with an outdated picture |
| T2  | Find relevant events by zone, type, status and time                    | many times per shift | high      | the operator spends time searching; a relevant event is overlooked     |
| T3  | Open an event and read its details and status history                  | many times per shift | medium    | the operator makes a decision without the context of the event         |
| T4  | Record the handling status of an event                                 | per event            | high      | the same event is handled twice, or an event stays unprocessed         |
| T5  | Notice high-priority events at once                                    | per event            | very high | a critical event is processed late                                     |

## Constraints

| ID  | Constraint                                                                                  |
| --- | ------------------------------------------------------------------------------------------- |
| C1  | The interface is used for a continuous shift of 8 to 12 hours on a fixed workstation.       |
| C2  | New events arrive from the system without any action by the user.                           |
| C3  | The interface is for observation and record keeping only; no targeting or weapon functions. |
| C4  | The interface text is in Ukrainian.                                                         |
| C5  | Event times are shown in local time with the UTC offset available.                          |

## Functional requirements

| No. | Requirement                                                                                                                            | Derives from |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| R1  | The event log shows, for each event: time, type, zone, source, status and priority.                                                    | T1           |
| R2  | The log lists events from newest to oldest by default.                                                                                 | T1           |
| R3  | The log refreshes itself at a configurable interval without losing the current filter or selected event.                               | T1, C2       |
| R4  | The user can filter events by type, zone, status and time range, and by free text. Filters combine.                                    | T2           |
| R5  | The user can clear all filters with one action.                                                                                        | T2           |
| R6  | Selecting an event opens a detail panel with all attributes and the status history of the event.                                       | T3           |
| R7  | The user can change the status of an event (new, in progress, closed). Each change is saved with its time and the operator identifier. | T4           |
| R8  | Events with high priority are marked visually, and a counter of unprocessed high-priority events is shown in the header.               | T5           |
| R9  | Each view shows four states: loading, error (with a retry action), empty data (with a message that explains why), and data.            | C2           |

## Non-functional requirements

| No. | Requirement                                                                                       | Derives from                            |
| --- | ------------------------------------------------------------------------------------------------- | --------------------------------------- |
| N1  | The layout works at 1440 px, 1280 px and 1024 px widths without horizontal page scrolling.        | C1                                      |
| N2  | All controls are reachable with the keyboard, and the focus is visible.                           | C1                                      |
| N3  | Text and interface colors meet WCAG 2.1 AA contrast (4.5:1 for text).                             | C1                                      |
| N4  | All interface texts are in Ukrainian.                                                             | C4                                      |
| N5  | Event times are shown in local time, and the UTC value is available in the detail panel.          | C5                                      |
| N6  | The interface has no functions for target selection, weapon control or firing.                    | C3                                      |
| N7  | The project passes linting with zero warnings, passes automated tests, and builds without errors. | Assignment, web interface requirement 4 |
| N8  | Every component that is part of the view has a Storybook story for each state it can show.        | Assignment, component catalog           |
