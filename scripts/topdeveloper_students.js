var as = require("./as");

module.exports = function(robot) {

  /*
    This method allows an instructor to awards points to a student

    For example:
      po puts sarah.story 10 -m Extra effort on group project
  */
  robot.respond(/puts (.*) (.*) (.*)/i, function(res) {

    as.instructor(robot, res, function() {
      var update = {};
      update[res.match[2]] = res.match[3];
      update = JSON.stringify(update);

      robot.http("http://localhost:8081/students/" + res.match[1])
        .header('Content-Type', 'application/json')
        .put(update)(function(err, response, body) {
        if (err) {
          res.send("Student not updated. " + err);
        } else {
          res.send("Student updated");
        }
      });
    });

  });

  /*
    This method allows an instructor to add a new student to a cohort

    For example:
      po add student mary.hart d11
  */
  robot.respond(/add student (.*) (.*)/i, function(res) {

    robot.http("http://localhost:8081/cohorts?alias=" + res.match[2])
      .get()(function(err, response, body) {

      var cohort = JSON.parse(body);
      var student = JSON.stringify({
        fullname: res.match[1],
        slackhandle: "tbd",
        cohort: cohort[0].id
      });

      robot.http("http://localhost:8081/students")
        .header('Content-Type', 'application/json')
        .post(student)(function(err, response, body) {
        if (err) {
          res.send("Student not added. " + err);
        } else {
          res.send(res.match[1] + " added");
        }
      });
    });

  });

    /*
    This method allows an instructor to remove a student

    For example:
      po remove student mike.young
  */
  robot.respond(/remove student (.*)/i, function(res) {

    as.instructor(robot, res, function() {
      robot.http("http://localhost:8081/students?slackhandle=" + res.match[1])
        .header('Content-Type', 'application/json')
        .get()(function(err, response, body) {

          robot.http("http://localhost:8081/students/" + JSON.parse(body)[0].id)
            .delete()(function(err, response, body) {

              if (err) {
                res.send("Could not remove student. " + err);
              } else {
                res.send("Student removed");
              }

            });

      });
    });

  });


  /*
    This method allows anyone to see a list of students in a cohort by
    specifying the alias of the cohort

    For example:
      po cohort d10
  */
  robot.respond(/cohort (.+)/i, function(res) {

    robot.http("http://localhost:8081/cohorts?alias=" + res.match[1])
      .get()(function(err, response, body) {

      var cohort = JSON.parse(body);

      robot.http("http://localhost:8081/students?cohort=" + cohort[0].id).get()(function(err, response, body) {
        var origstudents = JSON.parse(body);
        var students = origstudents.map(function(s) {
          var score = 0;

          if (s.score.length) {
            score = s.score.map(function(s) {
              return s.value;
            })
            .reduce(function(prev, curr) {
              return curr + prev;
            });
          }

         return "[" + s.id + "] " + s.fullname + "\t<" + s.slackhandle + ">";
        }).join("\n");
        students = "There are *" + origstudents.length + " students* in that cohort:\n\n" + students;
        res.send(students);
      });
    });

  });



};