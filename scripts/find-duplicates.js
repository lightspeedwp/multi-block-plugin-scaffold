const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const directoryPath = path.join(__dirname);

/**
 * Calculates the SHA256 hash of a file.
 * @param {string} filePath - The path to the file.
 * @returns {string} The hex-encoded hash of the file.
 */
function getFileHash(filePath) {
	const fileBuffer = fs.readFileSync(filePath);
	const hashSum = crypto.createHash('sha256');
	hashSum.update(fileBuffer);
	return hashSum.digest('hex');
}

/**
 * Finds duplicate files in a directory based on their content hash.
 * @param {string} dir - The directory to scan.
 */
function findDuplicates(dir) {
	const files = fs.readdirSync(dir);
	const hashes = new Map();

	console.log(`🔍 Scanning ${files.length} files in ${dir}...`);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isFile()) {
			const hash = getFileHash(filePath);
			if (!hashes.has(hash)) {
				hashes.set(hash, []);
			}
			hashes.get(hash).push(file);
		}
	});

	let duplicatesFound = false;
	console.log('\n--- Duplicate File Report ---');
	for (const [hash, fileList] of hashes.entries()) {
		if (fileList.length > 1) {
			duplicatesFound = true;
			console.log(`\n[!] Found ${fileList.length} identical files (hash: ${hash.substring(0, 12)}...):`);
			fileList.forEach((file) => console.log(`  - ${file}`));
		}
	}

	if (!duplicatesFound) {
		console.log('\n✅ No duplicate files found.');
	}
}

findDuplicates(directoryPath);