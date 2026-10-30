import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve('dist');
async function walk(dir) {
  const files = await readdir(dir, {withFileTypes:true});
  return (await Promise.all(files.map(f => f.isDirectory() ? walk(path.join(dir,f.name)) : path.join(dir,f.name)))).flat();
}
const files = await walk(root);
const html = files.filter(f => f.endsWith('.html'));
for (const file of html) {
  const text = await readFile(file,'utf8');
  assert(text.includes('Josh Judge'), `Missing author: ${file}`);
  assert.equal((text.match(/<h1\b/g)||[]).length, 1, `Expected one page heading: ${file}`);
  for (const [,href] of text.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)) {
    const target = path.join(root,href);
    let exists = false;
    try { const s = await stat(target); exists = s.isFile() || (s.isDirectory() && (await stat(path.join(target,'index.html'))).isFile()); } catch {}
    assert(exists, `Broken internal link ${href} from ${file}`);
  }
}
const feed = await readFile('dist/feed.xml','utf8');
assert(feed.startsWith('<?xml'), 'RSS must begin with XML declaration');
assert.equal((feed.match(/<item>/g)||[]).length, html.filter(f=>f.includes('/articles/')).length, 'RSS count must match articles');
assert(!(await readFile('dist/sitemap.xml','utf8')).includes('/404.html'), '404 must not be indexed');
console.log(`Verified ${html.length} pages, internal links, author identity, RSS, and sitemap.`);
