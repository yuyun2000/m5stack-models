/** Current frozen Atom controllers only. Imported helpers do not auto-run. */
import {pathToFileURL} from 'node:url';
import {checkAtomLiteController} from './check-atom-lite-controller.mjs';
import {checkAtomMatrixController} from './check-atom-matrix-controller.mjs';
import {checkAtomS3LiteController} from './check-atoms3-lite-controller.mjs';

export async function checkAtomControllers(){
 const products={};
 products['atom-lite']=await checkAtomLiteController();
 products['atom-matrix']=await checkAtomMatrixController();
 products['atoms3-lite']=await checkAtomS3LiteController();
 for(const [id,result]of Object.entries(products))if(!result||result.status!=='pass')throw Error(id+': controller helper must explicitly return pass');
 return {status:'pass',products,scope:'Current frozen three-controller fixtures only;not hardware/GPU/manufacturing acceptance'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 console.log(JSON.stringify(await checkAtomControllers(),null,2));
}
