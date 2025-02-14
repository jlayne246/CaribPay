// These lines import methods and objects from the utilities and config files into the starting point of the framework.
import logger from './utils/logger';
import * as db_mod from './config/db';
import * as env_mod from './config/env';

// This exports the functions and objects imported from the subdirectories of the framework as members of the framework package which may be received in the app as an npm package, whereby these members can be called using this syntax "import {x} from 'framework'".
export {logger, db_mod, env_mod};

