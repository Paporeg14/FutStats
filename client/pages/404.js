const express = require('express');
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Todas las rutas van al index.js de Next.js
  const filePath = path.join(__dirname, 'pages/index.js');
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(content);
  } else {
    res.status(404).send('Page not found');
  }
};
