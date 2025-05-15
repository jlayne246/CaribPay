/**
	<< Server.ts >>
    Summary: The entrypoint for the backend of the application as the base of the server.
    Imports:
    - [module_name]: [what it provides to the file]
    Exports:
    - [function_name]: [what is exported and its purpose]
    Usage Example:

*/

import { createApp } from './app'; // Imports the server app object from ./app
import { env_mod } from 'framework'; // Imports the environment variables object from the framework

const PORT = env_mod.env.PORT || 3000; // Sets the server port as what is in the environment variables set, or to 3000 by default

/**
	<< startServer() >>
    Summary: The function provides a means of starting the server
    Async: false
    Visibility: [external or internal] => [nature of function w.r.t. visibility and usage]
    Input Parameters:
    - param1: [type] => [description of parameter]
    - param2: [type] => [description of parameter]
    Return Value:
    - [var]: [type] => [description of return value]
    Dependencies:
    - [library_1]: [purpose of the dependency]
    - [library_2]: [purpose of the dependency]
    Line Calls: [line_number] => [function/method being called]
    Usage Example:

*/
const startServer = () => {
    const app = createApp(); // Returns a server app object

    app.listen(PORT, () => {
        console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
};

export { startServer };
