const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AdmZip = require('adm-zip');

const unknown_api_location = path.join(__dirname, 'unknownvps-api');
const env_path = path.join(unknown_api_location, 'dist/.env')
const temp_env = path.join(__dirname, '.env.temp')
const owner = 'unknownpersonog';
const repo = 'unknownvps-v2';
if (!fs.existsSync(unknown_api_location)) {
    fs.mkdir(unknown_api_location, (err) => {
      if (err) {
        console.error('Error creating the directory:', err);
      } else {
        console.log('Directory created successfully.');
      }
    });
}
const appDirectory = path.join(__dirname, 'unknownvps-api');

 // Replace 'app' with the directory name of your app

async function downloadLatestRelease() {
  try {
    // Fetch the latest version.txt from raw.githubusercontent.com
    const versionUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/version.txt`;
    console.log('Checking for updates...')
    const response = await axios.get(versionUrl);
    const latestVersion = response.data.trim();
    console.log('Latest version:', latestVersion);

    // Get the current version from the local version.txt file
    const currentVersion = getCurrentVersion();
    console.log('Current version:', currentVersion);

    if (latestVersion === currentVersion) {
      console.log('No update available.');
      return;
    }

    // Run your installation process here
    // This can be a script or a command specific to your app environment
    // For example, you might use child_process.spawn() to run a shell command

    console.log('Installing new update...');

    // Fetch the latest release from GitHub
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
    const releaseResponse = await axios.get(apiUrl);
    const release = releaseResponse.data;
    const asset = release.assets.find((asset) => asset.name.endsWith('.zip'));

    if (!asset) {
      console.log('No suitable release asset found.');
      return;
    }

    const downloadUrl = asset.browser_download_url;
    const releaseFileName = path.basename(downloadUrl);

    const downloadPath = path.join(__dirname, releaseFileName);
    const zipExtractPath = path.join(__dirname, 'latest-release');

    const writer = fs.createWriteStream(downloadPath);

    console.log('Downloading latest release...');
    const downloadResponse = await axios.get(downloadUrl, {
      responseType: 'stream',
    });

    downloadResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log(`Download complete. Latest release saved to ${downloadPath}`);

    if (fs.existsSync(env_path)) {
      console.log('.env found, temporarily saving it...')
      const envData = fs.readFileSync(env_path, 'utf8');
      fs.writeFileSync(temp_env, envData, 'utf8');
    }
    const zip = new AdmZip(downloadPath);
    zip.extractAllTo(zipExtractPath, true);

    // Delete old app files
    fs.rmdirSync(appDirectory, { recursive: true });

    fs.renameSync(zipExtractPath, appDirectory);

    // Delete the old version.txt file
    const oldVersionFile = path.join(__dirname, 'version.txt');
    if (fs.existsSync(oldVersionFile)) {
      fs.unlinkSync(oldVersionFile);
    }

    if (fs.existsSync(temp_env)) {
      const tempEnvData = fs.readFileSync(temp_env, 'utf8');
      fs.writeFileSync(env_path, tempEnvData, 'utf8');
  
      // Delete the temporary .env file
      fs.unlinkSync(temp_env);
    }

    // Save the new version.txt file
    const newVersionFile = path.join(__dirname, 'version.txt');
    fs.writeFileSync(newVersionFile, latestVersion, 'utf8');

    console.log('App has been updated. Restarting the app...');

    // Code to restart the app goes here
    // This can be done using process.exit() and your app's start command

  } catch (err) {
    console.error('Error fetching or downloading latest release:', err);
  }
}

function getCurrentVersion() {
  const versionFilePath = path.join(__dirname, 'version.txt');
  
  if (!fs.existsSync(versionFilePath)) {
    // Create the "version.txt" file with default content "0.1"
    fs.writeFileSync(versionFilePath, '0.1', 'utf8');
    console.log('File "version.txt" created with default content "0.1".');
  }

  // Read and return the current version from the file
  const currentVersion = fs.readFileSync(versionFilePath, 'utf8').trim();
  return currentVersion;
}


downloadLatestRelease();
