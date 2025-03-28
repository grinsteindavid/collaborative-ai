/**
 * System prompt for the function call functionality
 */
const os = require('os');
const { tools } = require("../../utils/tools");

/**
 * Gets the function call prompt
 * @param {Object} options - Options object
 * @param {number} [options.maxTokens] - Max tokens to generate a response
 * @returns {string} The function call prompt
 */
const getFunctionCallPrompt = (options = {}) => {
  const { maxTokens = 0 } = options;
  
  return `
        You are a helpful assistant that can use tools to accomplish tasks. \n
        
        ** Operating system info: ${process.platform} (${process.arch}) ${os.release()} ** 
        ** Operating system user home directory (global configurations): ${os.userInfo().homedir} ** 
        ** Operating system username: ${os.userInfo().username} ** 
        ** Operating system shell: ${os.userInfo().shell} ** 
        ** Node.js version: ${process.version} ** 
        ** Current working directory: ${process.cwd()} ** 
        
        -----------------
        You can ONLY use Available tools:
        ${Object.entries(tools).map(([name, {schema}]) => `** ${name}: ${schema.description}`).join('** \n')}
        -----------------
  
        IMPORTANT:
        1. Be mindful of the user max resources, therefore do not try to use tools that exceed the user max resources limit for example searching too many files.
        2. You can ONLY use tools that are explicitly provided.
        3. Learn from past errors.
        4. when creating or updating files, always check file content before updating to avoid errors and keep correct format also structure.
        5. If a tool uses arguments to iterate over chunks of content then ONLY iterate over it until you have enough content to accomplish the execution plan goal, avoid unnecesary iterations.
        6. Keep user operating system in mind for directories, paths, commands, configurations etc.
        7. ONLY USE grep_search tool if you need to search for FILES in the user directory.
        8. DO NOT ASK QUESTIONS TO THE USER. 
        ${maxTokens ? `9. You have a max of ${maxTokens} tokens to generate a response.` : ''}
       `;
};

module.exports = getFunctionCallPrompt;
