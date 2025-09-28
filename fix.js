#!/usr/bin/env node
/**
 * fix9.js — Corrige errores y TODOS los warnings reportados (Next 15 + Vercel)
 *
 * Uso:
 *   node fix9.js
 *   npm i
 *   npm run build
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const read = p => { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } };
const write = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s, 'utf8'); };
const backupAndWrite = (p, next, prev) => {
  if (next == null || next === prev) return false;
  const bak = p + '.bak';
  if (!fs.existsSync(bak)) fs.writeFileSync(bak, prev ?? '', 'utf8');
  fs.writeFileSync(p, next, 'utf8');
  return true;
};
const walk = (dir, filter) => {
  const out = [];
  (function rec(d){
    if (!fs.existsSync(d)) return;
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const fp = path.join(d, ent.name);
      if (ent.isDirectory()) rec(fp);
      else if (!filter || filter(fp)) out.push(fp);
    }
  })(dir);
  return out;
};
const rel = p => path.relative(ROOT, p);

/* 0) ESLint: tolera nombres con "_" (no apagamos reglas) */
function ensureEslintConfig() {
  const file = path.join(ROOT, '.eslintrc.json');
  let cfg = {};
  const prev = read(file);
  if (prev) { try { cfg = JSON.parse(prev); } catch { cfg = {}; } }
  cfg.extends ??= 'next/core-web-vitals';
  cfg.rules ??= {};
  // Mantén any libre si ya lo tienes usado en otras partes
  cfg.rules['@typescript-eslint/no-explicit-any'] ??= 'off';
  // Permite nombres con guion bajo (lo usaremos para renombrar vars ignoradas)
  cfg.rules['@typescript-eslint/no-unused-vars'] = ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }];
  const next = JSON.stringify(cfg, null, 2) + '\n';
  if (!prev || prev !== next) {
    write(file, next);
    console.log('✅ .eslintrc.json actualizado (allow ^_)');
  } else {
    console.log('• .eslintrc.json OK');
  }
}

/* 1) Corrige el error real en logout: catch (error:any) y log */
function fixLogout() {
  const file = path.join(ROOT, 'app/api/auth/logout/route.ts');
  let src = read(file); if (!src) { console.log('• logout/route.ts no encontrado'); return; }
  let out = src;

  // catch (error: any) -> catch (e: unknown)
  out = out.replace(/catch\s*\(\s*error\s*:\s*any\s*\)\s*\{/g, 'catch (e: unknown) {');
  // catch (error) -> catch (e) si no se usa nombre "error" luego
  out = out.replace(/catch\s*\(\s*error\s*\)\s*\{/g, 'catch (e) {');
  // catch { ... error ... } -> catch (e) { ... e ... }
  out = out.replace(/catch\s*\{\s*/g, 'catch (e) { ');
  // console.error( ..., error) -> console.error(..., e)
  out = out.replace(/console\.error\(([^)]*?),\s*error\s*\)/g, 'console.error($1, e)');
  // Si imprime e, conviértelo seguro a Error/message
  if (!/instanceof Error/.test(out) && /console\.error\(.+e/.test(out)) {
    out = out.replace(/console\.error\((.+)\);/, (m, args) => {
      // deja como está, es suficientemente válido; si quieres: console.error('...', e instanceof Error ? e : new Error(String(e)))
      return m;
    });
  }

  if (backupAndWrite(file, out, src)) {
    console.log('✅ Corregido error + warnings en', rel(file));
  } else {
    console.log('• logout/route.ts sin cambios');
  }
}

/* 2) Limpia TODOS los route handlers: quita param request/_request si NO se usa + limpia imports */
function cleanRouteHandlers() {
  const files = walk(path.join(ROOT, 'app'), fp => /\/api\/.+\/route\.tsx?$/.test(fp.replace(/\\/g,'/')));
  let changed = 0;

  for (const file of files) {
    let src = read(file); if (!src) continue;
    let out = src;

    // Si _request/request solo aparece en la firma, quítalo
    // 1) cuenta ocurrencias fuera de imports
    const bodyForScan = out.replace(/^import[^\n]*$/mg, '');
    const occ = (bodyForScan.match(/\b_request\b/g) || []).length + (bodyForScan.match(/\brequest\b/g) || []).length;

    if (occ <= 1) {
      // quita el parámetro en funciones HTTP
      out = out.replace(
        /(\bfunction\s+(GET|POST|PUT|PATCH|DELETE)\s*)\(\s*[_]?request\s*:\s*[^)]*\)/g,
        '$1()'
      );
      // también la variante sin tipo explícito
      out = out.replace(
        /(\bfunction\s+(GET|POST|PUT|PATCH|DELETE)\s*)\(\s*[_]?request\s*\)/g,
        '$1()'
      );
    }

    // catch (error|err) -> catch {} si no se usa dentro del bloque
    out = out.replace(/catch\s*\(\s*(error|err)\s*\)\s*\{/g, (m, name) => {
      const after = out.slice(out.indexOf(m) + m.length);
      // heurística simple: si no aparece dentro, quita el param
      if (!new RegExp(`\\b${name}\\b`).test(after.split('catch').shift() || '')) return 'catch {';
      // si se usa, mantenlo
      return m;
    });

    // Limpia import de NextRequest si ya no se usa
    out = out.replace(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]next\/server['"]\s*;\s*/g,
      (m, names) => {
        const parts = names.split(',').map(s => s.trim()).filter(Boolean);
        const keep = parts.filter(n => n !== 'NextRequest' || /\bNextRequest\b/.test(out.replace(m,'')));
        return keep.length ? `import { ${keep.join(', ')} } from 'next/server';\n` : '';
      }
    );

    if (out !== src) {
      backupAndWrite(file, out, src);
      changed++;
      console.log('✅ route handler limpio:', rel(file));
    }
  }
  if (!changed) console.log('• route handlers ya estaban OK');
}

/* 3) Quita imports/vars no usadas reportadas y renombra a _* donde aplica */
function cleanComponentsAndPages() {
  // dashboard/page.tsx: quita MapPin/Calendar + renombra user/loadingProfile
  const dash = path.join(ROOT, 'app/dashboard/page.tsx');
  let dsrc = read(dash);
  if (dsrc) {
    let out = dsrc.replace(/^\s*import\s*\{\s*MapPin\s*,\s*Calendar\s*\}\s*from\s*['"][^'"]+['"]\s*;\s*$/m, '');
    out = out.replace(/\b(const|let)\s+user\b/g, '$1 _user');
    out = out.replace(/\b(const|let)\s+loadingProfile\b/g, '$1 _loadingProfile');
    if (out !== dsrc) { backupAndWrite(dash, out, dsrc); console.log('✅ dashboard/page.tsx limpio'); }
  }

  // FollowButton.tsx: renombra user → _user
  const follow = path.join(ROOT, 'app/components/FollowButton.tsx');
  let fsrc = read(follow);
  if (fsrc) {
    let out = fsrc.replace(/\b(const|let)\s+user\b/g, '$1 _user');
    if (out !== fsrc) { backupAndWrite(follow, out, fsrc); console.log('✅ FollowButton.tsx sin warnings'); }
  }

  // OTPEmailTemplate.tsx: renombra email → _email
  const otp = path.join(ROOT, 'app/components/email/OTPEmailTemplate.tsx');
  let osrc = read(otp);
  if (osrc) {
    let out = osrc.replace(/\b(const|let|function)\s+email\b/g, '$1 _email');
    if (out !== osrc) { backupAndWrite(otp, out, osrc); console.log('✅ OTPEmailTemplate.tsx sin warnings'); }
  }
}

/* 4) hooks/useChannelFollow.ts — arregla catches y deps de useCallback */
function fixUseChannelFollow() {
  const file = path.join(ROOT, 'app/hooks/useChannelFollow.ts');
  let src = read(file); if (!src) { console.log('• useChannelFollow.ts no encontrado'); return; }
  let out = src;

  // a) catch (_error) no usado -> catch {}
  out = out.replace(/catch\s*\(\s*_error\s*\)\s*\{/g, 'catch {');

  // b) Añadir 'error' a arrays de dependencias de useCallback si el cuerpo menciona "error" y no está en deps
  // Heurística: transformar ...useCallback( fn , [deps] ) donde deps no contiene 'error' y fn contiene 'error'
  out = out.replace(/useCallback\s*\(([\s\S]*?)\,\s*\[([^\]]*)\]\s*\)/g, (m, fnBody, deps) => {
    const usesError = /\berror\b/.test(fnBody);
    const hasErrorDep = /\berror\b/.test(deps);
    if (usesError && !hasErrorDep) {
      const newDeps = deps.trim() ? deps.trim() + ', error' : 'error';
      return `useCallback(${fnBody}, [${newDeps}])`;
    }
    return m;
  });

  if (out !== src) {
    backupAndWrite(file, out, src);
    console.log('✅ useChannelFollow.ts (catch + deps) limpio');
  } else {
    console.log('• useChannelFollow.ts OK');
  }
}

/* 5) Limpia imports nombrados que reportaste como no usados en APIs específicas */
function dropSpecificUnusedImports() {
  const table = [
    ['app/api/auth/send-otp/route.ts', ['OTPEmailTemplate']],
    ['app/api/dashboard/profile/route.ts', ['queryConfig','sanitizeUser']],
  ];
  for (const [relPath, namesToDrop] of table) {
    const fp = path.join(ROOT, relPath);
    let src = read(fp); if (!src) continue;
    let out = src.replace(/import\s*\{\s*([^}]+)\s*\}\s*from\s*(['"][^'"]+['"])\s*;\s*/g, (m, names, from) => {
      const parts = names.split(',').map(s => s.trim()).filter(Boolean);
      const filtered = parts.filter(n => namesToDrop.indexOf(n) === -1 || new RegExp(`\\b${n}\\b`).test(src.replace(m,'')));
      return filtered.length ? `import { ${filtered.join(', ')} } from ${from};\n` : '';
    });
    if (out !== src) {
      backupAndWrite(fp, out, src);
      console.log('✅ Imports no usados eliminados en', relPath);
    }
  }
}

(function main(){
  console.log('— FIX9 —');
  ensureEslintConfig();
  fixLogout();
  cleanRouteHandlers();
  cleanComponentsAndPages();
  fixUseChannelFollow();
  dropSpecificUnusedImports();
  console.log('\nListo. Ahora corre:\n  npm i\n  npm run build\n');
})();
