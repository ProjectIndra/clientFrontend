const { execSync } = require('child_process');

// There is no need of committing your changes in the deployment yaml file as it is already being tracked by git. 
// Just make sure to update the image tag in the `deployment\kube\frntnd-deployment.yaml` file before running this script.

// Usage: node deploy.js <version> [commit message] [docker username]
const version = process.argv[2]; 
const commitMessage = process.argv[3] || `deployed ${version}`;
const docker_username = process.argv[4] || process.env.DOCKER_USERNAME; 

if (!version) {
  console.error('Usage: node deploy.js <version> [commit message] [docker username]');
  process.exit(1);
}

try {
  execSync(`docker build -t ${docker_username}/computekart-frontend:${version} -f deployment/docker/Dockerfile .`, { stdio: 'inherit' });
  execSync(`docker push ${docker_username}/computekart-frontend:${version}`, { stdio: 'inherit' });
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log('Deployment complete!');
} catch (err) {
  console.error('Error during deployment:', err);
  process.exit(1);
}

// node deploy.js v0.0.5 "commit message"