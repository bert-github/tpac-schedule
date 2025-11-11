# tpac-schedule

An entry for the TPAC 2025 hackathon.

This is the system that builds the TPAC schedule page. It includes
programs (in Bash and Awk) to retrieve events from the W3C group
calendar, convert the events from iCalendar to HTML fragments, sort
them and put them in an HTML page. The page provides both a list view
and a grid view (by means of CSS) and the list views can be sorted in
different ways (with JavaScript).

In other words: a nightmare :-) But several people manage to use the
build system nevertheless.

## More documentation

There is detailed documentation in the different scripts. Here is a
high-level overview of what each script does.

### ics-to-html.cron

This is a Bash script. (The .cron extension indicates that is
primarily meant to be run as a cron job, but it can be run manually,
too.) It's tasks are:

1. Retrieve the calendar of TPAC events from the W3C group calendar. That calendar is an iCalendar (.ics) file.

2. Call ics-to-html.awk to process the calendar events and update the existing HTML with them.

3. Commit the result to CVS. (But that part is commented out in this version, because we're not under CVS here.)

### ics-to-html.awk

This is an Awk program that reads an iCalendar file, an HTML file and
possibly other files with extra events or extra information about
events. (In this directory the extra-events.ics is empty and there are
not additional files with information.)

It outputs the HTML file it read, with parts between certain comments
(&lt;!--begin-include...--&gt; and &lt;!--end-include...--&gt;)
replaced by the calender entries converted to HTML. The comments a
time range from which events should be inserted there.

The program also transforms times to the desired time zone (as
indicated in the HTML file) and sorts the events either by name, by
location or by time (also as indicated in the HTML, or using a
default).

### markdown.awk

An Awk module used by the ics-to-html.awk. It contains functions to
parse MarkDown (because there is MarkDown in the events in the W3C
group calendar).

### htmlmathml.awk

This is an Awk module. It only contains a long list of all HTML
character entities.

### schedule.html

This is an HTML file. It contains a complete page, except that there
are pairs of comments (&lt;!--begin-include...--&gt; and
&lt;!--end-include...--&gt;) as explained above, where events should
be inserted.

### coming-up.html

Another HTML file. This one show the possibility of inserting events
from a very small, but dynamic interval of time, viz. the next two
hours.

### extra-events.ics

Any events that should be added but are not in the W3C groupo calendar
can be put here.

### local.css

This CSS files contains the rules that allow the list of events to be
laid out either as a list (a table, actually, since it uses ‘display:
table-row’ and related proeprties) and as a grid (using the CSS grid
properties). The list is shown on narrow screens, the grid in wide
ones.

### calendar-order.js

This JavaScript is linked from the HTML files and contains routines to
re-sort the lists of events, when the user clicks corresponding
buttons.

