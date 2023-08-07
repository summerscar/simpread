> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [docs.github.com](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#environment-files)

> You can use workflow commands when running shell commands in a workflow or in an action's code.

You can use workflow commands when running shell commands in a workflow or in an action's code.

[About workflow commands](#about-workflow-commands)
---------------------------------------------------

Actions can communicate with the runner machine to set environment variables, output values used by other actions, add debug messages to the output logs, and other tasks.

Most workflow commands use the `echo` command in a specific format, while others are invoked by writing to a file. For more information, see "[Environment files](#environment-files)."

### [Example of a workflow command](#example-of-a-workflow-command)

**Note:** Workflow command and parameter names are not case-sensitive.

**Warning:** If you are using Command Prompt, omit double quote characters (`"`) when using workflow commands.

The [actions/toolkit](https://github.com/actions/toolkit) includes a number of functions that can be executed as workflow commands. Use the `::` syntax to run the workflow commands within your YAML file; these commands are then sent to the runner over `stdout`. For example, instead of using code to create an error annotation, as below:

JavaScriptcore.error('Missing semicolon', {file: 'app.js', startLine: 1})

### [Example: Creating an annotation for an error](#example-creating-an-annotation-for-an-error)

You can use the `error` command in your workflow to create the same error annotation:

The following table shows which toolkit functions are available within a workflow:

<table><thead><tr><th scope="col">Toolkit function</th><th scope="col">Equivalent workflow command</th></tr></thead><tbody><tr><td><code>core.addPath</code></td><td>Accessible using environment file <code>GITHUB_PATH</code></td></tr><tr><td><code>core.debug</code></td><td><code>debug</code></td></tr><tr><td><code>core.notice</code></td><td><code>notice</code></td></tr><tr><td><code>core.error</code></td><td><code>error</code></td></tr><tr><td><code>core.endGroup</code></td><td><code>endgroup</code></td></tr><tr><td><code>core.export<wbr>Variable</code></td><td>Accessible using environment file <code>GITHUB_ENV</code></td></tr><tr><td><code>core.getInput</code></td><td>Accessible using environment variable <code>INPUT_{NAME}</code></td></tr><tr><td><code>core.getState</code></td><td>Accessible using environment variable <code>STATE_{NAME}</code></td></tr><tr><td><code>core.isDebug</code></td><td>Accessible using environment variable <code>RUNNER_DEBUG</code></td></tr><tr><td><code>core.summary</code></td><td>Accessible using environment file <code>GITHUB_STEP_SUMMARY</code></td></tr><tr><td><code>core.saveState</code></td><td>Accessible using environment file <code>GITHUB_STATE</code></td></tr><tr><td><code>core.set<wbr>Command<wbr>Echo</code></td><td><code>echo</code></td></tr><tr><td><code>core.setFailed</code></td><td>Used as a shortcut for <code>::error</code> and <code>exit 1</code></td></tr><tr><td><code>core.setOutput</code></td><td>Accessible using environment file <code>GITHUB_OUTPUT</code></td></tr><tr><td><code>core.setSecret</code></td><td><code>add-mask</code></td></tr><tr><td><code>core.startGroup</code></td><td><code>group</code></td></tr><tr><td><code>core.warning</code></td><td><code>warning</code></td></tr></tbody></table>

[Setting a debug message](#setting-a-debug-message)
---------------------------------------------------

Prints a debug message to the log. You must create a secret named `ACTIONS_STEP_DEBUG` with the value `true` to see the debug messages set by this command in the log. For more information, see "[Enabling debug logging](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging)."

### [Example: Setting a debug message](#example-setting-a-debug-message)

[Setting a notice message](#setting-a-notice-message)
-----------------------------------------------------

Creates a notice message and prints the message to the log. This message will create an annotation, which can associate the message with a particular file in your repository. Optionally, your message can specify a position within the file.

Text::notice file={name},line={line},endLine={endLine},title={title}::{message}<table><thead><tr><th scope="col">Parameter</th><th scope="col">Value</th></tr></thead><tbody><tr><td><code>title</code></td><td>Custom title</td></tr><tr><td><code>file</code></td><td>Filename</td></tr><tr><td><code>col</code></td><td>Column number, starting at 1</td></tr><tr><td><code>endColumn</code></td><td>End column number</td></tr><tr><td><code>line</code></td><td>Line number, starting at 1</td></tr><tr><td><code>endLine</code></td><td>End line number</td></tr></tbody></table>

### [Example: Setting a notice message](#example-setting-a-notice-message)

[Setting a warning message](#setting-a-warning-message)
-------------------------------------------------------

Creates a warning message and prints the message to the log. This message will create an annotation, which can associate the message with a particular file in your repository. Optionally, your message can specify a position within the file.

Text::warning file={name},line={line},endLine={endLine},title={title}::{message}<table><thead><tr><th scope="col">Parameter</th><th scope="col">Value</th></tr></thead><tbody><tr><td><code>title</code></td><td>Custom title</td></tr><tr><td><code>file</code></td><td>Filename</td></tr><tr><td><code>col</code></td><td>Column number, starting at 1</td></tr><tr><td><code>endColumn</code></td><td>End column number</td></tr><tr><td><code>line</code></td><td>Line number, starting at 1</td></tr><tr><td><code>endLine</code></td><td>End line number</td></tr></tbody></table>

### [Example: Setting a warning message](#example-setting-a-warning-message)

[Setting an error message](#setting-an-error-message)
-----------------------------------------------------

Creates an error message and prints the message to the log. This message will create an annotation, which can associate the message with a particular file in your repository. Optionally, your message can specify a position within the file.

Text::error file={name},line={line},endLine={endLine},title={title}::{message}<table><thead><tr><th scope="col">Parameter</th><th scope="col">Value</th></tr></thead><tbody><tr><td><code>title</code></td><td>Custom title</td></tr><tr><td><code>file</code></td><td>Filename</td></tr><tr><td><code>col</code></td><td>Column number, starting at 1</td></tr><tr><td><code>endColumn</code></td><td>End column number</td></tr><tr><td><code>line</code></td><td>Line number, starting at 1</td></tr><tr><td><code>endLine</code></td><td>End line number</td></tr></tbody></table>

### [Example: Setting an error message](#example-setting-an-error-message)

[Grouping log lines](#grouping-log-lines)
-----------------------------------------

Creates an expandable group in the log. To create a group, use the `group` command and specify a `title`. Anything you print to the log between the `group` and `endgroup` commands is nested inside an expandable entry in the log.

Text::group::{title} ::endgroup::

### [Example: Grouping log lines](#example-grouping-log-lines)

![](https://docs.github.com/assets/cb-4487/images/help/actions/actions-log-group.png)

[Masking a value in a log](#masking-a-value-in-a-log)
-----------------------------------------------------

Masking a value prevents a string or variable from being printed in the log. Each masked word separated by whitespace is replaced with the `*` character. You can use an environment variable or string for the mask's `value`. When you mask a value, it is treated as a secret and will be redacted on the runner. For example, after you mask a value, you won't be able to set that value as an output.

### [Example: Masking a string](#example-masking-a-string)

When you print `"Mona The Octocat"` in the log, you'll see `"***"`.

**Warning:** Make sure you register the secret with 'add-mask' before outputting it in the build logs or using it in any other workflow commands.

### [Example: Masking an environment variable](#example-masking-an-environment-variable)

When you print the variable `MY_NAME` or the value `"Mona The Octocat"` in the log, you'll see `"***"` instead of `"Mona The Octocat"`.

### [Example: Masking a generated output within a single job](#example-masking-a-generated-output-within-a-single-job)

If you do not need to pass your secret from one job to another job, you can:

1.  Generate the secret (without outputting it).

2.  Mask it with `add-mask`.

3.  Use `GITHUB_OUTPUT` to make the secret available to other steps within the job.


### [Example: Masking and passing a secret between jobs or workflows](#example-masking-and-passing-a-secret-between-jobs-or-workflows)

If you want to pass a masked secret between jobs or workflows, you should store the secret in a store and then retrieve it in the subsequent job or workflow.

#### [Setup](#setup)

1.  Set up a secret store to store the secret that you will generate during your workflow. For example, Vault.
2.  Generate a key for reading and writing to that secret store. Store the key as a repository secret. In the following example workflow, the secret name is `SECRET_STORE_CREDENTIALS`. For more information, see "[Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)."

#### [Workflow](#workflow)

**Note**: This workflow uses an imaginary secret store, `secret-store`, which has imaginary commands `store-secret` and `retrieve-secret`. `some/secret-store@ 27b31702a0e7fc50959f5ad993c78deac1bdfc29` is an imaginary action that installs the `secret-store` application and configures it to connect to an `instance` with `credentials`.

[Stopping and starting workflow commands](#stopping-and-starting-workflow-commands)
-----------------------------------------------------------------------------------

Stops processing any workflow commands. This special command allows you to log anything without accidentally running a workflow command. For example, you could stop logging to output an entire script that has comments.

Text::stop-commands::{endtoken}

To stop the processing of workflow commands, pass a unique token to `stop-commands`. To resume processing workflow commands, pass the same token that you used to stop workflow commands.

**Warning:** Make sure the token you're using is randomly generated and unique for each run.

### [Example: Stopping and starting workflow commands](#example-stopping-and-starting-workflow-commands)

[Sending values to the pre and post actions](#sending-values-to-the-pre-and-post-actions)
-----------------------------------------------------------------------------------------

You can create environment variables for sharing with your workflow's `pre:` or `post:` actions by writing to the file located at `GITHUB_STATE`. For example, you can create a file with the `pre:` action, pass the file location to the `main:` action, and then use the `post:` action to delete the file. Alternatively, you could create a file with the `main:` action, pass the file location to the `post:` action, and also use the `post:` action to delete the file.

If you have multiple `pre:` or `post:` actions, you can only access the saved value in the action where it was written to `GITHUB_STATE`. For more information on the `post:` action, see "[Metadata syntax for GitHub Actions](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#runspost)."

The `GITHUB_STATE` file is only available within an action. The saved value is stored as an environment value with the `STATE_` prefix.

This example uses JavaScript to write to the `GITHUB_STATE` file. The resulting environment variable is named `STATE_processID` with the value of `12345`:

JavaScriptimport * as fs from 'fs' import * as os from 'os' fs.appendFileSync(process.env.GITHUB_STATE, `processID=12345${os.EOL}`, { encoding: 'utf8' })

The `STATE_processID` variable is then exclusively available to the cleanup script running under the `main` action. This example runs in `main` and uses JavaScript to display the value assigned to the `STATE_processID` environment variable:

JavaScriptconsole.log("The running PID from the main action is: " + process.env.STATE_processID);

[Environment files](#environment-files)
---------------------------------------

During the execution of a workflow, the runner generates temporary files that can be used to perform certain actions. The path to these files are exposed via environment variables. You will need to use UTF-8 encoding when writing to these files to ensure proper processing of the commands. Multiple commands can be written to the same file, separated by newlines.

Most commands in the following examples use double quotes for echoing strings, which will attempt to interpolate characters like `$` for shell variable names. To always use literal values in quoted strings, you can use single quotes instead.

[Setting an environment variable](#setting-an-environment-variable)
-------------------------------------------------------------------

You can make an environment variable available to any subsequent steps in a workflow job by defining or updating the environment variable and writing this to the `GITHUB_ENV` environment file. The step that creates or updates the environment variable does not have access to the new value, but all subsequent steps in a job will have access. The names of environment variables are case-sensitive, and you can include punctuation. For more information, see "[Variables](https://docs.github.com/en/actions/learn-github-actions/variables)."

You can't overwrite the value of the default environment variables named `GITHUB_*` and `RUNNER_*`. Currently you can overwrite the value of the `CI` variable. However, it's not guaranteed that this will always be possible. For more information about the default environment variables, see"[Variables](https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables)."

### [Example of writing an environment variable to `GITHUB_ENV`](#example-of-writing-an-environment-variable-to-github_env)

### [Multiline strings](#multiline-strings)

For multiline strings, you may use a delimiter with the following syntax.

Text{name}<<{delimiter} {value} {delimiter}

**Warning:** Make sure the delimiter you're using is randomly generated and unique for each run. For more information, see"[Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#understanding-the-risk-of-script-injections)".

#### [Example of a multiline string](#example-of-a-multiline-string)

This example selects a random value for `$EOF` as a delimiter, and sets the `JSON_RESPONSE` environment variable to the value of the `curl` response.

[Setting an output parameter](#setting-an-output-parameter)
-----------------------------------------------------------

Sets a step's output parameter. Note that the step will need an `id` to be defined to later retrieve the output value. You can set multi-line output values with the same technique used in the "[Multiline strings](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#multiline-strings)" section to define multi-line environment variables.

### [Example of setting an output parameter](#example-of-setting-an-output-parameter)

[Adding a job summary](#adding-a-job-summary)
---------------------------------------------

You can set some custom Markdown for each job so that it will be displayed on the summary page of a workflow run. You can use job summaries to display and group unique content, such as test result summaries, so that someone viewing the result of a workflow run doesn't need to go into the logs to see important information related to the run, such as failures.

Job summaries support [GitHub flavored Markdown](https://github.github.com/gfm/), and you can add your Markdown content for a step to the `GITHUB_STEP_SUMMARY` environment file. `GITHUB_STEP_SUMMARY` is unique for each step in a job. For more information about the per-step file that `GITHUB_STEP_SUMMARY` references, see "[Environment files](#environment-files)."

When a job finishes, the summaries for all steps in a job are grouped together into a single job summary and are shown on the workflow run summary page. If multiple jobs generate summaries, the job summaries are ordered by job completion time.

### [Example of adding a job summary](#example-of-adding-a-job-summary)

![](https://docs.github.com/assets/cb-24677/images/help/actions/actions-job-summary-simple-example.png)

### [Multiline Markdown content](#multiline-markdown-content)

For multiline Markdown content, you can use `>>` to continuously append content for the current step. With every append operation, a newline character is automatically added.

#### [Example of multiline Markdown content](#example-of-multiline-markdown-content)

### [Overwriting job summaries](#overwriting-job-summaries)

To clear all content for the current step, you can use `>` to overwrite any previously added content.

#### [Example of overwriting job summaries](#example-of-overwriting-job-summaries)

### [Removing job summaries](#removing-job-summaries)

To completely remove a summary for the current step, the file that `GITHUB_STEP_SUMMARY` references can be deleted.

#### [Example of removing job summaries](#example-of-removing-job-summaries)

After a step has completed, job summaries are uploaded and subsequent steps cannot modify previously uploaded Markdown content. Summaries automatically mask any secrets that might have been added accidentally. If a job summary contains sensitive information that must be deleted, you can delete the entire workflow run to remove all its job summaries. For more information see "[Deleting a workflow run](https://docs.github.com/en/actions/managing-workflow-runs/deleting-a-workflow-run)."

### [Step isolation and limits](#step-isolation-and-limits)

Job summaries are isolated between steps and each step is restricted to a maximum size of 1MiB. Isolation is enforced between steps so that potentially malformed Markdown from a single step cannot break Markdown rendering for subsequent steps. If more than 1MiB of content is added for a step, then the upload for the step will fail and an error annotation will be created. Upload failures for job summaries do not affect the overall status of a step or a job. A maximum of 20 job summaries from steps are displayed per job.

[Adding a system path](#adding-a-system-path)
---------------------------------------------

Prepends a directory to the system `PATH` variable and automatically makes it available to all subsequent actions in the current job; the currently running action cannot access the updated path variable. To see the currently defined paths for your job, you can use `echo "$PATH"` in a step or an action.

### [Example of adding a system path](#example-of-adding-a-system-path)
