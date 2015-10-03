module.exports = function(robot) {

  var isInstructor = function(username) {
    robot.http("http://stevebrownlee.com:8081/instructors").get()(function(err, response, body) {
      var instructors = JSON.parse(body);
    });
  };

  robot.respond(/instructors$/i, function(res) {
    robot.http("http://www.stevebrownlee.com:8081/instructors").get()(function(err, response, body) {
      var instructors = JSON.parse(body);
      instructors = instructors.map(function(i) {
        var instructor = (i.active) ? i.fullname : "_" + i.fullname + "_";
        return "[*" + i.id + "*] " + instructor;
      }).join("\n");
      res.send(instructors);
    });
  });

  robot.respond(/instructors add (.*) (.*)/i, function(res) {
    if (res.message.user.name === "steve.brownlee") {
      var instructor = JSON.stringify({
        fullname: res.match[1],
        slackhandle: res.match[2]
      });

      robot.http("http://www.stevebrownlee.com:8081/instructors")
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