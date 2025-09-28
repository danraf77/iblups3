const fs = require('fs');
const path = require('path');

console.log('🔧 Iniciando corrección de problemas de build de Vercel...\n');

// 1. Agregar dynamic export a páginas con parámetros dinámicos
const dynamicPages = [
  'app/[username]/page.tsx',
  'app/embed/[username]/page.tsx',
];

console.log('📝 Agregando export dynamic a páginas dinámicas...');
dynamicPages.forEach(filePath => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Verificar si ya tiene la configuración
      if (!content.includes("export const dynamic")) {
        // Buscar el primer import o 'use client'
        const firstImportIndex = content.search(/^(import |'use client')/m);
        if (firstImportIndex !== -1) {
          // Encontrar el final de los imports
          let insertPosition = content.indexOf('\n', firstImportIndex);
          while (content.substring(insertPosition, insertPosition + 7) === '\nimport' || 
                 content.substring(insertPosition, insertPosition + 6) === '\nfrom ') {
            insertPosition = content.indexOf('\n', insertPosition + 1);
          }
          
          // Insertar las exportaciones después de los imports
          const insertion = "\n\n// Forzar renderizado dinámico para evitar timeout en build\nexport const dynamic = 'force-dynamic';\nexport const revalidate = 0;\n";
          content = content.slice(0, insertPosition) + insertion + content.slice(insertPosition);
        } else {
          // Si no hay imports, agregar al inicio
          content = "// Forzar renderizado dinámico para evitar timeout en build\nexport const dynamic = 'force-dynamic';\nexport const revalidate = 0;\n\n" + content;
        }
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Actualizado: ${filePath}`);
      } else {
        console.log(`⏭️  Ya configurado: ${filePath}`);
      }
    } else {
      console.log(`⚠️  No encontrado: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
});

// 2. Crear layouts para páginas dinámicas si no existen
const layoutsToCreate = [
  {
    path: 'app/[username]/layout.tsx',
    content: `export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
`
  },
  {
    path: 'app/embed/[username]/layout.tsx',
    content: `export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
`
  }
];

console.log('\n📂 Creando layouts para páginas dinámicas...');
layoutsToCreate.forEach(({ path: layoutPath, content }) => {
  const fullPath = path.join(process.cwd(), layoutPath);
  const dir = path.dirname(fullPath);
  
  // Crear directorio si no existe
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Creado: ${layoutPath}`);
  } else {
    console.log(`⏭️  Ya existe: ${layoutPath}`);
  }
});

// 3. Actualizar next.config.js
console.log('\n⚙️  Actualizando next.config.js...');
const nextConfigPath = path.join(process.cwd(), 'next.config.js');

if (fs.existsSync(nextConfigPath)) {
  let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Verificar si ya tiene la configuración necesaria
  if (!nextConfig.includes('staticPageGenerationTimeout')) {
    // Buscar donde insertar la configuración
    if (nextConfig.includes('const nextConfig = {')) {
      nextConfig = nextConfig.replace(
        'const nextConfig = {',
        `const nextConfig = {
  // Configuración para evitar timeouts en build
  output: 'standalone',
  staticPageGenerationTimeout: 120, // 120 segundos
  experimental: {
    // Usar runtime de Node.js
    runtime: 'nodejs',
  },`
      );
    } else if (nextConfig.includes('module.exports = {')) {
      nextConfig = nextConfig.replace(
        'module.exports = {',
        `module.exports = {
  // Configuración para evitar timeouts en build
  output: 'standalone',
  staticPageGenerationTimeout: 120, // 120 segundos
  experimental: {
    // Usar runtime de Node.js
    runtime: 'nodejs',
  },`
      );
    }
    
    fs.writeFileSync(nextConfigPath, nextConfig, 'utf8');
    console.log('✅ next.config.js actualizado');
  } else {
    console.log('⏭️  next.config.js ya configurado');
  }
} else {
  // Crear next.config.js si no existe
  const newNextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para evitar timeouts en build
  output: 'standalone',
  staticPageGenerationTimeout: 120, // 120 segundos
  experimental: {
    // Usar runtime de Node.js
    runtime: 'nodejs',
  },
  
  // Configuración de imágenes
  images: {
    domains: [
      'iblups.sfo3.cdn.digitaloceanspaces.com',
      'thumbnail.iblups.com',
      'cdnhd.iblups.com'
    ],
    unoptimized: true, // Desactivar optimización para evitar problemas
  },
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;`;
  
  fs.writeFileSync(nextConfigPath, newNextConfig, 'utf8');
  console.log('✅ next.config.js creado');
}

// 4. Verificar y corregir hooks que hacen fetch
console.log('\n🔍 Verificando hooks que hacen fetch...');
const hooksDir = path.join(process.cwd(), 'app/hooks');
const hookFiles = fs.readdirSync(hooksDir).filter(file => file.endsWith('.ts'));

hookFiles.forEach(hookFile => {
  const hookPath = path.join(hooksDir, hookFile);
  let content = fs.readFileSync(hookPath, 'utf8');
  let modified = false;
  
  // Buscar fetch sin verificación de window
  if (content.includes('fetch(') && !content.includes('typeof window')) {
    // Buscar useEffect con fetch
    const regex = /useEffect\(\(\) => \{[\s\S]*?fetch\(/g;
    if (regex.test(content)) {
      content = content.replace(
        /useEffect\(\(\) => \{/g,
        `useEffect(() => {
    // Solo hacer fetch en el cliente, no durante el build
    if (typeof window !== 'undefined') {`
      );
      
      // Cerrar el if adicional
      content = content.replace(
        /\}, \[([^\]]*)\]\);/g,
        `    }
  }, [$1]);`
      );
      
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(hookPath, content, 'utf8');
    console.log(`✅ Actualizado hook: ${hookFile}`);
  }
});

// 5. Crear archivo .vercelignore si no existe
console.log('\n📄 Creando .vercelignore...');
const vercelIgnorePath = path.join(process.cwd(), '.vercelignore');
const vercelIgnoreContent = `# Archivos de desarrollo
.git
.github
.vscode
.idea
*.log
.DS_Store

# Archivos de configuración local
.env.local
.env.development

# Archivos de prueba
**/*.test.ts
**/*.test.tsx
**/*.spec.ts
**/*.spec.tsx

# Documentación
README.md
docs/

# Scripts de desarrollo
scripts/
`;

if (!fs.existsSync(vercelIgnorePath)) {
  fs.writeFileSync(vercelIgnorePath, vercelIgnoreContent, 'utf8');
  console.log('✅ .vercelignore creado');
} else {
  console.log('⏭️  .vercelignore ya existe');
}

console.log('\n✨ Corrección completada!');
console.log('\n📝 Próximos pasos:');
console.log('1. Ejecuta: npm run build (para probar localmente)');
console.log('2. Si el build local funciona, haz commit de los cambios');
console.log('3. Push a tu repositorio para que Vercel haga deploy');
console.log('\n💡 Si aún hay problemas, revisa los logs de Vercel para más detalles.');