var _ = require("lodash");
var moment = require("moment");
var as = require("./as");

module.exports = function(robot) {


  /*
    This method allows instructors award points to students

    For example:
      (deprecated) po award jason450 10 -m Extra effort
       po note jason450 -m Extra effort
  */
  robot.respond(/note (.*) -m (.*)$/i, function(res) {

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

          var note = JSON.stringify({
            student: student,
            comment: res.match[2],
            instructor: res.message.user.name
          });
        
          console.log(note);

          robot.http("http://localhost:8081/notes")
            .header('Content-Type', 'application/json')
            .post(note)(function(err, response, body) {
            if (err) {
              res.send("Note not added. " + err);
            } else {
              res.send("Note added");
            }
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
          console.log("student", student);

          report = student[0].notes.map(function(note) {
            fDate = moment(note.createdAt).format("dddd, MMMM Do YYYY");
            return note.comment + " -- (" + note.instructor + ")";
          }).join("\n");

          report = "Report for " + student[0].fullname + "\n\n" + report;

          res.send(report);
        }
      });

    });
  });


};