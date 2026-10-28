import {pathToFileURL} from 'node:url';
export {checkM5StickController} from './check-atom-stick-legacy-controllers.mjs';
import {checkM5StickController} from './check-atom-stick-legacy-controllers.mjs';
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkM5StickController(),null,2));
