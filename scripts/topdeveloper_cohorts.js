var as = require("./as");

module.exports = function(robot) {

  robot.respond(/putc (.*) (.*) (.*)/i, function(res) {

    as.instructor(robot, res, function() {
      var update = {};
      update[res.match[2]] = res.match[3];
      update = JSON.stringify(update);

      robot.http("http://localhost:8081/cohorts/" + res.match[1])
        .header('Content-Type', 'application/json')
        .put(update)(function(err, response, body) {
        if (err) {
          res.send("Cohort not updated. " + err);
        } else {
          res.send("Cohort updated");
        }
      });
    });

  });

  robot.respond(/add cohort (.*)/i, function(res) {

    as.instructor(robot, res, function() {
      var data = JSON.stringify({
        label: res.match[1]
      });

      robot.http("http://localhost:8081/cohorts")
        .header('Content-Type', 'application/json')
        .post(data)(function(err, response, body) {
        if (err) {
          res.send("Cohort not added. " + err);
        } else {
          res.send("Cohort added");
        }
      });
    });

  });


  robot.respond(/cohorts$/i, function(res) {
    robot.http("http://localhost:8081/cohorts").get()(function(err, response, body) {
      var cohorts = JSON.parse(body);
      cohorts = cohorts.map(function(c) {
       return "[" + c.id + "] " + c.label + "\t aliased as *<" + c.alias + ">*";
      }).join("\n");
      res.send(cohorts);
    });
  });


};