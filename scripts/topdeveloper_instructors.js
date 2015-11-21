var as = require("./as");
var moment = require("moment");

module.exports = function(robot) {

  /*
    This method allows anyone to see a list of instructors

    For example:
      po instructors
  */
  robot.respond(/instructors$/i, function(res) {
    robot.http("http://localhost:8081/instructors").get()(function(err, response, body) {
      var instructors = JSON.parse(body);
      instructors = instructors.map(function(i) {
        var instructor = (i.active) ? i.fullname : "_" + i.fullname + "_";
        return "[*" + i.id + "*] " + instructor;
      }).join("\n");
      res.send(instructors);
    });
  });


  /*
    This method allows instructors to update any arbitrary property of a
    Cohort object

    For example:
      po putc 1 alias d11
  */
  robot.respond(/briefing$/i, function(res) {

    as.instructor(robot, res, function() {
      robot.http("http://localhost:8081/absences").get()(function(err, response, body) {

        if (err) {
          res.send(err);
        } else {
          var today = moment(new Date()).format("MM-DD-YYYY");
          var absences = JSON.parse(body);

          if (absences.length) {
            res.send("*Students absent today*\n");
            for (var i = absences.length; i--; ) {
              var currentAbsence = absences[i];
              if (moment(currentAbsence.absence_date).format("MM-DD-YYYY") === today) {
                res.send(currentAbsence.student.fullname);
              }
            }
          }
        }

      });
    });

  });


  /*
    This method allows the owner/maintainer to add a new instructor

    For example:
      po instructor add Jennifer Wells jen.wells
  */
  robot.respond(/instructor add (.*) (.*)/i, function(res) {

    if (res.message.user.name === "steve.brownlee") {
      var instructor = JSON.stringify({
        fullname: res.match[1],
        slackhandle: res.match[2]
      });

      robot.http("http://localhost:8081/instructors")
        .header('Content-Type', 'application/json')
        .post(instructor)(function(err, response, body) {
        if (err) {
          res.send("Instructor not added. " + err);
        } else {
          res.send("Instructor added");
        }
      });
    }

  });


};