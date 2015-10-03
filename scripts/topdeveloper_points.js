var _ = require("lodash");

module.exports = function(robot) {

  var asInstructor = function(res, callback) {
    robot.http("http://stevebrownlee.com:8081/instructors").get()(function(err, response, body) {
      var isInstructor = false;
      var instructors = JSON.parse(body);

      instructors.forEach(function(i) {
        if (i.slackhandle === res.message.user.name) {
          isInstructor = true;
        }
      });

      if (isInstructor) {
        callback.call(this);
      }
    });
  }

  robot.respond(/award (.*),(.*),(.*)$/i, function(res) {

    asInstructor(res, function() {
      var award = JSON.stringify({
        student: res.match[1],
        value: res.match[2],
        comment: res.match[3]
      });

      robot.http("http://www.stevebrownlee.com:8081/points")
        .header('Content-Type', 'application/json')
        .post(award)(function(err, response, body) {
        if (err) {
          res.send("Points not added. " + err);
        } else {
          res.send("Points added\n"+award);
        }
      });
    });

  });

  robot.respond(/report cohort ([0-9]+)$/i, function(res) {

    asInstructor(res, function() {
      robot.http("http://stevebrownlee.com:8081/cohorts/report?id=" + res.match[1]).get()(function(err, response, body) {
        var allScores = JSON.parse(body);

        allScores = _.sortBy(allScores, "points").reverse().map(function(item) {
          return item.fullname + "\t" + item.points;
        }).splice(0,3).join("\n");

        allScores = "The top three students for that cohort are:\n\n" + allScores;

        res.send(allScores);
      });
    });

  });


};