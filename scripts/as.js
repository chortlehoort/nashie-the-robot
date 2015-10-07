module.exports = {
  instructor: function(robot, res, callback) {
    robot.http("http://localhost:8081/instructors").get()(function(err, response, body) {
      var isInstructor = false;
      var instructors = JSON.parse(body);

      instructors.forEach(function(i) {
        if (i.slackhandle === res.message.user.name) {
          isInstructor = true;
        }
      });

      if (isInstructor) {
        res.send("*Verified instructor*")
        callback.call(this);
      } else {
        res.send("*Access denied*");
      }
    });
  }
}
