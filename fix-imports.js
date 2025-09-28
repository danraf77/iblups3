const fs = require('fs');
const path = require('path');

// Función para buscar archivos recursivamente
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Ignorar node_modules y .next
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        findFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Función para corregir importaciones en un archivo
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Verificar si usa NextRequest o NextResponse sin importar
  const usesNextRequest = content.includes('NextRequest') && !content.includes('import') ? false : content.includes('NextRequest');
  const usesNextResponse = content.includes('NextResponse');
  
  // Si el archivo usa NextRequest o NextResponse
  if (usesNextRequest || usesNextResponse) {
    // Verificar si ya tiene la importación correcta
    const hasNextServerImport = content.includes("from 'next/server'");
    
    if (!hasNextServerImport && (usesNextRequest || usesNextResponse)) {
      // Si no tiene la importación, agregarla
      const imports = [];
      if (usesNextRequest) imports.push('NextRequest');
      if (usesNextResponse) imports.push('NextResponse');
      
      const importStatement = `import { ${imports.join(', ')} } from 'next/server';\n`;
      
      // Buscar dónde insertar la importación (después de otros imports o al inicio)
      const importMatch = content.match(/^import .* from .*;$/m);
      if (importMatch) {
        // Insertar después del último import
        const lines = content.split('\n');
        let lastImportIndex = -1;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ')) {
            lastImportIndex = i;
          }
        }
        if (lastImportIndex !== -1) {
          lines.splice(lastImportIndex + 1, 0, importStatement.trim());
          content = lines.join('\n');
          modified = true;
        }
      } else {
        // Si no hay imports, agregar al inicio
        content = importStatement + content;
        modified = true;
      }
    } else if (hasNextServerImport) {
      // Verificar si necesita agregar NextRequest a una importación existente
      const serverImportRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]next\/server['"]/;
      const match = content.match(serverImportRegex);
      
      if (match) {
        const currentImports = match[1].split(',').map(s => s.trim());
        const needsImports = [];
        
        if (usesNextRequest && !currentImports.includes('NextRequest')) {
          needsImports.push('NextRequest');
        }
        if (usesNextResponse && !currentImports.includes('NextResponse')) {
          needsImports.push('NextResponse');
        }
        
        if (needsImports.length > 0) {
          const allImports = [...new Set([...currentImports, ...needsImports])];
          const newImportStatement = `import { ${allImports.join(', ')} } from 'next/server'`;
          content = content.replace(serverImportRegex, newImportStatement);
          modified = true;
        }
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corregido: ${filePath}`);
    return true;
  }
  
  return false;
}

// Ejecutar el script
console.log('🔍 Buscando archivos TypeScript en el proyecto...\n');

const projectDir = './app'; // Buscar solo en la carpeta app
const files = findFiles(projectDir);

console.log(`📁 Encontrados ${files.length} archivos TypeScript\n`);

let fixedCount = 0;

files.forEach(file => {
  if (fixImports(file)) {
    fixedCount++;
  }
});

console.log(`\n✨ Proceso completado: ${fixedCount} archivos corregidos`);

if (fixedCount > 0) {
  console.log('\n📝 Ahora puedes intentar hacer build nuevamente: npm run build');
}