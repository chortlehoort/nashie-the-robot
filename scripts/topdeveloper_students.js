module.exports = function(robot) {


  robot.respond(/students update (.*) (.*) (.*)/i, function(res) {
    var update = {};
    update[res.match[2]] = res.match[3];
    update = JSON.stringify(update);

    robot.http("http://www.stevebrownlee.com:8081/students/" + res.match[1])
      .header('Content-Type', 'application/json')
      .put(update)(function(err, response, body) {
      if (err) {
        res.send("Student not updated. " + err);
      } else {
        res.send("Student updated");
      }
    });
  });

  robot.respond(/students add (.*) (.*)/i, function(res) {
    var student = JSON.stringify({
      fullname: res.match[1],
      slackhandle: "tbd",
      cohort: res.match[2]
    });

    robot.http("http://www.stevebrownlee.com:8081/students")
      .header('Content-Type', 'application/json')
      .post(student)(function(err, response, body) {
      if (err) {
        res.send("Student not added. " + err);
      } else {
        res.send("Student added");
      }
    });
  });

  var studentsByCohort = function(res) {
    robot.http("http://stevebrownlee.com:8081/students?cohort=" + res.match[1]).get()(function(err, response, body) {
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

       return "[*" + s.id + "*] " + s.fullname;
      }).join("\n");
      students = "There are " + origstudents.length + " students in that cohort\n" + students;
      res.send(students);
    });
  }


  robot.respond(/students cohort ([0-9]+)/i, function(res) {
    studentsByCohort(res);
  });


  robot.respond(/students$/i, function(res) {
    robot.http("http://www.stevebrownlee.com:8081/students").get()(function(err, response, body) {
      var students = JSON.parse(body);
      students = students.map(function(s) {
        var score = 0;

        if (s.score.length) {
          score = s.score.map(function(s) {
            return s.value;
          })
          .reduce(function(prev, curr) {
            return curr + prev;
          });
        }

       return "[*" + s.id + "*] " + s.fullname + "\t\t<" + s.cohort.label + ">";
      }).join("\n");
      res.send(students);
    });
  });


};