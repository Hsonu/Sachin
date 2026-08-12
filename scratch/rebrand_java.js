const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../android-app/app/src/main/java/com/quizgen/app');
const destDir = path.join(__dirname, '../android-app/app/src/main/java/com/himalayakulfi/app');

// Ensure dest dir exists
fs.mkdirSync(destDir, { recursive: true });

const replacements = {
    'package com.quizgen.app;': 'package com.himalayakulfi.app;',
    'private static final String TAG = "QUIZGEN"': 'private static final String TAG = "HIMALAYA_KULFI"',
    'String imageFileName = "QUIZGEN_"': 'String imageFileName = "HIMALAYAKULFI_"',
    'Environment.DIRECTORY_DOWNLOADS, "QUIZGEN/"': 'Environment.DIRECTORY_DOWNLOADS, "HimalayaKulfi/"',
};

const files = ['MainActivity.java', 'SplashActivity.java', 'NoInternetActivity.java'];

files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    
    let content = fs.readFileSync(srcPath, 'utf8');
    
    Object.entries(replacements).forEach(([oldStr, newStr]) => {
        content = content.split(oldStr).join(newStr);
    });
    
    fs.writeFileSync(destPath, content, 'utf8');
    console.log(`Created: ${file}`);
});

console.log('Java package migration complete!');
