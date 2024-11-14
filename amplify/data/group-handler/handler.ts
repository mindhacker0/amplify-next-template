import type { Schema } from '../resource'

export const handler: Schema["getGroupByName"]["functionHandler"] = async (event, context) => {
  console.log(event)
  const start = performance.now();
  return {
    name: `Echoing content: ${event.arguments.name}`,
    executionDuration: performance.now() - start
  } as any;
};