const { listDirectories, listDirectoriesSchema } = require('../tools/listDirectories');
const { readFile, readFileSchema } = require('../tools/readFile');
const { grepSearch, grepSearchSchema } = require('../tools/searchGrep');
const { findFiles, findFilesSchema } = require('../tools/findFiles');
const { createFile, createFileSchema } = require('../tools/createFile');
const { webSearch, webSearchSchema } = require('../tools/webSearch');
const { gitApply, gitApplySchema } = require('../tools/gitApply');
const { validateSchema } = require('./validation');
const { addMessage } = require('./context');

// Define available tools and their schemas
const tools = {
  list_directories: {
    schema: listDirectoriesSchema,
    execute: listDirectories,
    format: (result) => {
      console.log(`-- Matches: ${result.directories.length}`);
      return result.directories;
    }
  },
  read_file_content: {
    schema: readFileSchema,
    execute: readFile,
    format: (result) => {
      return result.content;
    }
  },
  grep_search: {
    schema: grepSearchSchema,
    execute: grepSearch,
    format: (result) => {
      console.log(`-- Matches: ${result.matches.length}`);
      return result.matches;
    }
  },
  find_files: {
    schema: findFilesSchema,
    execute: findFiles,
    format: (result) => {
      console.log(`-- Matches: ${result.files.length}`);
      return result.files;
    }
  },
  create_file: {
    schema: createFileSchema,
    execute: createFile,
    format: (result) => {
      console.log(`-- ${result.message}`);
      return result;
    }
  },
  web_search: {
    schema: webSearchSchema,
    execute: webSearch,
    format: (result) => {
      console.log(`-- Results: ${result.results.length}`);
      return result.results;
    }
  },
  git_apply: {
    schema: gitApplySchema,
    execute: gitApply,
    description: "Uses git apply with provided content to make file content changes.",
    format: (result) => {
      console.log(`-- ${result.success ? 'Patch applied successfully' : 'Failed to apply patch'}`);
      return result.output;
    }
  },
};

/**
 * Execute a tool with the provided arguments
 * @param {string} toolName - Name of the tool to execute
 * @param {Object} args - Arguments to pass to the tool
 */
async function executeTool(toolName, args) {
  const tool = tools[toolName];
  if (!tool) {
    console.error(`Unknown tool: ${toolName}`);
    addMessage('user', `Unknown tool: ${toolName}`);
    return;
  }

  if (!validateSchema(args, tool.schema)) {
    console.error(`Invalid arguments for '${toolName}'`);
    addMessage('user', `Invalid arguments for '${toolName}'`);
    return;
  }

  try {
    const rawResult = await tool.execute(...Object.values(args));
    const result = tool.format(rawResult);
    addMessage('user', `${toolName} RESULT: ${JSON.stringify(result)}`);
  } catch (error) {
    console.error(`Tool error:`, error || error.error || error.message);
    addMessage('user', `${toolName} ERROR: ${error ||error.error || error.message}`);
  }
}

module.exports = {
  tools,
  executeTool
};
