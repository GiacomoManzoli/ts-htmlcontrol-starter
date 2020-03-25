// $Header: svn://svn.omnis.net/branches/Studio81x/Studio/JSCLIENT/html/scripts/omn_date.js 12468 2015-08-28 09:48:17Z jgissing $
// Copyright (C) Tiger Logic Corp 2011
// JavaScript omnis framework for rendering and managing omnis remote forms
// Object handling omnis dates and date-times

// Changes
// Date				Edit				Bug					Description
// 28-Aug-15	jmgunmarked							Fixed some Lint warnings.
// 28-Aug-15	jmg0307			ST/JS/1221	Date instance variables with no time component should not be converted to/from UTC when sending to/from the server.
// 23-Jul-13	rmm8065			OE-1948			Added function equivalents for hash variables used with JS client.
// 04-Jun-13	rmm7992			ST/JS/792		Implemented dadd() for JS client method execution.
// 02-Aug-12	rmm7590			ST/JS/400+1	$jslocaltime property for remote tasks.
// 31-Jul-12	rmm7582			ST/JS/508		Date formatting issue with data grid.
// 17-Jul-12	rmm7563			ST/JS/424		JS client number formatting.
// 16-Jul-12	rmm7557a								Date picker issues with timezone.
// 12-Jul-12	rmm7557			ST/JS/475		Date picker timezone issue.
// 31-May-12	rmm7508			ST/JS/399		Problem with date conversion on 31st of the month.
// 15-Nov-11	rmm_jscs2								JavaScript client - client scripting part 2.

// ###################################################################
// ##### static stuff ################################################
// ###################################################################

// the Omnis date object
//	{
//		"dtY":year,				// 2011		// Y-M-D is optional if this is a time-only value
//		"dtM":month,			// 1-12
//		"dtD":day,				// 1-31
//		"dtH":hour,				// 0-23		// H:N:S:G is optional if this is a date-only value
//		"dtN":minutes,		// 0-59
//		"dtS":seconds,		// 0-59
//		"dtG":hundredths	// 0-99
//	}

// rmm7992: Date parts
var eDateParts =
{
	"kYear":1,
	"kMonth":2,
	"kWeek":3,
	"kDayofYear":4,
	"kQuarter":5,
	"kMonthofQuarter":6,
	"kWeekofQuarter":7,
	"kDayofQuarter":8,
	"kWeekofMonth":9,
	"kDay":10,
	"kHour":19,
	"kMinute":20,
	"kSecond":21,
	"kCentiSecond":22
};

var eOmnisDateComponents =
{
	Date: 1,
	Time: 2
}; // jmg0307

// ###################################################################
// ##### object constructor ##########################################
// ###################################################################

// function omnis_date()
//
//		constructor for our omnis date object
//
/**
 * @constructor
 * @param value
 */
function omnis_date(value)
{
	// Start jmg0307: Populate __hasDate(/Time)Component. Prefixed with "__" so it's ignored by JSON.Stringify().
	if (value && typeof value["dateComps"] != "undefined") {
		this.__hasDateComponent	 = (value.dateComps & eOmnisDateComponents.Date) > 0;
		this.__hasTimeComponent	 = (value.dateComps & eOmnisDateComponents.Time) > 0;
	}
	// If the passed value has no dateComps member, see if it already has the dateTimeComponents:
	else if (value && typeof value["__hasTimeComponent"] != "undefined") {
		this.__hasDateComponent = value.__hasDateComponent;
		this.__hasTimeComponent = value.__hasTimeComponent;
	}
	else { // Default to assuming it has both date & time components:
		this.__hasDateComponent = true;
		this.__hasTimeComponent = true;
	}
	// End jmg0307

	if (value == null)
	{
		// Constructing the current date and time
		value = new Date();
	}
	if (value instanceof Date)
	{
		// Constructing from a JavaScript date
		//CRJSCal : needed UTC values for Y, M, D.
		// Start rmm7590
		var h, n, s, g;
		if (jOmnis.useLocalTime || !this.__hasTimeComponent) // rmm7590 // jmg0307
		{
			this.dtY = value.getFullYear();
			this.dtM = value.getMonth() + 1;
			this.dtD = value.getDate();
			h = value.getHours();
			n = value.getMinutes();
			s = value.getSeconds();
			g = value.getMilliseconds();
		}
		else
		{
			this.dtY = value.getUTCFullYear();
			this.dtM = value.getUTCMonth() + 1;
			this.dtD = value.getUTCDate();
			h = value.getUTCHours();
			n = value.getUTCMinutes();
			s = value.getUTCSeconds();
			g = value.getUTCMilliseconds();
		}
		// End rmm7590
		if (this.__hasTimeComponent && (h != 0 || n != 0 || s != 0 || g != 0)) // jmg0307
		{
			this.dtH = h;
			this.dtN = n;
			if (s != 0 || g != 0)
			{
				this.dtS = s;
				if (g != 0)
					this.dtG = Math.round(g/10);
			}
		}
	}
	else
	{
		// Constructing from an Omnis date-time object
		if ("dtY" in value)
		{
			this.dtY = value.dtY;
			this.dtM = value.dtM;
			this.dtD = value.dtD;
		}
		if (this.__hasTimeComponent && "dtH" in value) // jmg0307
		{
			this.dtH = value.dtH;
			this.dtN = value.dtN;
			this.dtS = value.dtS;
			this.dtG = value.dtG;
		}
	}
}

// ###################################################################
// ##### object methods ##############################################
// ###################################################################
// Convert Omnis date to JavaScript date
omnis_date.prototype.toJavaScriptDate = function()
{
	var jsDate = new Date();	// default is today's date
	// Start rmm7590
	if (jOmnis.useLocalTime || !this.__hasTimeComponent) // jmg0307
	{
		if (this.dtY)
			jsDate.setFullYear(this.dtY);
		if (this.dtM)
		{
			jsDate.setDate(1);	// rmm7508: make sure the day is in range for the current month
			jsDate.setMonth(this.dtM - 1);
		}
		if (this.dtD)
			jsDate.setDate(this.dtD);
		if (this.dtH != null && this.__hasTimeComponent) // jmg0307
		{	
			// rmm7557: If hours are set, minutes must also be set
			jsDate.setHours(this.dtH);
			jsDate.setMinutes(this.dtN);
			if (this.dtS != null)
				jsDate.setSeconds(this.dtS);
			else
				jsDate.setSeconds(0);
			if (this.dtG != null)
				jsDate.setMilliseconds(this.dtG*10);
			else
				jsDate.setMilliseconds(0);
		}
		else
		{
			jsDate.setHours(0);
			jsDate.setMinutes(0);
			jsDate.setSeconds(0);
			jsDate.setMilliseconds(0);
		}
	}
	else
	{
		// End rmm7590
		if (this.dtY)
			jsDate.setUTCFullYear(this.dtY);
		if (this.dtM)
		{
			jsDate.setUTCDate(1);	// rmm7508: make sure the day is in range for the current month
			jsDate.setUTCMonth(this.dtM - 1);
		}
		if (this.dtD)
			jsDate.setUTCDate(this.dtD);
		if (this.dtH != null)
		{	
			// rmm7557: If hours are set, minutes must also be set
			jsDate.setUTCHours(this.dtH);
			jsDate.setUTCMinutes(this.dtN);
			if (this.dtS != null)
				jsDate.setUTCSeconds(this.dtS);
			else
				jsDate.setUTCSeconds(0);
			if (this.dtG != null)
				jsDate.setUTCMilliseconds(this.dtG*10);
			else
				jsDate.setUTCMilliseconds(0);
		}
		else
		{
			jsDate.setUTCHours(0);
			jsDate.setUTCMinutes(0);
			jsDate.setUTCSeconds(0);
			jsDate.setUTCMilliseconds(0);
		}
	}
	return jsDate;
};

// Compare Omnis dates
omnis_date.prototype.equals = function(omnisDate)
{
	if (omnisDate == null || !(omnisDate instanceof omnis_date)) // rmm7563: Check instanceof
		return false;
	
	if (this.dtY != omnisDate.dtY || this.dtM != omnisDate.dtM || this.dtD != omnisDate.dtD ||
		  this.dtH != omnisDate.dtH || this.dtN != omnisDate.dtN || this.dtS != omnisDate.dtS ||
		  this.dtG != omnisDate.dtG)
	{
		return false;
	}

	return true;
};

// rmm7582: Used to determine if a date has a time component (when it does not, the date is used
// irrespective of the client timezone - a date is just a date in this case, so it is formatted with
// dateFormatUTC)
omnis_date.getHasTime = function(o) 
{
	if (o && o instanceof omnis_date)
	{
		return "dtH" in o;
	}				
	return false;
};

// Start rmm7992:
omnis_date.prototype.add = function(part, integerAmount)
{
	//noinspection FallThroughInSwitchStatementJS
	switch (part)
	{
		case eDateParts.kYear:
			var retDate = new omnis_date(this);
			retDate.dtY += integerAmount;
			if ((retDate.dtM == 2) && (retDate.dtD == 29))     // Special case, going from leap year to non leap year
			{
				// Do not decrement the destination day, if the result year is a leap year
				if (!(retDate.dtY % 4) && ((retDate.dtY % 100) || !(retDate.dtY % 400)))
				{	/* Empty */ }
				else retDate.dtD--;
			}
			return retDate;
		case eDateParts.kQuarter:
			integerAmount *= 3.0;                         // A quarter is 3 months
		case eDateParts.kMonth:
		case eDateParts.kMonthofQuarter:
			var jsDate = this.toJavaScriptDate();
			var checkEndOfMonth = (this.dtD >= 28);
			jsDate.setMonth(jsDate.getMonth() + integerAmount);
			var dayOfMonth = jsDate.getDate();
			if (checkEndOfMonth && dayOfMonth <= 3)
			{
				// We have moved to the first, second or third day of the next month since the day is not valid for the new month e.g. 31 September
				jsDate = new Date(jsDate*1 - dayOfMonth*(24 * 60 * 60 * 1000));	// Get the last day of the previous month
			}
			return new omnis_date(jsDate);
		case eDateParts.kWeek:
		case eDateParts.kWeekofQuarter:
		case eDateParts.kWeekofMonth:
			integerAmount *= 7.0;	// Convert to days and drop through to next case
		case eDateParts.kDay:
		case eDateParts.kDayofYear:
		case eDateParts.kDayofQuarter:
			integerAmount *= 24.0; // Convert to hours and drop through to next case
		case eDateParts.kHour:
			integerAmount *= 60.0; // Convert to minutes and drop through to next case
		case eDateParts.kMinute:
			integerAmount *= 60.0; // Convert to seconds and drop through to next case
		case eDateParts.kSecond:
			integerAmount *= 100; // Convert to centiseconds and drop through to next case
		case eDateParts.kCentiSecond:
			integerAmount *= 10;	// Convert to milliseconds
			jsDate = this.toJavaScriptDate();
			jsDate = new Date(jsDate*1 + integerAmount);
			return new omnis_date(jsDate);
	}
	return null;
};
// End rmm7992

// Start rmm8065: Return format for date based on subtype if available
omnis_date.prototype.getFormat = function()
{
	if (this.__form)
	{
		var form = this.__form;
		if (this.__dataIndex >= 1 && this.__dataIndex <= form.instanceVars.lstDef.length)
		{
			var defn = form.getDefn(this.__dataIndex);
			if (defn)
			{
				var subType = defn[2];
				if (subType == 6)										// Short time
					return jOmnis.mHashFT;
				if (subType >= 0 && subType <= 2)		// Short date
					return jOmnis.mHashFD;
			}
		}
	}
	// Use #FDT in all other cases
	return jOmnis.mHashFDT;
};
// End rmm8065

// ###################################################################
// ##### file initialization #########################################
// ###################################################################
// put any global code here that must execute after the script above
// has been parsed
