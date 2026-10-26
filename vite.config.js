import {defineConfig} from 'vite';
import path from 'node:path';
import {readdir, readFile} from 'node:fs/promises';

// Keep standalone builds with the same license and artwork notices as the source.
const distributionNotices = {
 name:'distribution-notices',
 async generateBundle() {
  const files=['LICENSE','THIRD_PARTY_NOTICES.md'];
  for (const entry of await readdir(path.join(import.meta.dirname,'licenses'),{withFileTypes:true})) {
   if (entry.isFile()) files.push(`licenses/${entry.name}`);
  }
  for (const fileName of files) this.emitFile({type:'asset',fileName,source:await readFile(path.join(import.meta.dirname,fileName))});
 },
};

export default defineConfig({plugins:[distributionNotices],publicDir:path.resolve(import.meta.dirname,'public'),server:{fs:{allow:[import.meta.dirname]}}});
