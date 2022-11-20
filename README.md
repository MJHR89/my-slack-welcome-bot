# Building a Modular Slack App - Welcome Bot

This sample app is a Welcome Bot that helps create, store and send friendly
welcome messages when a user joins a channel. This is a step by step (branch by
branch) version of the Welcome Bot app for learning purposes. You can find the
sample app at github.com/slack-samples/deno-welcome-bot.

**Guide Outline**:

- [Setup](#setup)
  - [Install the Slack CLI](#install-the-slack-cli)
  - [Clone the Template](#clone-the-template)
- [Step 1: Create the Welcome Message Workflow](#create-the-welcome-message-workflow)
- [Step 2: Initialize your Datastore](#running-your-project-locally)
- [Step 3: Create the Custom Function to Save the Message](#create-the-custom-function-to-save-the-message)
- [Step 4: Create the Custom Function to Send the Message to Channel](#create-the-custom-function-to-send-the-message-to-channel)
- [Step 5: Create the Send Message to Channel Workflow](#create-the-send-message-to-channel-workflow)
- [Step 6: Create Event Trigger](#create-event-trigger)
- [Step 7: Create the Link Trigger Definition for the Create Message Workflow](#create-the-link-trigger-definition-for-the-create-message-workflow)
- [Create a Link Trigger](#create-a-link-trigger)
- [Running Your Project Locally](#running-your-project-locally)
- [Datastores](#datastores)
- [Testing](#testing)
- [Deploying Your App](#deploying-your-app)
  - [Viewing Activity Logs](#viewing-activity-logs)
- [Project Structure](#project-structure)
- [Resources](#resources)

---

## Setup

Before getting started, make sure you have a development workspace where you
have permissions to install apps. If you don’t have one set up, go ahead and
[create one](https://slack.com/create). Also, please note that the workspace
requires any of [the Slack paid plans](https://slack.com/pricing).

### Install the Slack CLI

To use this template, you first need to install and configure the Slack CLI.
Step-by-step instructions can be found in our
[Quickstart Guide](https://api.slack.com/future/quickstart).

### Clone the Template

Start by cloning this repository:

```zsh
# Clone this project onto your machine
$ slack create my-app -t MJHR89/my-slack-welcome-bot

# Change into this project directory
$ cd my-app
```

## Step 1: Create the Welcome Message Workflow

- In the workflows folder create a new file (i.e. create_welcome_message.ts)
- Define the workflow
- Workflow **Step 1**: use
  [OpenForm](https://api.slack.com/future/functions#open-a-form) builtin
  function to collect the **message** and the **channel** where the message will
  be posted
- Workflow **Step 2**: use
  [SendEphemeralMessage](https://api.slack.com/future/functions#send-ephemeral-message)
  builtin function to confirm that the message was successfully created
  (channel_id, user_id and message)
- In the functions folder create a new file (i.e. create_welcome_message.ts),
  and leave it empty for now. Return to the workflow.
- Workflow **Step 3**: create a
  [custom function](https://api.slack.com/future/functions/custom) to persist
  the message in the datastore. In this step you can add it as a step and pass
  the arguments (message, channel, author), in step 3 branch we're going to
  define it and implement it. But you can now import it from the function file
  you just created.
- Add your workflow to the manifest definition.

## Step 2: Initialize the Datastore

- You can reuse (and rename) the sample_datastore.ts file (i.e. messages.ts)
- Define the datastore: id, channel, message, author
- Add it to the manifest
  - Check for the right scopes: `datastore:read`, `datastore:write`

## Step 3: Create the Custom Function to Save the Message

- Define the function (message, channel, author)
- Implement the function to save the inputs into datastore
  - Import the [SlackAPI library](https://api.slack.com/future/apicalls#import)
  - Add the [token context](https://api.slack.com/future/apicalls#token)
  - Instantiate the
    [Slack API client](https://api.slack.com/future/apicalls#client)
  - Generate a random UUID using the builtin Web Cryptography API for example
    `const uuid = crypto.randomUUID();`
  - [Create](https://api.slack.com/future/datastores#put) the message in the
    datastore: id, channel, message, author. We use DynamoDB.
    - Catch the response error
    - `else` console.log(”The message was successfully created”

## Step 4: Create the Custom Function to Send the Message to Channel

- In the functions folder create a new file (i.e. send_welcome_message.ts)
- Define the function (channel, triggered_user)
- Implement the function to retrieve the message from the datastore
  - Import the [SlackAPI library](https://api.slack.com/future/apicalls#import)
  - Add the [token context](https://api.slack.com/future/apicalls#token)
  - Instantiate the
    [Slack API client](https://api.slack.com/future/apicalls#client)
  - [Retrieve](https://api.slack.com/future/datastores#query_multiple) the
    message from the datastore
  - Use the
    [chat.postEphemeral](https://api.slack.com/methods/chat.postEphemeral)
    method to post your message to the channel (channel, text, user)

## Step 5: Create the Send Message to Channel Workflow

- In the workflows folder create a new file (i.e. send_welcome_message.ts)
- Define the workflow (channel, triggered_user)
- Workflow **Step 1**: custom Function to get message from datastore (channel,
  triggered_user)
- Add your workflow to the manifest definition.

## Step 6: Create Event Trigger

- Go back to the first custom function (step 3) to create a message
- Instead of console logging that the message was created, let’s invoke the
  SendMessageWorkflow using an
  [event trigger](https://api.slack.com/future/triggers/event#create-runtime)
  that listens to the `user_joined_channel` event.
- Add the `channels:read` scope to the manifest.

## Step 7: Create the Link Trigger Definition for the Create Message Workflow

- In the triggers folder create a new file (i.e.
  create_welcome_message_shortcut.ts)
- It invokes the create welcome message workflow (workflow name in snake_case)
  - Interactivity, channel
- Add the `triggers:write` scope to the manifest.

---

> If you've got to this point, congratulations! You've created a fully
> functioning modular Slack app! Now, let's see it in action.

- First, we need to [run](#running-your-project-locally) or
  [deploy](#deploying-your-app) our app.
- Second, we need to create a [Link Trigger](#create-a-link-trigger).
- Lastly, we're gonna paste our link trigger into our sandbox workspace and test
  the whole flow! Have fun!

## Create a Link Trigger

[Triggers](https://api.slack.com/future/triggers) are what cause Workflows to
run. These Triggers can be invoked by a user, or automatically as a response to
an event within Slack.

A [Link Trigger](https://api.slack.com/future/triggers/link) is a type of
Trigger that generates a **Shortcut URL** which, when posted in a channel or
added as a bookmark, becomes a link. When clicked, the Link Trigger will run the
associated Workflow.

Link Triggers are _unique to each installed version of your app_. This means
that Shortcut URLs will be different across each workspace, as well as between
[locally run](#running-your-project-locally) and
[deployed apps](#deploying-your-app). When creating a Trigger, you must select
the Workspace that you'd like to create the Trigger in. Each Workspace has a
development version (denoted by `(dev)`), as well as a deployed version.

To create a Link Trigger for the Workflow in this template, run the following
command:

```zsh
$ slack trigger create --trigger-def triggers/sample_trigger.ts
```

After selecting a Workspace, the output provided will include the Link Trigger
Shortcut URL. Copy and paste this URL into a channel as a message, or add it as
a bookmark in a channel of the Workspace you selected.

**Note: this link won't run the Workflow until the app is either running locally
or deployed!** Read on to learn how to run your app locally and eventually
deploy it to Slack hosting.

## Running Your Project Locally

While building your app, you can see your changes propagated to your workspace
in real-time with `slack run`. In both the CLI and in Slack, you'll know an app
is the development version if the name has the string `(dev)` appended.

```zsh
# Run app locally
$ slack run

Connected, awaiting events
```

To stop running locally, press `<CTRL> + C` to end the process.

## Testing

For an example of how to test a function, see
`functions/sample_function_test.ts`. Test filenames should be suffixed with
`_test`.

Run all tests with `deno test`:

```zsh
$ deno test
```

## Deploying Your App

Once you're done with development, you can deploy the production version of your
app to Slack hosting using `slack deploy`:

```zsh
$ slack deploy
```

After deploying, [create a new Link Trigger](#create-a-link-trigger) for the
production version of your app (not appended with `(dev)`). Once the Trigger is
invoked, the Workflow should run just as it did in when developing locally.

### Viewing Activity Logs

Activity logs for the production instance of your application can be viewed with
the `slack activity` command:

```zsh
$ slack activity
```

## Project Structure

### `manifest.ts`

The [app manifest](https://api.slack.com/future/manifest) contains the app's
configuration. This file defines attributes like app name and description.

### `slack.json`

Used by the CLI to interact with the project's SDK dependencies. It contains
script hooks that are executed by the CLI and implemented by the SDK.

### `/functions`

[Functions](https://api.slack.com/future/functions) are reusable building blocks
of automation that accept inputs, perform calculations, and provide outputs.
Functions can be used independently or as steps in Workflows.

### `/workflows`

A [Workflow](https://api.slack.com/future/workflows) is a set of steps that are
executed in order. Each step in a Workflow is a function.

Workflows can be configured to run without user input or they can collect input
by beginning with a [form](https://api.slack.com/future/forms) before continuing
to the next step.

### `/triggers`

[Triggers](https://api.slack.com/future/triggers) determine when Workflows are
executed. A trigger file describes a scenario in which a workflow should be run,
such as a user pressing a button or when a specific event occurs.

### `/datastores`

[Datastores](https://api.slack.com/future/datastores) can securely store and
retrieve data for your application. Required scopes to use datastores include
`datastore:write` and `datastore:read`.

## Resources

To learn more about developing with the CLI, you can visit the following guides:

- [Creating a new app with the CLI](https://api.slack.com/future/create)
- [Configuring your app](https://api.slack.com/future/manifest)
- [Developing locally](https://api.slack.com/future/run)

To view all documentation and guides available, visit the
[Overview page](https://api.slack.com/future/overview).
