import { Manifest } from "deno-slack-sdk/mod.ts";
import { MessageSetupDatastore } from "./datastores/messages.ts";
import { MessageSetupWorkflow } from "./workflows/create_welcome_message.ts";
import { SendWelcomeMessageWorkflow } from "./workflows/send_welcome_message.ts";
import SampleObjectDatastore from "./datastores/sample_datastore.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "slack-deno-starter-template",
  description: "A template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  workflows: [MessageSetupWorkflow, SendWelcomeMessageWorkflow],
  outgoingDomains: [],
  datastores: [MessageSetupDatastore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});
