#!/usr/bin/env node

const http = require('http');

function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/channels/paginated?page=1&limit=4&search=&tab=all',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`API Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('\n=== API Response ===');
        console.log(`Channels count: ${jsonData.channels?.length || 0}`);
        console.log(`Total channels: ${jsonData.pagination?.totalChannels || 0}`);
        console.log(`Total live channels: ${jsonData.pagination?.totalLiveChannels || 0}`);
        console.log(`Current page: ${jsonData.pagination?.currentPage || 0}`);
        console.log(`Total pages: ${jsonData.pagination?.totalPages || 0}`);
        console.log(`Loading state: ${jsonData.loading || 'not specified'}`);
        console.log(`Error: ${jsonData.error || 'none'}`);
        
        if (jsonData.channels && jsonData.channels.length > 0) {
          console.log('\n=== First Channel ===');
          console.log(`Name: ${jsonData.channels[0].name}`);
          console.log(`Username: ${jsonData.channels[0].username}`);
          console.log(`Is Live: ${jsonData.channels[0].is_on_live}`);
        }
      } catch (error) {
        console.log('\n❌ Error parsing JSON response:');
        console.log(data.substring(0, 500));
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Problem with request: ${e.message}`);
  });

  req.end();
}

console.log('🔍 Testing API directly...');
testAPI();
