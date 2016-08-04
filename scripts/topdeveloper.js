module.exports = function(robot) {

  robot.respond(/top/i, function(res) {
    var help = [];
    help[help.length] = "*Commands available to anyone in the Slack organization*";
    help[help.length] = "cohorts - List all cohorts";
    help[help.length] = "cohort <alias> - List all students in the corresponding cohort (e.g. `po cohort d11`)";
    help[help.length] = "";
    help[help.length] = "*Instructor commands for managing cohorts*";
    help[help.length] = "add cohort -name <full name> -alias <alias> - Add a new cohort. Don't use spaces. (e.g. `po add cohort -name Evening Cohort 3 -alias e3`)";
    help[help.length] = "remove cohort <alias> - Remove a graduated cohort. (e.g. `po remove cohort d10`)";
//     help[help.length] = "report cohort <cohort alias> - Shows the top five students in a cohort (e.g. `po report cohort d11`)";
    help[help.length] = "";
    help[help.length] = "*Instructor commands for managing students*";
    help[help.length] = "add student -name <full name> -handle <slack handle> -cohort <cohort alias> - Add a student to the corresponding cohort (e.g. `po add student -name Test Student -handle test.student -cohort d11`)";
    help[help.length] = "remove student <slack handle> - Remove a student (e.g. `po remove student test.student`)";
    help[help.length] = "note <slack handle> -m <comments> - Adds any note about a student's teamwork, performance or comprehension. (e.g. `po note test.student -m Strong leadership in group project`)";
    help[help.length] = "report student <slack handle> - Show itemized list of awards for a student (e.g. `po report student test.student`)";
//    help[help.length] = "puts <student id> <property> <new value> - To change any arbitrary property of a Student object (e.g. `po puts 14 slackhandle lewis`)";
//    help[help.length] = "putc <cohort id> <property> <new value> - To change any arbitrary property of a Cohort object (e.g. `po putc 1 alias d10`)";
    help[help.length] = "";
    help[help.length] = "*Commands available to owners/admins*";
    help[help.length] = "add instructor -name <full name> -handle <slack handle> - Add a new instructor (e.g. `po instructor add -name New Instructor -handle new.instructor`)";
    help[help.length] = "instructors - Lists all current members designated as instructors";

    res.send(help.join("\n"));
  });

  robot.respond(/keys/i, function(res) {
   res.send(JSON.stringify(res.message));
  });

};