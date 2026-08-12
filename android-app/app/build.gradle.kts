plugins {
    id("com.android.application")
}

android {
    namespace = "com.himalayakulfi.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.himalayakulfi.app"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"

        // ============================================================
        // >>> CHANGE THIS TO YOUR DEPLOYED SERVER URL <<<
        // Example: "https://himalayakulfi.com"
        // For local testing: "http://10.0.2.2:8080" (emulator)
        //                    "http://192.168.x.x:8080" (real device)
        // ============================================================
        buildConfigField("String", "BASE_URL", "\"http://10.0.2.2:8080\"")
    }

    signingConfigs {
        // Uncomment and fill in for Play Store release builds:
        // create("release") {
        //     storeFile = file("../himalayakulfi-release.keystore")
        //     storePassword = "YOUR_STORE_PASSWORD"
        //     keyAlias = "himalayakulfi"
        //     keyPassword = "YOUR_KEY_PASSWORD"
        // }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            // Uncomment for Play Store release:
            // signingConfig = signingConfigs.getByName("release")
        }
        debug {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        buildConfig = true
    }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.core:core:1.16.0")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation("androidx.core:core-splashscreen:1.0.1")
    implementation("androidx.webkit:webkit:1.13.0")
}
