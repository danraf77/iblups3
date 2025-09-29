#!/usr/bin/env node

const http = require('http');

function checkServer() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\n=== HTML Content (first 500 chars) ===');
      console.log(data.substring(0, 500));
      
      // Check for specific patterns
      if (data.includes('Cargando...')) {
        console.log('\n⚠️  Found "Cargando..." in HTML - this indicates loading state');
      }
      
      if (data.includes('loading-spinner')) {
        console.log('\n⚠️  Found loading spinner - page is stuck in loading state');
      }
      
      if (data.includes('channels')) {
        console.log('\n✅ Found channels data in HTML');
      }
      
      if (data.includes('error')) {
        console.log('\n❌ Found error in HTML');
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
}

console.log('🔍 Checking server status...');
checkServer();
