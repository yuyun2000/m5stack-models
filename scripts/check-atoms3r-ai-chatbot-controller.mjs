import {pathToFileURL} from 'node:url';
import {checkKit} from './check-atom-voice-kits.mjs';
export const checkAtomS3RAIChatbotController=()=>checkKit('atoms3r-ai-chatbot');
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkAtomS3RAIChatbotController(),null,2));
