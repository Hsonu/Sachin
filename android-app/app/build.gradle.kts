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

        // Live Production URL:
        buildConfigField("String", "BASE_URL", "\"https://sachin-nhmy.onrender.com/\"")
    }

    signingConfigs {
        create("release") {
            storeFile = file("../himalayakulfi-release.keystore")
            storePassword = "himalaya2026"
            keyAlias = "himalayakulfi"
            keyPassword = "himalaya2026"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("release")
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
