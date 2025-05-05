import {
    alternatives,
    free_text, keys, random_integer_up_to_excluding, Reaction_Time, Reaction_Time_With_Penalty,
    SET_SEED,
    text_input_experiment,
    Time_to_finish, Time_to_finish_with_Penalty
} from "../modules/Experimentation/Experimentation";

import {BROWSER_EXPERIMENT} from "../modules/Experimentation/Browser_Output_Writer.js";
import {Nouns} from "../modules/Words/Nouns.js";
import {Verbs} from "../modules/Words/Verbs.js";
import {create_catalan_graphs} from "../modules/graphs_n_trees/BinaryBidirectionalTree.js";
import {array_of_rows_to_logical_result, Logical_Results} from "../modules/utils/LogicProgramming.js";

function set_nof1(map) {
    map['SET_SEED'] = SET_SEED;
    map['new_random_integer'] = random_integer_up_to_excluding;
    map['BROWSER_EXPERIMENT'] = BROWSER_EXPERIMENT;
    map['text_input_experiment'] = text_input_experiment;
    map['new_random_integer'] = random_integer_up_to_excluding;
    map['Time_to_finish'] = Time_to_finish;
    map['Time_to_finish_with_penality'] = Time_to_finish_with_Penalty;
    map['Reaction_time'] = Reaction_Time;
    map['Reaction_time_with_penalty'] = Reaction_Time_With_Penalty;
    map['keys'] = keys;
    map['Nouns'] = Nouns;
    map['Verbs'] = Verbs;
    map['create_catalan_graphs'] = create_catalan_graphs;
    map['Logical_Results'] = Logical_Results;
    map['array_of_rows_to_logical_result'] = array_of_rows_to_logical_result;
    map['free_text'] = free_text;
    map['alternatives'] = alternatives;

} // @ts-ignore

// @ts-ignore
set_nof1(Nof1); // Note: the webpage needs to introduce the global variable Nof1

