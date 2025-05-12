let SEED = "167";
Nof1.SET_SEED(SEED);

// 2) Snippet-Paare definieren

let idx = 0;

const functionPairs = [
    {
        explicit:
            `def calculate_order_total(order_items):
    total = 0
    for item in order_items:
        total += item.price * item.quantity
    return total`,
        abstract:
            `def a(b):
    c = 0
    for d in b:
        c += d.price * d.quantity
    return c`
    },
    {
        explicit:
            `def is_user_adult(user):
    if user.age >= 18:
        return True
    else:
        return False`,
        abstract:
            `def e(f):
    if f.age >= 18:
        return True
    else:
        return False`
    },
    {
        explicit:
            `def format_full_name(first_name, last_name):
    fn = first_name.strip().title()
    ln = last_name.strip().title()
    return \`\${fn} \${ln}\``,
        abstract:
            `def g(h, i):
    j = h.strip().title()
    k = i.strip().title()
    return \`\${j} \${k}\``
    },
    {
        explicit:
            `def apply_discount(amount, discount_rate):
    discount = amount * discount_rate
    final_price = amount - discount
    return round(final_price, 2)`,
        abstract:
            `def l(m, n):
    o = m * n
    p = m - o
    return round(p, 2)`
    },
    {
        explicit:
            `def filter_even_numbers(numbers):
    evens = []
    for num in numbers:
        if num % 2 == 0:
            evens.append(num)
    return evens`,
        abstract:
            `def q(r):
    s = []
    for t in r:
        if t % 2 == 0:
            s.append(t)
    return s`
    }
];

// 1) Hilfsfunktion zum Auswählen des aktuellen Snippets
function generateSnippet(t) {
    const naming = t.treatment_combination.treatment_combination[0].value;  // "Explicit" oder "Abstract"
    const pair = functionPairs[idx];

    if (pair === undefined) return null;

    // erwartete Antwort
    t.expected_answer = "ready";

    // Snippet in Zeilen aufteilen
    const code = (naming === "Explicit") ? pair.explicit : pair.abstract;
    return code.split("\n");
}

let experiment_configuration_function = (writer) => ({
    experiment_name: "NamingExperiment",
    seed: SEED,

    introduction_pages: writer.stage_string_pages_commands([
        writer.convert_string_to_html_string(
            "Bitte nur starten, wenn du Zeit und Konzentration hast.\n\n" +
            "Drücke F11 für Vollbild."
        ),
        writer.convert_string_to_html_string(
            "Du siehst jeweils kleine Code-Snippets. " +
            "Sobald du sie verstanden hast, tippe „ready“."
        )
    ]),

    pre_run_training_instructions: writer.string_page_command(
        writer.convert_string_to_html_string("Training: Code lesen und „ready“ eintippen.")
    ),

    pre_run_experiment_instructions: writer.string_page_command(
        writer.convert_string_to_html_string("Experiment: Es geht gleich los.")
    ),

    finish_pages: [
        writer.string_page_command(
            writer.convert_string_to_html_string(
                "Fast fertig! Daten werden heruntergeladen.\n\n" +
                "Bitte schicke sie danach an den Versuchsleiter. Danke!"
            )
        )
    ],

    layout: [
        { variable: "Dummy", treatments: ["Abstract", "Explicit"] },
    ],

    training_configuration: {
        can_be_cancelled: false,
        can_be_repeated: false
    },

    repetitions: 2,

    // Zeit bis zur Eingabe von „ready“
    measurement: Nof1.Time_to_finish(Nof1.text_input_experiment),

    task_configuration: (t) => {

        if (idx === functionPairs.length) {
            idx = 0;
        } else {
            idx++;
        }

        t.do_print_task = () => {
            writer.clear_stage();
            const lines = generateSnippet(t);

            writer.print_html_on_stage(
                "<pre class='sourcecode'>" +
                lines.map(l => l.replace(/</g,"&lt;").replace(/>/g,"&gt;")).join("\n") +
                "</pre>" +
                "<p>Tippe <strong>ready</strong>, wenn du den Code verstanden hast.</p>"
            );
        };

        t.accepts_answer_function = (given_answer) =>
            true

        t.do_print_after_task_information = () => {
            writer.clear_error();
            writer.print_string_on_stage(
                writer.convert_string_to_html_string(
                    "Mach ggf. kurz Pause.\n\nDrücke [Enter] zum Weiter."
                )
            );
        };
    }
});

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);
