const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const app = express();
// CUstom port
const port = 3000;

// Basis data tanda tangan malware (hash MD5)
const malwareSignatures = {
  // PHP Backdoor https://github.com/backdoorhub/shell-backdoor-list
  "b03dbab41c207ac4cff71f4a9f35597e": "Malware 0byt3m1n1.php",
  "c34d778cd6666abdf31fc4a26d83a54c": "Malware ak47shell.php",
  "ea07a7b277e18fadcdffdea680cc9e87": "Malware alfa.php",
  "3c2f6a5d11700dadb18b06e5f40e8117": "Malware b374k.php",
  "5ccee848d8edc2f345d4bacda762a2a1": "Malware indoxploit.php",
  "18cab6b3bb3e9f55ff88f6df28ce1d29": "Malware marion001.php",
  "c3791f16af5e094d10883bc98833d10d": "Malware mini.php",
  "9c5c44e8c6d436cc78b69d10797f1fbf": "Malware p0wny-shell.php",
  "89ade8c0b01dd535286dccf072dccd41": "Malware r57.php",
  "48763bdd47801432650fa48ccb4508de": "Malware sadrazam.php",
  "7a07e7acc1b727421c968af183822429": "Malware simple-shell.php",
  "fb8cc77da3ffe2c94f13ddd8e6cc9a4f": "Malware webadmin.php",
  "e7def61a3c8069ff4a6ee0ab0ef0b6ba": "Malware wordpress.php",
  "1be18354cc48be5faafb724b1d2e8ec0": "Malware wso.php",
  
  // Tambahkan lebih banyak tanda tangan di sini
};

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
}

async function scanDirectory(directory) {
  const results = [];
  const files = fs.readdirSync(directory);
  let malwareDetected = false; // Flag untuk mendeteksi malware
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      const fileHash = await hashFile(filePath);
      if (malwareSignatures[fileHash]) {
        results.push(`Malware ditemukan: \n[${malwareSignatures[fileHash]}] => [${filePath}]`);
      }
    } else if (stat.isDirectory()) {
      results.push(...await scanDirectory(filePath)); // Rekursi untuk direktori
    }
  }
  return results;
}

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.post('/scan', async (req, res) => {
  const { directory } = req.body;
  try {
    const results = await scanDirectory(directory);
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});