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