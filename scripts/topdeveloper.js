module.exports = function(robot) {

  robot.respond(/top/i, function(res) {
    var help = [];
    help[help.length] = "*Commands available to anyone in the Slack organization*";
    help[help.length] = "cohorts - List all cohorts";
    help[help.length] = "cohort <alias> - List all students in the corresponding cohort (e.g. `po cohort d11`)";
    help[help.length] = "";
    help[help.length] = "*Commands available to instructors*";
    help[help.length] = "add cohort <label> - Add a new cohort. Don't use spaces. (e.g. `po add cohort Evening Cohort 3`)";
    help[help.length] = "remove cohort <alias> - Remove a graduated cohort. (e.g. `po remove cohort d10po `)";
    help[help.length] = "add student <full name> <cohort label> - Add a student to the corresponding cohort (e.g. `po add student Test Student day-cohort-11`)";
    help[help.length] = "remove student <slack handle> - Remove a student (e.g. `po remove student ahmed.ansari`)";
    help[help.length] = "award <username> <points> -m <comments> - Awards students points towards top developer (e.g. `po award joes 10 -m Strong leadership in group project`)";
    help[help.length] = "report cohort <cohort alias> - Shows the top five students in a cohort (e.g. `po report cohort d11`)";
    help[help.length] = "report student <username> - Show itemized list of awards for a student (e.g. `po report student kevin544`)";
    help[help.length] = "puts <student id> <property> <new value> - To change any arbitrary property of a Student object (e.g. `po puts 14 slackhandle lewis`)";
    help[help.length] = "putc <cohort id> <property> <new value> - To change any arbitrary property of a Cohort object (e.g. `po putc 1 alias d10`)";
    help[help.length] = "";
    help[help.length] = "*Commands available to owners/admins*";
    help[help.length] = "instructor add <full name> <username>";

    res.send(help.join("\n"));
  });

  robot.respond(/keys/i, function(res) {
   res.send(JSON.stringify(res.message));
  });

};