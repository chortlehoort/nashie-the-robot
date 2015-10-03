module.exports = function(robot) {

  robot.respond(/topdeveloper/i, function(res) {
    var help = [];
    help[help.length] = "cohorts - List all cohorts";
    help[help.length] = "cohorts add <name> - Add a new cohort with the specified code name";
    help[help.length] = "-------------------";
    help[help.length] = "students - List all students";
    help[help.length] = "students cohort <cohort id> - List all students in the corresponding cohort";
    help[help.length] = "students add <full name> <cohort id> - Add a student to the corresponding cohort";

    // help[help.length] = "";
    // help[help.length] = "";
    // help[help.length] = "";
    // help[help.length] = "";
    // help[help.length] = "";
    res.send(help.join("\n"));
  });

  robot.respond(/keys/i, function(res) {
   res.send(JSON.stringify(res.message));
   // res.send(JSON.stringify(res.robot));
   // res.send(JSON.stringify(res.match));
   // res.send(JSON.stringify(res.envelope));
  });


};