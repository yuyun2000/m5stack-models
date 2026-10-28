import {pathToFileURL} from 'node:url';
import {checkKit} from './check-atom-voice-kits.mjs';
export const checkAtomS3RM12VolcengineKitController=()=>checkKit('atoms3r-m12-volcengine-kit');
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkAtomS3RM12VolcengineKitController(),null,2));
