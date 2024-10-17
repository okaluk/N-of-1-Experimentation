import {BROWSER_EXPERIMENT} from "../../modules/Experimentation/Browser_Output_Writer.js";
import {
    Experiment_Output_Writer, random_array_element,
    SET_SEED,
    text_input_experiment,
    Time_to_finish
} from "../../modules/Experimentation/Experimentation.js";
import {Task} from "../../modules/Experimentation/Task.js";
import {generate_flat_trees, generate_trees} from "../../modules/graphs_n_trees/Tree.js";
import {generate_classes_from_tree} from "./code/generate_classes_from_tree.js";
import {call_string} from "./code/Parser.js";
import {as_constructor_call} from "./code/convert_tree_to_constructor_call.js";
import {Constructor_Call} from "./code/Constructor_Call.js";

let SEED = "666";

SET_SEED(SEED);

let TREES = {
    3: generate_flat_trees(2),
    5: generate_flat_trees(4),
    7: generate_flat_trees(6)
};

let experiment_configuration_function = (writer: Experiment_Output_Writer) => { return {

    experiment_name: "TestExperiment",
    seed: SEED,

    introduction_pages: writer.stage_string_pages_commands([
        writer.convert_string_to_html_string(
            "Please, just do this experiment only, when you have enough time (about 25 minutes), are concentrated enough, and motivated enough.\n\nPlease, open the browser in fullscreen mode (probably by pressing [F11]). You should have a screen with a resolution of 1920x1080 or more."
        ),
            "In this experiment, you will be asked to enter the constructor call to a class <span class='sourcecode'>Target</span>. A valid constructor call requires in the underlying language the correct number of parameters as well.<br><br>" +
            "The languages does <b>not</b> have a keyword such as <span class='sourcecode'>new</span>. Instead, you call a constructor like a function call, where the class name is the function name.<br/><br/> " +
            "For example, if there is a class with the name <span class='sourcecode'>MyClass</span> whose constructor does not have any parameters, you call the constructor via <span class='sourcecode'>MyClass()</span>.<br/><br/>" +
            "All available classes are shown to you in a table (each cell has one class). The class <span class='sourcecode'>Target</span> is the one whose parameter needs to be called. It is always in the first cell in the last row.<br><br>" +
            "The code in the experiment is either statically typed or dynamically typed which will be explained on the next page and none of classes whose objects are passed to the constructor required any parameters.<br><br>" +
            "Please note that the classes you will see in each code snippet will be different. I.e. in a first task a class named A is different than a class named A in the second task.",

            "Sometimes the classes are statically typed with a type name in front of each parameter (such as in languages like Java). For example, the following could be shown to you:" +
            "<table style=\"border: 1px solid black;\"><tbody><tr style=\"vertical-align:top\"><td style=\"border: 1px solid black;\">class A {<br><br>&nbsp;&nbsp;A() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;enterData() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class C {<br><br>&nbsp;&nbsp;C() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;addEvents() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class E {<br><br>&nbsp;&nbsp;E(J teeth,&nbsp;J fall) {<br>&nbsp;&nbsp;&nbsp;&nbsp;fall.queueResults();<br>&nbsp;&nbsp;&nbsp;&nbsp;teeth.queueResults();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;manipulateQueue() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class G {<br><br>&nbsp;&nbsp;G() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;filterEvents() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class H {<br><br>&nbsp;&nbsp;H(G building) {<br>&nbsp;&nbsp;&nbsp;&nbsp;building.filterEvents();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;initializeData() {}&nbsp;&nbsp;&nbsp;<br><br>}</td></tr>\n" +
            "<tr style=\"vertical-align:top\"><td style=\"border: 1px solid black;\">class I {<br><br>&nbsp;&nbsp;I() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;computeResult() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class J {<br><br>&nbsp;&nbsp;J() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;queueResults() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class L {<br><br>&nbsp;&nbsp;L(E insect,&nbsp;J knot) {<br>&nbsp;&nbsp;&nbsp;&nbsp;knot.queueResults();<br>&nbsp;&nbsp;&nbsp;&nbsp;insect.manipulateQueue();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;writeOutput() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class N {<br><br>&nbsp;&nbsp;N() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;monitorSystem() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class O {<br><br>&nbsp;&nbsp;O(R road) {<br>&nbsp;&nbsp;&nbsp;&nbsp;road.createTasks();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;trackUserActivity() {}&nbsp;&nbsp;&nbsp;<br><br>}</td></tr>\n" +
            "<tr style=\"vertical-align:top\"><td colspan=\"2\" style=\"border: 1px solid black;\">class Target {<br><br>&nbsp;&nbsp;Target(A substance,&nbsp;C scene) {<br>&nbsp;&nbsp;&nbsp;&nbsp;scene.addEvents();<br>&nbsp;&nbsp;&nbsp;&nbsp;substance.enterData();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;getUserInfo() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class R {<br><br>&nbsp;&nbsp;R(H driving,&nbsp;N door) {<br>&nbsp;&nbsp;&nbsp;&nbsp;driving.initializeData();<br>&nbsp;&nbsp;&nbsp;&nbsp;door.monitorSystem();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;createTasks() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class S {<br><br>&nbsp;&nbsp;S(A rake) {<br>&nbsp;&nbsp;&nbsp;&nbsp;rake.enterData();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;doComputation() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class T {<br><br>&nbsp;&nbsp;T() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;setupConnections() {}&nbsp;&nbsp;&nbsp;<br><br>}</td></tr>\n" +
            "</tbody></table><br>" +
            "The correct constructor call in that case is: <span class='sourcecode'>Target(A(), C())</span>: the first parameter must be an instance of <span class='sourcecode'>A</span>, the second one an instance of <span class='sourcecode'>C</span>.",

            "Sometimes the classes are dynamically typed (such as in languages like JavaScript). For example, the following could be shown to you:" +
            "<span class='sourcecode'>" +
            "<table style=\"border: 1px solid black;\"><tbody><tr style=\"vertical-align:top\"><td style=\"border: 1px solid black;\">class A {<br><br>&nbsp;&nbsp;A() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;enterData() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class C {<br><br>&nbsp;&nbsp;C() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;addEvents() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class E {<br><br>&nbsp;&nbsp;E(teeth,&nbsp;fall) {<br>&nbsp;&nbsp;&nbsp;&nbsp;fall.queueResults();<br>&nbsp;&nbsp;&nbsp;&nbsp;teeth.queueResults();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;manipulateQueue() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class G {<br><br>&nbsp;&nbsp;G() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;filterEvents() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class H {<br><br>&nbsp;&nbsp;H(building) {<br>&nbsp;&nbsp;&nbsp;&nbsp;building.filterEvents();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;initializeData() {}&nbsp;&nbsp;&nbsp;<br><br>}</td></tr>\n" +
            "<tr style=\"vertical-align:top\"><td style=\"border: 1px solid black;\">class I {<br><br>&nbsp;&nbsp;I() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;computeResult() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class J {<br><br>&nbsp;&nbsp;J() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;queueResults() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class L {<br><br>&nbsp;&nbsp;L(insect,&nbsp;knot) {<br>&nbsp;&nbsp;&nbsp;&nbsp;knot.queueResults();<br>&nbsp;&nbsp;&nbsp;&nbsp;insect.manipulateQueue();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;writeOutput() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class N {<br><br>&nbsp;&nbsp;N() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;monitorSystem() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class O {<br><br>&nbsp;&nbsp;O(road) {<br>&nbsp;&nbsp;&nbsp;&nbsp;road.createTasks();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;trackUserActivity() {}&nbsp;&nbsp;&nbsp;<br><br>}</td></tr>\n" +
            "<tr style=\"vertical-align:top\"><td colspan=\"2\" style=\"border: 1px solid black;\">class Target {<br><br>&nbsp;&nbsp;Target(substance,&nbsp; scene) {<br>&nbsp;&nbsp;&nbsp;&nbsp;scene.addEvents();<br>&nbsp;&nbsp;&nbsp;&nbsp;substance.enterData();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;getUserInfo() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class R {<br><br>&nbsp;&nbsp;R(driving,&nbsp;door) {<br>&nbsp;&nbsp;&nbsp;&nbsp;driving.initializeData();<br>&nbsp;&nbsp;&nbsp;&nbsp;door.monitorSystem();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;createTasks() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class S {<br><br>&nbsp;&nbsp;S(rake) {<br>&nbsp;&nbsp;&nbsp;&nbsp;rake.enterData();<br>&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;doComputation() {}&nbsp;&nbsp;&nbsp;<br><br>}</td><td style=\"border: 1px solid black;\">class T {<br><br>&nbsp;&nbsp;T() {&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;<br><br>&nbsp;&nbsp;setupConnections() {}&nbsp;&nbsp;&nbsp;<br><br>}</td></tr>\n" +
            "</tbody></table></span>" +
            "<br>" +
            "The correct constructor call is again: <span class='sourcecode'>Target(A(), C())</span>: " +
            "<ol>" +
            "<li>the first parameter must be an instance of <span class='sourcecode'>A</span>, because the message <span class='sourcecode'>enterData()</span> is sent to the first parameter (and it is just implemented in <span class='sourcecode'>A</span>).</li>" +
            "<li>The second parameter must be an instance of <span class='sourcecode'>C</span> because the message <span class='sourcecode'>addEvents()</span> is sent to the second parameter (and it is just implemented in <span class='sourcecode'>C</span>).</li>" +
            "</ol>"

    ]),

    pre_run_training_instructions: writer.string_page_command(
        writer.convert_string_to_html_string(
            "You entered the training phase that consists of just two examples. Again, please enter the constructor call. You will go to the next task once you entered the correct call."
        )),

    pre_run_experiment_instructions: writer.string_page_command(
        writer.convert_string_to_html_string(
            "You entered the experiment phase.\n\n"
        )),

    finish_pages: [
        writer.string_page_command(
            writer.convert_string_to_html_string(
                "Almost done. Next, the experiment data will be downloaded (after pressing [Enter]). Please, send the " +
                "downloaded file to the experimenter (stefan.hanenberg@uni-due.de). By sending that mail, you agree that your (ananomy\n\n" +
                "After sending your email, you can close this window.\n\n" +
                "Many thanks for participation."
            )
        )
    ],

    layout: [
        { variable: "Notation",  treatments: ["types", "no_types"]},
        { variable: "Number_of_terms",  treatments: ["3", "5", "7"]},
    ],

    repetitions: 2, //CATALAN_GRAPHS.length,

    measurement: Time_to_finish(text_input_experiment),

    training_configuration: {
        fixed_treatments: [["types", "7"], ["no_types", "5"]],
        can_be_cancelled: false,
        can_be_repeated: false
    },

    task_configuration:    (t:Task) => {

        let this_tree = random_array_element(TREES[t.treatment_value("Number_of_terms")]).clone();
        let this_classes = generate_classes_from_tree(this_tree, 14);

        let html_string = this_classes.html_table_string(5, t.treatment_value("Notation")==="types");
        let error_string = "";

        t.do_print_task = () => {
            writer.clear_stage();
            writer.print_html_on_stage("<div class='sourcecode'>" + html_string + "</div>");
            // writer.print_html_on_stage(as_constructor_call(this_tree).call_string());
        };

        t.expected_answer = as_constructor_call(this_tree).call_string();

        t.accepts_answer_function = (given_answer) => {
            let given_call = null;
            try {
                let given_call:Constructor_Call = call_string(given_answer);

                try {
                    if(t.treatment_value("Notation")==="types") {
                        this_classes.type_check(given_call);
                    } else {
                        this_classes.execute(given_call);
                    }
                } catch (e) {
                    error_string = e;
                    return false;
                }

            } catch(e) {
                error_string = e;
                return false;
            }


            let right_target = (call_string(given_answer).class_name === as_constructor_call(this_tree).class_name);
            if(right_target === false) {
                error_string = "invalid target class";
                return false;
            }
            return true;
        };

        t.do_print_error_message = (given_answer) => {
            writer.clear_error();
            writer.print_html_on_error(error_string);
        };

        t.do_print_after_task_information = () => {
            writer.clear_stage();
            writer.clear_error();
            writer.print_string_on_stage(writer.convert_string_to_html_string(
                "Correct.\n\n" +
                "In case, you feel not concentrated enough, make a short break.\n\n" +
                "Press [Enter] to go on. "));
        }
    }
}};

BROWSER_EXPERIMENT(experiment_configuration_function);
