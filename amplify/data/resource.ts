import { type ClientSchema, a, defineData, defineFunction } from "@aws-amplify/backend";
import { addUserToGroup } from "./add-user-to-group/resource";

const getGroupByNameHandler = defineFunction({
  entry: './group-handler/handler.ts'
})
/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      groupId: a.id().required(),
      group: a.belongsTo('Group', 'groupId'),
      content: a.string(),
      isDone: a.boolean()
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Group: a.model({
    name: a.string().required(),
    todos: a.hasMany('Todo', 'groupId'),
    group: a.string()
  })
  .authorization((allow) => [allow.groupDefinedIn('group')]),
  GroupUserRelation: a.model({
    groupId: a.id().required(),
    userId: a.id().required()
  })
  .identifier(["groupId","userId"])
  .authorization((allow) => [allow.publicApiKey()]),
  getGroupByName: a
  .query()
  .arguments({name:a.string()})
  .returns(a.ref("Group"))
  .authorization(allow => [allow.publicApiKey()])
  .handler(a.handler.function(getGroupByNameHandler)),
  addUserToGroup: a
    .mutation()
    .arguments({
      userId: a.string().required(),
      groupName: a.string().required(),
    })
    .authorization((allow) => [allow.group("ADMINS")])
    .handler(a.handler.function(addUserToGroup))
    .returns(a.json())
  
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
