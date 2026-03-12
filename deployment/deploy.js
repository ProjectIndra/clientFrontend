const { execSync } = require('child_process');

const version = process.argv[2]; // Pass version as argument, e.g., node deploy.js v0.0.5
const commitMessage = process.argv[3] || `deployed ${version}`;

if (!version) {
  console.error('Usage: node deploy.js <version>');
  process.exit(1);
}

try {
  execSync(`sudo docker build -t kumarsubrato/computekart-frontend:${version} -f deployment/docker/Dockerfile .`, { stdio: 'inherit' });
  execSync(`docker push kumarsubrato/computekart-frontend:${version}`, { stdio: 'inherit' });
  // change in frntnd-deployment.yaml
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log('Deployment complete!');
} catch (err) {
  console.error('Error during deployment:', err);
  process.exit(1);
}

// node deploy.js v0.0.5 "commit message"