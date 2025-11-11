// Replaces some text (in schedule.html and similar pages) by menus
// to allow the user to select the time zone for the various
// displayed times and to to sort the events in different ways.
//
// NOTE: The time zone offsets are hard-coded for one date (see below)
// and will need to be regenerated for other years or months.
//
// TODO: Offer a shorter list of time zones?

'use strict';

(function () {

  // The initial time zone to use.
  let current_tz = "UTC";
  let year = 2025, month = 11, day = 10;

  // List of time zone offsets in minutes from UTC on the given day.
  // The list was regenerated on 2025-06-26 on Debian with the commands
  // below.
  //
  // grep -Ev '^#' /usr/share/zoneinfo/zone1970.tab | cut -f3 | awk '{ENVIRON["TZ"] = $1; z = strftime("%z", mktime("2025 11 20 12 0 0", 1)); sign = substr(z,1,1); hours = substr(z,2,2); minutes = substr(z,4); print "\"" ENVIRON["TZ"] "\": [\"" sign hours ":" minutes "\", " (sign == "-" ? "-" : "") (60 * hours + minutes) "],"}' | LC_ALL=C sort -t ',' -k2n -k1
  //
  const tz_offsets = {
    "Browser local time": ["", 0 - new Date(year, month, day).getTimezoneOffset()],
    "UTC": ["", 0],
    "Pacific/Niue": ["-11:00", -660],
    "Pacific/Pago_Pago": ["-11:00", -660],
    "America/Adak": ["-10:00", -600],
    "Pacific/Honolulu": ["-10:00", -600],
    "Pacific/Rarotonga": ["-10:00", -600],
    "Pacific/Tahiti": ["-10:00", -600],
    "Pacific/Marquesas": ["-09:30", -570],
    "America/Anchorage": ["-09:00", -540],
    "America/Juneau": ["-09:00", -540],
    "America/Metlakatla": ["-09:00", -540],
    "America/Nome": ["-09:00", -540],
    "America/Sitka": ["-09:00", -540],
    "America/Yakutat": ["-09:00", -540],
    "Pacific/Gambier": ["-09:00", -540],
    "America/Los_Angeles": ["-08:00", -480],
    "America/Tijuana": ["-08:00", -480],
    "America/Vancouver": ["-08:00", -480],
    "Pacific/Pitcairn": ["-08:00", -480],
    "America/Boise": ["-07:00", -420],
    "America/Cambridge_Bay": ["-07:00", -420],
    "America/Ciudad_Juarez": ["-07:00", -420],
    "America/Dawson": ["-07:00", -420],
    "America/Dawson_Creek": ["-07:00", -420],
    "America/Denver": ["-07:00", -420],
    "America/Edmonton": ["-07:00", -420],
    "America/Fort_Nelson": ["-07:00", -420],
    "America/Hermosillo": ["-07:00", -420],
    "America/Inuvik": ["-07:00", -420],
    "America/Mazatlan": ["-07:00", -420],
    "America/Phoenix": ["-07:00", -420],
    "America/Whitehorse": ["-07:00", -420],
    "America/Bahia_Banderas": ["-06:00", -360],
    "America/Belize": ["-06:00", -360],
    "America/Chicago": ["-06:00", -360],
    "America/Chihuahua": ["-06:00", -360],
    "America/Costa_Rica": ["-06:00", -360],
    "America/El_Salvador": ["-06:00", -360],
    "America/Guatemala": ["-06:00", -360],
    "America/Indiana/Knox": ["-06:00", -360],
    "America/Indiana/Tell_City": ["-06:00", -360],
    "America/Managua": ["-06:00", -360],
    "America/Matamoros": ["-06:00", -360],
    "America/Menominee": ["-06:00", -360],
    "America/Merida": ["-06:00", -360],
    "America/Mexico_City": ["-06:00", -360],
    "America/Monterrey": ["-06:00", -360],
    "America/North_Dakota/Beulah": ["-06:00", -360],
    "America/North_Dakota/Center": ["-06:00", -360],
    "America/North_Dakota/New_Salem": ["-06:00", -360],
    "America/Ojinaga": ["-06:00", -360],
    "America/Rankin_Inlet": ["-06:00", -360],
    "America/Regina": ["-06:00", -360],
    "America/Resolute": ["-06:00", -360],
    "America/Swift_Current": ["-06:00", -360],
    "America/Tegucigalpa": ["-06:00", -360],
    "America/Winnipeg": ["-06:00", -360],
    "Pacific/Galapagos": ["-06:00", -360],
    "America/Bogota": ["-05:00", -300],
    "America/Cancun": ["-05:00", -300],
    "America/Detroit": ["-05:00", -300],
    "America/Eirunepe": ["-05:00", -300],
    "America/Grand_Turk": ["-05:00", -300],
    "America/Guayaquil": ["-05:00", -300],
    "America/Havana": ["-05:00", -300],
    "America/Indiana/Indianapolis": ["-05:00", -300],
    "America/Indiana/Marengo": ["-05:00", -300],
    "America/Indiana/Petersburg": ["-05:00", -300],
    "America/Indiana/Vevay": ["-05:00", -300],
    "America/Indiana/Vincennes": ["-05:00", -300],
    "America/Indiana/Winamac": ["-05:00", -300],
    "America/Iqaluit": ["-05:00", -300],
    "America/Jamaica": ["-05:00", -300],
    "America/Kentucky/Louisville": ["-05:00", -300],
    "America/Kentucky/Monticello": ["-05:00", -300],
    "America/Lima": ["-05:00", -300],
    "America/New_York": ["-05:00", -300],
    "America/Panama": ["-05:00", -300],
    "America/Port-au-Prince": ["-05:00", -300],
    "America/Rio_Branco": ["-05:00", -300],
    "America/Toronto": ["-05:00", -300],
    "Pacific/Easter": ["-05:00", -300],
    "America/Barbados": ["-04:00", -240],
    "America/Boa_Vista": ["-04:00", -240],
    "America/Campo_Grande": ["-04:00", -240],
    "America/Caracas": ["-04:00", -240],
    "America/Cuiaba": ["-04:00", -240],
    "America/Glace_Bay": ["-04:00", -240],
    "America/Goose_Bay": ["-04:00", -240],
    "America/Guyana": ["-04:00", -240],
    "America/Halifax": ["-04:00", -240],
    "America/La_Paz": ["-04:00", -240],
    "America/Manaus": ["-04:00", -240],
    "America/Martinique": ["-04:00", -240],
    "America/Moncton": ["-04:00", -240],
    "America/Porto_Velho": ["-04:00", -240],
    "America/Puerto_Rico": ["-04:00", -240],
    "America/Santo_Domingo": ["-04:00", -240],
    "America/Thule": ["-04:00", -240],
    "Atlantic/Bermuda": ["-04:00", -240],
    "America/St_Johns": ["-03:30", -210],
    "America/Araguaina": ["-03:00", -180],
    "America/Argentina/Buenos_Aires": ["-03:00", -180],
    "America/Argentina/Catamarca": ["-03:00", -180],
    "America/Argentina/Cordoba": ["-03:00", -180],
    "America/Argentina/Jujuy": ["-03:00", -180],
    "America/Argentina/La_Rioja": ["-03:00", -180],
    "America/Argentina/Mendoza": ["-03:00", -180],
    "America/Argentina/Rio_Gallegos": ["-03:00", -180],
    "America/Argentina/Salta": ["-03:00", -180],
    "America/Argentina/San_Juan": ["-03:00", -180],
    "America/Argentina/San_Luis": ["-03:00", -180],
    "America/Argentina/Tucuman": ["-03:00", -180],
    "America/Argentina/Ushuaia": ["-03:00", -180],
    "America/Asuncion": ["-03:00", -180],
    "America/Bahia": ["-03:00", -180],
    "America/Belem": ["-03:00", -180],
    "America/Cayenne": ["-03:00", -180],
    "America/Coyhaique": ["-03:00", -180],
    "America/Fortaleza": ["-03:00", -180],
    "America/Maceio": ["-03:00", -180],
    "America/Miquelon": ["-03:00", -180],
    "America/Montevideo": ["-03:00", -180],
    "America/Paramaribo": ["-03:00", -180],
    "America/Punta_Arenas": ["-03:00", -180],
    "America/Recife": ["-03:00", -180],
    "America/Santarem": ["-03:00", -180],
    "America/Santiago": ["-03:00", -180],
    "America/Sao_Paulo": ["-03:00", -180],
    "Antarctica/Palmer": ["-03:00", -180],
    "Antarctica/Rothera": ["-03:00", -180],
    "Atlantic/Stanley": ["-03:00", -180],
    "America/Noronha": ["-02:00", -120],
    "America/Nuuk": ["-02:00", -120],
    "America/Scoresbysund": ["-02:00", -120],
    "Atlantic/South_Georgia": ["-02:00", -120],
    "Atlantic/Azores": ["-01:00", -60],
    "Atlantic/Cape_Verde": ["-01:00", -60],
    "Africa/Abidjan": ["+00:00", 0],
    "Africa/Bissau": ["+00:00", 0],
    "Africa/Monrovia": ["+00:00", 0],
    "Africa/Sao_Tome": ["+00:00", 0],
    "America/Danmarkshavn": ["+00:00", 0],
    "Antarctica/Troll": ["+00:00", 0],
    "Atlantic/Canary": ["+00:00", 0],
    "Atlantic/Faroe": ["+00:00", 0],
    "Atlantic/Madeira": ["+00:00", 0],
    "Europe/Dublin": ["+00:00", 0],
    "Europe/Lisbon": ["+00:00", 0],
    "Europe/London": ["+00:00", 0],
    "Africa/Algiers": ["+01:00", 60],
    "Africa/Casablanca": ["+01:00", 60],
    "Africa/Ceuta": ["+01:00", 60],
    "Africa/El_Aaiun": ["+01:00", 60],
    "Africa/Lagos": ["+01:00", 60],
    "Africa/Ndjamena": ["+01:00", 60],
    "Africa/Tunis": ["+01:00", 60],
    "Europe/Andorra": ["+01:00", 60],
    "Europe/Belgrade": ["+01:00", 60],
    "Europe/Berlin": ["+01:00", 60],
    "Europe/Brussels": ["+01:00", 60],
    "Europe/Budapest": ["+01:00", 60],
    "Europe/Gibraltar": ["+01:00", 60],
    "Europe/Madrid": ["+01:00", 60],
    "Europe/Malta": ["+01:00", 60],
    "Europe/Paris": ["+01:00", 60],
    "Europe/Prague": ["+01:00", 60],
    "Europe/Rome": ["+01:00", 60],
    "Europe/Tirane": ["+01:00", 60],
    "Europe/Vienna": ["+01:00", 60],
    "Europe/Warsaw": ["+01:00", 60],
    "Europe/Zurich": ["+01:00", 60],
    "Africa/Cairo": ["+02:00", 120],
    "Africa/Johannesburg": ["+02:00", 120],
    "Africa/Juba": ["+02:00", 120],
    "Africa/Khartoum": ["+02:00", 120],
    "Africa/Maputo": ["+02:00", 120],
    "Africa/Tripoli": ["+02:00", 120],
    "Africa/Windhoek": ["+02:00", 120],
    "Asia/Beirut": ["+02:00", 120],
    "Asia/Famagusta": ["+02:00", 120],
    "Asia/Gaza": ["+02:00", 120],
    "Asia/Hebron": ["+02:00", 120],
    "Asia/Jerusalem": ["+02:00", 120],
    "Asia/Nicosia": ["+02:00", 120],
    "Europe/Athens": ["+02:00", 120],
    "Europe/Bucharest": ["+02:00", 120],
    "Europe/Chisinau": ["+02:00", 120],
    "Europe/Helsinki": ["+02:00", 120],
    "Europe/Kaliningrad": ["+02:00", 120],
    "Europe/Kyiv": ["+02:00", 120],
    "Europe/Riga": ["+02:00", 120],
    "Europe/Sofia": ["+02:00", 120],
    "Europe/Tallinn": ["+02:00", 120],
    "Europe/Vilnius": ["+02:00", 120],
    "Africa/Nairobi": ["+03:00", 180],
    "Asia/Amman": ["+03:00", 180],
    "Asia/Baghdad": ["+03:00", 180],
    "Asia/Damascus": ["+03:00", 180],
    "Asia/Qatar": ["+03:00", 180],
    "Asia/Riyadh": ["+03:00", 180],
    "Europe/Istanbul": ["+03:00", 180],
    "Europe/Kirov": ["+03:00", 180],
    "Europe/Minsk": ["+03:00", 180],
    "Europe/Moscow": ["+03:00", 180],
    "Europe/Simferopol": ["+03:00", 180],
    "Europe/Volgograd": ["+03:00", 180],
    "Asia/Tehran": ["+03:30", 210],
    "Asia/Baku": ["+04:00", 240],
    "Asia/Dubai": ["+04:00", 240],
    "Asia/Tbilisi": ["+04:00", 240],
    "Asia/Yerevan": ["+04:00", 240],
    "Europe/Astrakhan": ["+04:00", 240],
    "Europe/Samara": ["+04:00", 240],
    "Europe/Saratov": ["+04:00", 240],
    "Europe/Ulyanovsk": ["+04:00", 240],
    "Indian/Mauritius": ["+04:00", 240],
    "Asia/Kabul": ["+04:30", 270],
    "Antarctica/Mawson": ["+05:00", 300],
    "Antarctica/Vostok": ["+05:00", 300],
    "Asia/Almaty": ["+05:00", 300],
    "Asia/Aqtau": ["+05:00", 300],
    "Asia/Aqtobe": ["+05:00", 300],
    "Asia/Ashgabat": ["+05:00", 300],
    "Asia/Atyrau": ["+05:00", 300],
    "Asia/Dushanbe": ["+05:00", 300],
    "Asia/Karachi": ["+05:00", 300],
    "Asia/Oral": ["+05:00", 300],
    "Asia/Qostanay": ["+05:00", 300],
    "Asia/Qyzylorda": ["+05:00", 300],
    "Asia/Samarkand": ["+05:00", 300],
    "Asia/Tashkent": ["+05:00", 300],
    "Asia/Yekaterinburg": ["+05:00", 300],
    "Indian/Maldives": ["+05:00", 300],
    "Asia/Colombo": ["+05:30", 330],
    "Asia/Kolkata": ["+05:30", 330],
    "Asia/Kathmandu": ["+05:45", 345],
    "Asia/Bishkek": ["+06:00", 360],
    "Asia/Dhaka": ["+06:00", 360],
    "Asia/Omsk": ["+06:00", 360],
    "Asia/Thimphu": ["+06:00", 360],
    "Asia/Urumqi": ["+06:00", 360],
    "Indian/Chagos": ["+06:00", 360],
    "Asia/Yangon": ["+06:30", 390],
    "Antarctica/Davis": ["+07:00", 420],
    "Asia/Bangkok": ["+07:00", 420],
    "Asia/Barnaul": ["+07:00", 420],
    "Asia/Ho_Chi_Minh": ["+07:00", 420],
    "Asia/Hovd": ["+07:00", 420],
    "Asia/Jakarta": ["+07:00", 420],
    "Asia/Krasnoyarsk": ["+07:00", 420],
    "Asia/Novokuznetsk": ["+07:00", 420],
    "Asia/Novosibirsk": ["+07:00", 420],
    "Asia/Pontianak": ["+07:00", 420],
    "Asia/Tomsk": ["+07:00", 420],
    "Antarctica/Casey": ["+08:00", 480],
    "Asia/Hong_Kong": ["+08:00", 480],
    "Asia/Irkutsk": ["+08:00", 480],
    "Asia/Kuching": ["+08:00", 480],
    "Asia/Macau": ["+08:00", 480],
    "Asia/Makassar": ["+08:00", 480],
    "Asia/Manila": ["+08:00", 480],
    "Asia/Shanghai": ["+08:00", 480],
    "Asia/Singapore": ["+08:00", 480],
    "Asia/Taipei": ["+08:00", 480],
    "Asia/Ulaanbaatar": ["+08:00", 480],
    "Australia/Perth": ["+08:00", 480],
    "Australia/Eucla": ["+08:45", 525],
    "Asia/Chita": ["+09:00", 540],
    "Asia/Dili": ["+09:00", 540],
    "Asia/Jayapura": ["+09:00", 540],
    "Asia/Khandyga": ["+09:00", 540],
    "Asia/Pyongyang": ["+09:00", 540],
    "Asia/Seoul": ["+09:00", 540],
    "Asia/Tokyo": ["+09:00", 540],
    "Asia/Yakutsk": ["+09:00", 540],
    "Pacific/Palau": ["+09:00", 540],
    "Australia/Darwin": ["+09:30", 570],
    "Asia/Ust-Nera": ["+10:00", 600],
    "Asia/Vladivostok": ["+10:00", 600],
    "Australia/Brisbane": ["+10:00", 600],
    "Australia/Lindeman": ["+10:00", 600],
    "Pacific/Guam": ["+10:00", 600],
    "Pacific/Port_Moresby": ["+10:00", 600],
    "Australia/Adelaide": ["+10:30", 630],
    "Australia/Broken_Hill": ["+10:30", 630],
    "Antarctica/Macquarie": ["+11:00", 660],
    "Asia/Magadan": ["+11:00", 660],
    "Asia/Sakhalin": ["+11:00", 660],
    "Asia/Srednekolymsk": ["+11:00", 660],
    "Australia/Hobart": ["+11:00", 660],
    "Australia/Lord_Howe": ["+11:00", 660],
    "Australia/Melbourne": ["+11:00", 660],
    "Australia/Sydney": ["+11:00", 660],
    "Pacific/Bougainville": ["+11:00", 660],
    "Pacific/Efate": ["+11:00", 660],
    "Pacific/Guadalcanal": ["+11:00", 660],
    "Pacific/Kosrae": ["+11:00", 660],
    "Pacific/Noumea": ["+11:00", 660],
    "Asia/Anadyr": ["+12:00", 720],
    "Asia/Kamchatka": ["+12:00", 720],
    "Pacific/Fiji": ["+12:00", 720],
    "Pacific/Kwajalein": ["+12:00", 720],
    "Pacific/Nauru": ["+12:00", 720],
    "Pacific/Norfolk": ["+12:00", 720],
    "Pacific/Tarawa": ["+12:00", 720],
    "Pacific/Apia": ["+13:00", 780],
    "Pacific/Auckland": ["+13:00", 780],
    "Pacific/Fakaofo": ["+13:00", 780],
    "Pacific/Kanton": ["+13:00", 780],
    "Pacific/Tongatapu": ["+13:00", 780],
    "Pacific/Chatham": ["+13:45", 825],
    "Pacific/Kiritimati": ["+14:00", 840],
  }


  // ordered_for_grid is set by check_calendar_order(). It is set to
  // true when calendars are sorted for grid view, and false when they
  // are sorted for list view.
  let ordered_for_grid = false;

  // For generating unique IDs:
  let nextid = 0;


  // generate_id -- give elt an ID if it doesn't have one yet */
  function generate_id(elt)
  {
    if (!elt.id) {
      let id = "s" + nextid++;
      while (document.getElementById(id)) id = "s" + nextid++;
      elt.id = id;
    }
  }


  // update_timezone -- update all TIME elements after a timezone change
  function update_timezone(tz, protect_fragment_id)
  {
    let hh, mm, minutes, new_tz_offset, current_tz_offset, suffix, x;

    if (tz == current_tz) return; // Nothing to do

    current_tz_offset = tz_offsets[current_tz][1];
    new_tz_offset = tz_offsets[tz][1];

    // Update all TIME elements. Content is expected to be
    // hh:mm, hh:mm+1 or hh:mm-1.
    for (const e of document.getElementsByTagName("time")) {
      x = e.textContent.match(/([0-9]{1,2}):([0-9]{1,2})([-+]1)?/);
      if (!x) continue;
      minutes = 60 * parseInt(x[1]) + parseInt(x[2]);
      if (x[3] == "+1") minutes += 60 * 24
      else if (x[3] == "-1") minutes -= 60 * 24;
      minutes -= current_tz_offset; // Convert to UTC
      minutes += new_tz_offset; // Convert to new timezone
      if (minutes < 0) {minutes += 24 * 60; suffix = "-1"}
      else if (minutes >= 24 * 60) {minutes -= 24 * 60; suffix = "+1"}
      else suffix = "";
      hh = Math.floor(minutes / 60).toString().padStart(2, "0");
      mm = (minutes % 60).toString().padStart(2, "0");
      e.textContent = hh + ":" + mm + suffix;
    }

    // Update all SELECT elements.
    for (const e of document.getElementsByName("tz"))
      for (const h of e.children)
        if (h.value != tz) h.removeAttribute("selected")
        else h.setAttribute("selected", "");

    // Update the URL with the time zone, so it can be bookmarked.
    // If protect_fragment_id is true, do not remove an existing fragment ID.
    if (! protect_fragment_id || ! location.hash) location.replace("#" + tz);

    // Also store the time zone in a cookie.
    document.cookie = "tz=" + encodeURIComponent(tz) + ";SameSite=lax";

    // Remember the new timezone.
    current_tz = tz;
  }


  // sort_this_calendar -- sort the calendar in which this event occurred
  function sort_this_calendar(ev)
  {
    let calendar = ev.target.closest(".calendar");
    let order = ev.target.value;

    if (calendar) {
      sort_one_calendar(calendar, order);
      calendar.sort_order = order; // Remember the order for this calendar
    } else {
      console.error("Event did not occur inside a calendar: ", ev.target);
    }
  }


  // sort_one_calendar -- sort a calendar in the given order
  function sort_one_calendar(calendar, order)
  {
    // To avoid reflow between when the elements are removed from the
    // DOM and reinsterted, do it all inside an animation frame.
    // Hopefully the sorting is quick, otherwise the window will
    // become unresponsive.
    requestAnimationFrame(() => {

      // Move the events out of the DOM and into an array.
      let events = [];
      for (let i = calendar.children.length - 1; i >= 0; i--) {
        if (calendar.children[i].tagName == "A") {
          events.unshift(calendar.children[i]);
          calendar.children[i].remove();
        } else if (calendar.children[i].tagName == "HR") {
	  calendar.children[i].remove(); // Remove previously added separators
	}
      }

      // Sort the events on the time, on the name or on the room.
      if (order == "time")
        events.sort((a, b) => {
          let av = a.getElementsByTagName("time")[0].getAttribute("datetime");
          let bv = b.getElementsByTagName("time")[0].getAttribute("datetime");
          return av < bv ? -1 : av > bv ? 1 : 0;
        })
      else if (order == "name")
        events.sort((a, b) => {
          let av = a.getElementsByTagName("b")[0].textContent;
          let bv = b.getElementsByTagName("b")[0].textContent;
	  return av.localeCompare(bv, "en-US",
	    {sensitivity: "base", ignorePunctuation: true});
          // let av = a.getElementsByTagName("b")[0].textContent.toLowerCase();
          // let bv = b.getElementsByTagName("b")[0].textContent.toLowerCase();
          // return av < bv ? -1 : av > bv ? 1 : 0;
        })
      else if (order == "room")
        events.sort((a, b) => {
          let av = a.getElementsByTagName("em")[0].textContent;
          let bv = b.getElementsByTagName("em")[0].textContent;
	  return av.localeCompare(bv, "en",
	    {sensitivity: "base", ignorePunctuation: true});
          // return av < bv ? -1 : av > bv ? 1 : 0;
        })
      else
        console.log("Sort order must be room, time or name, but got ", order);

      // Put the sorted elements back into the calendar element.
      // If the calendar has a class of "separators" and the order is
      // by time, insert HR elements between events that start at
      // different times.
      if (order != "time" || ! calendar.classList.contains("separators"))
	calendar.append(...events);
      else
	for (let i = 0; i < events.length; i++) {
	  calendar.append(events[i]);
	  let a = events[i].getElementsByTagName("time")[0]
	      ?.getAttribute("datetime");
	  let b = events[i+1]?.getElementsByTagName("time")[0]
	      ?.getAttribute("datetime");
	  if (i < events.length - 1 && a != b)
	    calendar.insertAdjacentHTML("beforeend", "<hr>");
	}
    });
  }


  // check_calendar_order -- order or restore entries in a calendar
  function check_calendar_order(calendar)
  {
    // This callback is called when a calendar changes size. If the
    // calendar is displayed as a grid and the child elements
    // representing events are not yet ordered by time and by room
    // then sort them. Otherwise, if the calendar is displayed as a
    // list and the child elements are still ordered by time and room,
    // restore the previous order. Note that this callback is called
    // for every calendar, but the first call already sorts all
    // calendars and the next calls have nothing to do.
    //console.log("check_calendar_order");
    if (window.getComputedStyle(calendar).display === "grid") {
      if (ordered_for_grid) return;
      for (const calendar of document.getElementsByClassName("calendar")) {
	sort_one_calendar(calendar, "room");	// secondary sort
	sort_one_calendar(calendar, "time");	// primary sort
      }
      ordered_for_grid = true;	// Remember that all calendars are now ordered
    } else {
      if (! ordered_for_grid) return;
      for (const calendar of document.getElementsByClassName("calendar"))
	sort_one_calendar(calendar, calendar.sort_order);
      ordered_for_grid = false;	// Remember that all are restored
    }
  }


  // find_sort_order -- find a comment with the initial order, if any
  function find_sort_order(node, last)
  {
    let c, a, r;

    // Find a comment "<!-- sort = ... --> " that is a child of node,
    // or find a comment that is a child of an ancestor and occurs
    // earlier in the document, or find a comment inside HEAD. (Note
    // that this works differently from how ics-to-html.awk finds the
    // comments, but the comments can be placed such that it works the
    // same.)
    if (!node) return null;	// Reached the root, end of recursion
    for (c = node.firstChild; c && c != last; c = c.nextSibling) {
      if (c.nodeType === Node.COMMENT_NODE &&
	  (a = c.data.match(/^\s*sort\s*=\s*(name|time|room)\s*$/))) {
	return a[1];		// "name", "time" or "room"
      }
    }
    // If we're at the root, also try inside HEAD.
    if (node.parentNode === document)
      for (c = document.head.firstChild; c; c = c.nextSibling) {
	if (c.nodeType === Node.COMMENT_NODE &&
	    (a = c.data.match(/^\s*sort\s*=\s*(name|time|room)\s*$/))) {
	  return a[1];		// "name", "time" or "room"
	}
      }
    return find_sort_order(node.parentNode, node);
  }


  // find_timezone -- find a comment with the initial time zone, if any
  function find_timezone(node)
  {
    let c, r, a;

    if (node.nodeType === Node.COMMENT_NODE) {
      a = node.data.match(/^\s*TZ\s*=\s*([a-zA-Z0-9_/+-]+)\s*$/);
      return a?.at(1);		// time zone name or undefined
    } else {
      for (c = node.firstChild; c; c = c.nextSibling)
	if ((r = find_timezone(c))) return r;
      return undefined;
    }
  }


  // initialize -- add form controls and event handlers to certain elements
  function initialize()
  {
    let tz;

    // If the document has a comment <!--TZ=XYZ-->, it means all times
    // in the document are relative to the timezone XYZ.
    if ((tz = find_timezone(document)) && tz_offsets[tz])
      current_tz = tz;

    // Find all elements with class=tz and replace them by a SELECT
    // with an event handler to select the time zone.
    const tz_elts = document.getElementsByClassName("tz");
    if (tz_elts.length) {
      while (tz_elts.length) {
        const select = document.createElement("select");
        select.setAttribute("name", "tz");
        select.addEventListener("change", ev=>update_timezone(ev.target.value));
        for (const tz in tz_offsets) {
          const option = document.createElement("option");
	  option.setAttribute("value", tz);
          if (! tz_offsets[tz][0]) option.append(tz);
	  else option.append(tz + ", " + tz_offsets[tz][0]);
          if (tz == current_tz) option.setAttribute("selected", "");
          select.append(option);
        }
        tz_elts[tz_elts.length-1].replaceWith(select);
      }
    }

    // Sort all calendars to the initial sort order. Set
    // ordered_for_grid to false to note that the lists are sorted
    // that way and not sorted for grid view.
    const calendars = document.querySelectorAll(".calendar");
    for (let calendar of calendars) {
      calendar.sort_order = find_sort_order(calendar) ?? "name";
      sort_one_calendar(calendar, calendar.sort_order);
    }
    ordered_for_grid = false;

    // Reorder calendar entries by time and by room inside every
    // calendar if the calendar is shown in grid view. Also attach a
    // ResizeObserver to all calendars, so that we can restore, resp.
    // reorder the calendar entries each time the calendar becomes a
    // list, resp. a grid.
    const resize_observer = new ResizeObserver((entries) => {
      for (let entry of entries) check_calendar_order(entry.target);});
    for (let calendar of calendars) {
      check_calendar_order(calendar);
      resize_observer.observe(calendar);
    }

    // Insert radio buttons with event handlers into each calendar to
    // sort that calendar.
    for (let calendar of calendars) {
      let span = document.createElement("span");
      let span1 = document.createElement("span");
      let span2 = document.createElement("span");
      let input1 = document.createElement("input"); generate_id(input1);
      let input2 = document.createElement("input"); generate_id(input2);
      let input3 = document.createElement("input"); generate_id(input3);
      let label1 = document.createElement("label");
      let label2 = document.createElement("label");
      let label3 = document.createElement("label");
      span.setAttribute("title", "sort by");
      span.classList.add("if-small");
      input1.setAttribute("type", "radio");
      input1.setAttribute("name", input1.id);
      input1.setAttribute("value", "name");
      if (calendar.sort_order == "name")
	input1.setAttribute("checked", "checked");
      input1.addEventListener("change", sort_this_calendar);
      input2.setAttribute("type", "radio");
      input2.setAttribute("name", input1.id);
      input2.setAttribute("value", "room");
      if (calendar.sort_order == "room")
	input2.setAttribute("checked", "checked");
      input2.addEventListener("change", sort_this_calendar);
      input3.setAttribute("type", "radio");
      input3.setAttribute("name", input1.id);
      input3.setAttribute("value", "time");
      if (calendar.sort_order == "time")
	input3.setAttribute("checked", "checked");
      input3.addEventListener("change", sort_this_calendar);
      label1.setAttribute("for", input1.id); label1.append("name");
      label2.setAttribute("for", input2.id); label2.append("room");
      label3.setAttribute("for", input3.id); label3.append("time");
      span1.append(input1, label1, input2, label2);
      span2.append(input3, label3);
      span.append(span1, span2);
      calendar.prepend(span);
    }

    // If the URL ends in #XYZ or we have a cookie of the form
    // "tz=XYZ", update all times to use XYZ as the time zone.
    if (((tz = decodeURIComponent(location.hash.substring(1))) &&
	tz_offsets[tz]) ||
	((tz = decodeURIComponent(document.cookie.split("; ")
	    .find((x) => x.startsWith("tz="))?.split("=")[1])) &&
	    tz_offsets[tz]))
      update_timezone(tz);

    // try {
    //   let tz = decodeURIComponent(location.hash.substring(1));
    //   if (!tz || !tz_offsets[tz])
    // 	tz = decodeURIComponent(document.cookie.split("; ")
    // 	    .find((x) => x.startsWith("tz="))?.split("=")[1]);
    //   if (tz_offsets[tz]) update_timezone(tz, true);
    // } catch (e) {
    //   // Fragment ID or cookie value could not be decoded. Just ignore it.
    // }
  }


  // Call initialize() as soon as the DOM is ready.
  if (document.readyState !== 'loading') initialize();
  else document.addEventListener('DOMContentLoaded', initialize);

})();
