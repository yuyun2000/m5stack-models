import {pathToFileURL} from 'node:url';
import {checkKit} from './check-atom-voice-kits.mjs';
export const checkAtomS3RCAMAIChatbotController=()=>checkKit('atoms3r-cam-ai-chatbot');
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkAtomS3RCAMAIChatbotController(),null,2));
