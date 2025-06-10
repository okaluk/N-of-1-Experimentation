# N-of-1 Experiments

This repo contains code for running N-of-1 experiments. If you are interested in N-of-1 experiments in programming and software science, you might want to read the following paper (available via public access):

[Hanenberg, Mehlhorn, "Two N-of-1 self-trials on readability differences between anonymous inner classes (AICs) and lambda expressions (LEs) on Java code snippets", Empir. Softw. Eng. 27(2): 33 (2022)](https://doi.org/10.1007/s10664-021-10077-3)

Experiments that use this code (likely older versions) can be found here:
[https://github.com/shanenbe/Experiments](https://github.com/shanenbe/Experiments)

If you simply want to run an N-of-1 experiment, download the most recent template.


The template for an N-of-1 experiment consists of three files and can be downloaded here:
[https://github.com/shanenbe/N-of-1-Experimentation/tree/main/___BUILD_LIB_FILE_TestExperiment](https://github.com/shanenbe/N-of-1-Experimentation/tree/main/___BUILD_LIB_FILE_TestExperiment)
- index.html: the starting page for the experiment. This HTML file loads the following two files.
- lib.js: the library (this repo packed via webpack). You probably do not want to inspect it because it is generated.
- exp_trial02.js: the code of the experiment you want to run (the downloaded version is just a mock).

To run an experiment, edit exp_trial02.js and then open the HTML page.

Probably the easiest way to get into the code is to look into __EXAMPLES.
