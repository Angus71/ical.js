var ical = require('./ical')
  , request = require('request')
  , fs = require('fs')

exports.fromURL = function(url, opts, cb){
  if (!cb)
    return;
  request(url, opts, function(err, r, data){
    if (err)
      return cb(err, null);
    cb(undefined, ical.parseICS(data));
  })
}

exports.parseFile = function(filename){
  return ical.parseICS(fs.readFileSync(filename, 'utf8'))
}


var rrule = require('rrule').RRule

ical.objectHandlers['RRULE'] = function(val, params, curr, stack, line){
  var options = rrule.parseString(line.replace("RRULE:", ""));
  // If not DTSTART was given with RRULE and DTSTART already set, use it
  if (options.dtstart === undefined && curr.start !== undefined) {
	  options.dtstart = curr.start;
  }
  curr['rrule'] = new rrule(options);

  return curr
}
