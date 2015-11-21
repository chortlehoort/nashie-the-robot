var _ = require("lodash");
var moment = require("moment");
var as = require("./as");

module.exports = function(robot) {


  /*
    This method allows instructors award points to students

    For example:
      po award jason450 10 -m Extra effort
  */
  robot.respond(/award (.*) (.*) -m (.*)$/i, function(res) {

    as.instructor(robot, res, function() {

      // If the student's slack handle included the @, remove it
      var studentHandle = res.match[1].split("");
      if (studentHandle[0] === "@") {
        studentHandle.shift();
      }
      studentHandle = studentHandle.join("");

      robot.http("http://localhost:8081/students?slackhandle=" + studentHandle)
        .header('Content-Type', 'application/json')
        .get()(function(err, response, body) {
          var student = JSON.parse(body)[0];

          var award = JSON.stringify({
            student: student,
            value: res.match[2],
            comment: res.match[3],
            instructor: res.message.user.name
          });

          robot.http("http://localhost:8081/points")
            .header('Content-Type', 'application/json')
            .post(award)(function(err, response, body) {
            if (err) {
              res.send("Points not added. " + err);
            } else {
              res.send("Points added");
            }
          });
        });

    });

  });


  /*
    This method allows instructors to see who the current top 5 students are
    in a cohort

    For example:
      po report cohort d11
  */
  robot.respond(/report cohort (.+)$/i, function(res) {

    as.instructor(robot, res, function() {

    robot.http("http://localhost:8081/cohorts?alias=" + res.match[1])
      .get()(function(err, response, body) {
        var cohort = JSON.parse(body)[0];

        robot.http("http://localhost:8081/cohorts/report?id=" + cohort.id)
          .get()(function(err, response, body) {

          var allScores = JSON.parse(body);
          allScores = _.sortBy(allScores, "points").reverse().map(function(item) {
            return item.points + " | " + item.fullname + " <"+ item.slackhandle +">\t";
          }).splice(0,5).join("\n");

          allScores = "The top five students for that cohort are:\n\n" + allScores;
          res.send(allScores);
        });

      });
    });

  });


  /*
    This method allows instructors to get a report on all awards for a student

    For example:
      po report jen90ty
  */
  robot.respond(/report student (.+)/i, function(res) {
    as.instructor(robot, res, function() {
      var student, report, fDate;

      robot.http("http://localhost:8081/students?slackhandle=" + res.match[1])
        .header('Content-Type', 'application/json')
        .get()(function(err, response, body) {
        if (err) {
          res.send("Student not available. " + err);
        } else {
          student = JSON.parse(body);

          report = student[0].score.map(function(award) {
            fDate = moment(award.createdAt).format("dddd, MMMM Do YYYY");
            return "Awarded " + award.value + " points by " + award.instructor + " on " + fDate + " for " + award.comment;
          }).join("\n");

          report = "Report for " + student[0].fullname + "\n\n" + report;

          res.send(report);
        }
      });

    });
  });


};