#!/usr/bin/env node

const http = require('http');

function checkPageStatus() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\n=== Page Analysis ===');
      
      // Check for loading states
      const loadingCount = (data.match(/Cargando/g) || []).length;
      const loadingSpinnerCount = (data.match(/loading-spinner/g) || []).length;
      const channelsCount = (data.match(/channels/g) || []).length;
      const errorCount = (data.match(/error/g) || []).length;
      
      console.log(`Loading mentions: ${loadingCount}`);
      console.log(`Loading spinners: ${loadingSpinnerCount}`);
      console.log(`Channels mentions: ${channelsCount}`);
      console.log(`Error mentions: ${errorCount}`);
      
      // Check for specific patterns
      if (data.includes('0 live channels')) {
        console.log('✅ Found "0 live channels" - channels are loading');
      }
      
      if (data.includes('animate-pulse')) {
        console.log('⚠️  Found animate-pulse - skeleton loading');
      }
      
      if (data.includes('channels.length')) {
        console.log('✅ Found channels.length - React is working');
      }
      
      // Check for specific error patterns
      if (data.includes('Error loading channels')) {
        console.log('❌ Found "Error loading channels"');
      }
      
      if (data.includes('Error fetching channels')) {
        console.log('❌ Found "Error fetching channels"');
      }
      
      // Check for successful content
      if (data.includes('amigo fiel tv') || data.includes('amigofiel')) {
        console.log('✅ Found channel data in HTML');
      }
      
      // Check for React hydration
      if (data.includes('__next_f')) {
        console.log('✅ Found Next.js hydration data');
      }
      
      console.log('\n=== First 200 chars of body ===');
      const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/);
      if (bodyMatch) {
        console.log(bodyMatch[1].substring(0, 200));
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
}

console.log('🔍 Checking page status...');
checkPageStatus();
