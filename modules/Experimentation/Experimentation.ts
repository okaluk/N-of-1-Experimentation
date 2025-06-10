import dummy from "../../modules_hard_import/seedrandom/seedrandom.js";
import {Task} from "./Task.js";
import {convert_string_to_html_string} from "../utils/Utils.js";
import {Alternatives, Freetext, Information} from "../Automata_Forwarders/Questionnaire_Forwarder.js";

export type Output_Command=()=>void;
export function init(){}
export enum VARIABLE_TYPE { STRING = 1, NUMBER }

export function Reaction_Time(input: (writer: Experiment_Output_Writer)=> Experiment_Input_Type): (writer: Experiment_Output_Writer) => Measurement_Type {
    return (writer: Experiment_Output_Writer) => new Reaction_Time_Measurement(input(writer));
};

export function Reaction_Time_With_Penalty(input: (writer: Experiment_Output_Writer)=> Experiment_Input_Type, penalty_seconds:number): (writer: Experiment_Output_Writer) => Measurement_Type {
    return (writer: Experiment_Output_Writer) => new Reaction_Time_Penalty_Measurement(input(writer), penalty_seconds);
};

export function Time_to_finish(input: (Experiment_Output_Writer)=> Experiment_Input_Type): (Experiment_Output_Writer) => Measurement_Type {
    return (writer: Experiment_Output_Writer) => new Time_To_Finish_Measurement(input(writer));
}

export function Time_to_finish_with_Penalty(input: (Experiment_Output_Writer)=> Experiment_Input_Type, penalty_seconds: number): (Experiment_Output_Writer) => Measurement_Type {
    return (writer: Experiment_Output_Writer) => new Time_To_Finish_With_Time_Penalty_Measurement(input(writer), penalty_seconds);
}

export function keys(key_list: string[]) {
    return (writer:Experiment_Output_Writer) => new Key_Pressing(key_list, writer);
}

export function keys_0_to_9() {
    return (writer:Experiment_Output_Writer) => new Key_Pressing(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], writer);
}

export function text_input_experiment(output_writer: Experiment_Output_Writer):Experiment_Input_Type {
    return new Free_Text_User_Input_Experiment(output_writer);
}

export function text_input_experiment_with_pre_post_label(pre, post) {
    return (output_writer: Experiment_Output_Writer) => new Free_Text_User_Input_Experiment_With_PrePost(output_writer, pre, post);
}

export function information(question:string) {
    return new Information(question);
}

export function free_text(var_name: string, question:string) {
    return new Freetext(var_name, question);
}
export function alternatives(var_name: string, question:string, alternatives: string[]) {
    return new Alternatives(var_name, question, alternatives);
}

export abstract class Experiment_Output_Writer {
    abstract print_experiment_name(s: string);

    abstract print_string_to_state(forwarder_name: string);

    abstract clear_stage();
    abstract clear_error();

    abstract print_string_on_stage(s: string);
    abstract print_html_on_stage(s: string);
    abstract print_html_on_error(s: string);

    abstract print_error_string_on_stage(error_string: string);
    convert_string_to_html_string(s:string):string {
        return convert_string_to_html_string(s);
    }
    string_page_command(s: string): Output_Command {
        return ()=>this.print_string_on_stage(s);
    }

    stage_string_pages_commands(pages: string[]):Output_Command[] {
        let ret = [];
        for(let a of pages) {
            ret.push(this.string_page_command(a));
        }
        return ret;
    }

    abstract ask_for_input();

    abstract print_string_to_page_number(s:string);

    get_given_answer(input:string):string {
        return input;
    }

    print_on_input_response(given_answer: string) {}
    set_focus_on_input(){}

    abstract clear_state();
    clear_all() {
        this.clear_state();
        this.clear_stage();
    }
}


export abstract class Measurement_Type {
    input_type: Experiment_Input_Type;
    start_time: number;

    constructor(input_type: Experiment_Input_Type) {
        this.input_type = input_type;
    }

    accepted_responses() {
        return this.input_type.accepted_responses();
    }

    given_answer(i: string) {
        return this.input_type.given_answer(i);
    }

    start_measurement(task: Task) {
        this.start_time = new Date().getTime().valueOf();
        task.print_task();
    }

    stop_measurement(input: string, task: Task) {
        let end_time = new Date().getTime().valueOf();
        task.given_answer =  this.input_type.get_given_answer(input);
        task.required_milliseconds = end_time - this.start_time;
        task.do_print_after_task_information();
    }

    incorrect_response(i: string, task: Task) {
        let end_time = new Date().getTime().valueOf();
        let given_answer = task.experiment_definition.measurement.get_given_answer(i);
        task.invalid_answers.push([given_answer, end_time - this.start_time])
        task.do_print_error_message(this.input_type.get_given_answer(i));
    }

    output_writer():Experiment_Output_Writer {
        return this.input_type.output_writer;
    }

    get_given_answer(input:string) {
        return this.input_type.get_given_answer(input);
    }

    demands_penalty():boolean {
        return false;
    }

    penalty_is_over() {
        return true;
    }

}

export class Reaction_Time_Measurement extends Measurement_Type {
    constructor(input_type: Experiment_Input_Type) {
        super(input_type);
    }
}

export class Reaction_Time_Penalty_Measurement extends Measurement_Type {

    penalty_milliseconds: number;
    penalty_started:boolean = false;
    penalty_start_point = null;

    constructor(input_type: Experiment_Input_Type, penalty_seconds: number) {
        super(input_type);
        this.penalty_milliseconds = penalty_seconds * 1000;
    }

    demands_penalty():boolean {
        return true;
    }

    incorrect_response(i: string, task: Task) {
        super.incorrect_response(i, task);
        this.penalty_started = true;
        this.penalty_start_point = new Date().getTime().valueOf();

        task.do_print_error_message(this.input_type.get_given_answer(i));
    }

    delete_penalty() {
        this.penalty_started = false;
        this.penalty_start_point = null;
    }

    penalty_is_over() {
        let diff = (new Date().getTime().valueOf())-this.start_time;
        return !this.penalty_started || diff >= this.penalty_milliseconds;
    }

    start_measurement(task: Task) {
        super.start_measurement(task);
        this.delete_penalty();
    }


}


export class Time_To_Finish_Measurement extends Measurement_Type {
    constructor(input_type: Experiment_Input_Type) {
        super(input_type);
    }
}

export class Time_To_Finish_With_Time_Penalty_Measurement extends Time_To_Finish_Measurement {

    penalty_milliseconds: number;
    penalty_started:boolean = false;
    penalty_start_point = null;

    constructor(input_type: Experiment_Input_Type, penalty_seconds: number) {
        super(input_type);
        this.penalty_milliseconds = penalty_seconds * 1000;
    }

    demands_penalty():boolean {
        return true;
    }

    incorrect_response(i: string, task: Task) {
        super.incorrect_response(i, task);
        this.penalty_started = true;
        this.penalty_start_point = new Date().getTime().valueOf();

        task.do_print_error_message(this.input_type.get_given_answer(i));
    }

    delete_penalty() {
        this.penalty_started = false;
        this.penalty_start_point = null;
    }

    penalty_is_over() {
        let diff = (new Date().getTime().valueOf())-this.start_time;
        return !this.penalty_started || diff >= this.penalty_milliseconds;
    }

    start_measurement(task: Task) {
        super.start_measurement(task);
        this.delete_penalty();
    }

}



export abstract class Experiment_Input_Type {

    output_writer: Experiment_Output_Writer;
    abstract accepted_responses():string[];
    abstract given_answer(key_pressed: string);

    constructor(output_writer: Experiment_Output_Writer) {
        this.output_writer = output_writer;
    }

    print_input_request() {
        this.output_writer.ask_for_input();
    }

    get_given_answer(input_string: string) {
        let value = this.output_writer.get_given_answer(input_string);
        return value;
    }
}

export class Key_Pressing extends Experiment_Input_Type {

    accepted_keys: string[];

    constructor(accepted_keys: string[], output_writer: Experiment_Output_Writer) {
        super(output_writer);
        this.accepted_keys = accepted_keys;
    }

    accepted_responses() {
        return this.accepted_keys;
    }

    given_answer(key_pressed: string) {
        return key_pressed;
    }

    print_input_request() {
        // I am a key....no need for input fields
    }

    get_given_answer(input_string: string) {
        return input_string;
    }

}

export class Free_Text_User_Input_Experiment extends Experiment_Input_Type {

    constructor(output_writer: Experiment_Output_Writer) {
        super(output_writer);
    }

    accepted_responses() {
        return ["Enter"];
    }

    given_answer(key_pressed: string) {}

    print_input_request() {
        this.output_writer.ask_for_input();
    }

}

export class Free_Text_User_Input_Experiment_With_PrePost extends Experiment_Input_Type {

    constructor(output_writer: Experiment_Output_Writer, pre: string, post:string) {
        super(output_writer);
    }

    accepted_responses() {
        return ["Enter"];
    }

    given_answer(key_pressed: string) {}

    print_input_request() {
        this.output_writer.ask_for_input();
    }

}

class _Random {

    constructor() {
        // @ts-ignore
        Math.seedrandom('1234567890');
    }

// @ts-ignore

    new_random_integer(upper_limit: number): number {
        return Math.trunc(upper_limit * Math.random());
    }

    set_seed(seed: string) {
        // @ts-ignore
        Math.seedrandom(seed);
    }
}

export const Random = new _Random();

export function SET_SEED(seed: string) {
    Random.set_seed(seed);
}

export function random_integer_up_to_excluding(upper_limit: number): number {
    return Random.new_random_integer(upper_limit);
}

export function do_random_array_sort<T>(array:T[]):T[] {
    let copy = [...array];
    let result = [];
    while(copy.length > 0) {
        result.push(copy.splice(random_integer_up_to_excluding(copy.length), 1)[0]);
    }
    return result;
}

export function random_array_element_and_remove<T>(array:T[]):T {
    let position = random_integer_up_to_excluding(array.length);
    let ret = array[position];
    array.splice(position, 1);
    return ret;
}

export function random_array_element<T>(array:T[]):T {
    return array[random_integer_up_to_excluding(array.length)];
}

export function random_array_element_without<T>(array:T[], exceptions):T {
        let copy = array.filter( e => !exceptions.includes(e) );
        return random_array_element(copy);
}

export function random_array_elements_without_repetitions<T>(array:T[], number_of_elements_to_chose: number):T[] {
    let randomly_sorted_array = do_random_array_sort(array);
    return randomly_sorted_array.slice(0, number_of_elements_to_chose);
}

export function  random_lower_case_letter() {
    return String.fromCharCode(97 + random_integer_up_to_excluding(26));
}

export function  random_lower_case_letter_except(letters:string[]):string {
    while(true) {
        let ret = String.fromCharCode(97 + random_integer_up_to_excluding(26));
        if(!letters.includes(ret))
            return ret;
    }
}

export function  random_upper_case_letter_except(letters:string[]):string {
    while(true) {
        let ret = String.fromCharCode(97 + random_integer_up_to_excluding(26)).toUpperCase();
        if(!letters.includes(ret))
            return ret;
    }
}


// This invocation just makes sure that RANDOM is loaded
dummy();
