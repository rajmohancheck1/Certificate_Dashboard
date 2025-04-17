const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure we're in production mode
process.env.NODE_ENV = 'production';

// Build frontend
console.log('Building frontend...');
process.chdir(path.join(__dirname, '../frontend'));
execSync('npm run build', { stdio: 'inherit' });

// Copy frontend build to backend
console.log('Copying frontend build to backend...');
const frontendBuild = path.join(__dirname, '../frontend/dist');
const backendStatic = path.join(__dirname, '../backend/public');

// Ensure backend public directory exists
if (!fs.existsSync(backendStatic)) {
  fs.mkdirSync(backendStatic, { recursive: true });
}

// Copy build files
execSync(`xcopy "${frontendBuild}" "${backendStatic}" /E /I /Y`);

console.log('Build complete! Run npm start in the backend directory to start the production server.');