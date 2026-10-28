import {pathToFileURL} from 'node:url';
export {checkStickVController} from './check-atom-stick-legacy-controllers.mjs';
import {checkStickVController} from './check-atom-stick-legacy-controllers.mjs';
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkStickVController(),null,2));
