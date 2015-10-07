var as = require("./as");

module.exports = function(robot) {

  /*
    This method allows instructors to update any arbitrary property of a
    Cohort object

    For example:
      po putc 1 alias d11
  */
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


  /*
    This method allows instructors to add a new Cohort object

    For example:
      po add cohort Evening Cohort 4
  */
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

  /*
    This method allows anyone to see a list of Cohorts

    For example:
      po cohorts
  */
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