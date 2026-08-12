# Himalaya Kulfi Android App — Build & Play Store Guide

This is the official Android App (WebView Wrapper) for **Himalaya Kulfi**. It wraps the website into a native Android app supporting camera capture, file uploads, offline detection, and custom splash screen.

---

## 📋 Prerequisites

Before building the APK or AAB bundle:

1. **Java Development Kit (JDK) 17+**
   - Download: [Adoptium OpenJDK 17](https://adoptium.net/)
   - Verify: `java -version`

2. **Android Studio** (Recommended) or **Android SDK Tools**
   - Download: [Android Studio](https://developer.android.com/studio)

3. **Android SDK Requirements**:
   - SDK Platform 34 / 36 (Android 14/15)
   - Build-Tools & Platform-Tools

---

## ⚙️ Step 1: Configure Website URL

Open `app/build.gradle.kts` and update `BASE_URL`:

```kotlin
// For Local Testing (Emulator)
buildConfigField("String", "BASE_URL", "\"http://10.0.2.2:8080\"")

// For Real Device on same Wi-Fi
buildConfigField("String", "BASE_URL", "\"http://192.168.x.x:8080\"")

// For Live Production Server (Play Store Release)
buildConfigField("String", "BASE_URL", "\"https://your-production-domain.com\"")
```

---

## 🛠️ Step 2: Build Debug APK (Local Testing)

Run the following in `android-app/` folder:

```bash
gradlew.bat assembleDebug
```

### Output Location:
`android-app/app/build/outputs/apk/debug/app-debug.apk`

---

## 🚀 Step 3: Build Release APK & AAB (For Google Play Store)

Google Play Store requires an **Android App Bundle (.aab)** signed with a Release Keystore.

### 3a. Generate Release Keystore (One-Time)
Run this in terminal to generate your app signing key:

```bash
keytool -genkey -v -keystore himalayakulfi-release.keystore -alias himalayakulfi -keyalg RSA -keysize 2048 -validity 10000
```
> ⚠️ **Keep `himalayakulfi-release.keystore` and your passwords safe!** You will need them for all future Play Store updates.

### 3b. Enable Release Signing in `app/build.gradle.kts`
Uncomment and update the `signingConfigs` block inside `app/build.gradle.kts`:

```kotlin
signingConfigs {
    create("release") {
        storeFile = file("../himalayakulfi-release.keystore")
        storePassword = "YOUR_STORE_PASSWORD"
        keyAlias = "himalayakulfi"
        keyPassword = "YOUR_KEY_PASSWORD"
    }
}

buildTypes {
    release {
        isMinifyEnabled = true
        isShrinkResources = true
        proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        signingConfig = signingConfigs.getByName("release")
    }
}
```

### 3c. Generate APK for Testing:
```bash
gradlew.bat assembleRelease
```
**Output:** `app/build/outputs/apk/release/app-release.apk`

### 3d. Generate AAB for Google Play Store Upload:
```bash
gradlew.bat bundleRelease
```
**Output:** `app/build/outputs/bundle/release/app-release.aab`

---

## 📤 Step 4: Upload to Google Play Console

1. Login to [Google Play Console](https://play.google.com/console).
2. Click **Create app** → App Name: `Himalaya Kulfi`, Language: English, Type: App, Free.
3. Complete **App Content** setup (Privacy Policy URL, Data Safety, Content Rating).
4. Go to **Production** or **Internal Testing** → Create new release.
5. Upload the generated **`app-release.aab`** file.
6. Submit for review!

---

## 📱 App Specs & Package Info

- **App Name:** Himalaya Kulfi
- **Package Name (Application ID):** `com.himalayakulfi.app`
- **Min SDK:** 26 (Android 8.0)
- **Target SDK:** 36 (Android 15)
- **Primary Color:** `#01150A` (Dark Himalayan Green)
- **Accent Color:** `#D9A52A` (Royal Gold)
