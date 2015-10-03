module.exports = function(robot) {

  robot.respond(/cohorts add (.*)/i, function(res) {
    var data = JSON.stringify({
      label: res.match[1]
    });

    robot.http("http://www.stevebrownlee.com:8081/cohorts")
      .header('Content-Type', 'application/json')
      .post(data)(function(err, response, body) {
      if (err) {
        res.send("Cohort not added. " + err);
      } else {
        res.send("Cohort added");
      }
    });
  });


  robot.respond(/cohorts$/i, function(res) {
    robot.http("http://www.stevebrownlee.com:8081/cohorts").get()(function(err, response, body) {
      var cohorts = JSON.parse(body);
      cohorts = cohorts.map(function(c) {
       return "(*" + c.id + "*) " + c.label;
      }).join("\n");
      res.send(cohorts);
    });
  });


};