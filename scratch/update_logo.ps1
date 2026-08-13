Add-Type -AssemblyName System.Drawing

$src = 'C:\Users\Sonu\.gemini\antigravity-ide\brain\d61cde9e-1e83-4c7f-9ec4-893fbfc473e8\media__1786583313152.png'

if (!(Test-Path $src)) {
    Write-Error "Source image does not exist: $src"
    exit 1
}

# Function to resize and save image
function Save-ResizedImage {
    param (
        [string]$sourcePath,
        [string]$targetPath,
        [int]$width,
        [int]$height,
        [System.Drawing.Imaging.ImageFormat]$format
    )

    $dir = [System.IO.Path]::GetDirectoryName($targetPath)
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $srcImg = [System.Drawing.Image]::FromFile($sourcePath)
    
    if ($width -eq 0 -and $height -eq 0) {
        $width = $srcImg.Width
        $height = $srcImg.Height
    }

    $destBmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $g.DrawImage($srcImg, 0, 0, $width, $height)
    
    $destBmp.Save($targetPath, $format)

    $g.Dispose()
    $destBmp.Dispose()
    $srcImg.Dispose()

    Write-Host "Saved: $targetPath ($($width)x$($height))"
}

# Copy original PNG to destinations
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\frontend\logo.jpg' -width 0 -height 0 -format ([System.Drawing.Imaging.ImageFormat]::Jpeg)
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\frontend\logo.png' -width 0 -height 0 -format ([System.Drawing.Imaging.ImageFormat]::Png)
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\frontend\images\logo.png' -width 0 -height 0 -format ([System.Drawing.Imaging.ImageFormat]::Png)

# Generate PWA App Icons
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\frontend\icon-192.png' -width 192 -height 192 -format ([System.Drawing.Imaging.ImageFormat]::Png)
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\frontend\icon-512.png' -width 512 -height 512 -format ([System.Drawing.Imaging.ImageFormat]::Png)
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\frontend\favicon.png' -width 64 -height 64 -format ([System.Drawing.Imaging.ImageFormat]::Png)

# Generate Public folder copies
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\public\logo.jpg' -width 0 -height 0 -format ([System.Drawing.Imaging.ImageFormat]::Jpeg)
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\public\logo.png' -width 0 -height 0 -format ([System.Drawing.Imaging.ImageFormat]::Png)

# Generate Android App Drawables & Icons
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\android-app\app\src\main\res\drawable\logo.png' -width 512 -height 512 -format ([System.Drawing.Imaging.ImageFormat]::Png)
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\android-app\app\src\main\res\drawable\ic_splash_logo.png' -width 512 -height 512 -format ([System.Drawing.Imaging.ImageFormat]::Png)
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\android-app\app\src\main\res\mipmap-hdpi\ic_launcher.png' -width 72 -height 72 -format ([System.Drawing.Imaging.ImageFormat]::Png)
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\android-app\app\src\main\res\mipmap-mdpi\ic_launcher.png' -width 48 -height 48 -format ([System.Drawing.Imaging.ImageFormat]::Png)
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\android-app\app\src\main\res\mipmap-xhdpi\ic_launcher.png' -width 96 -height 96 -format ([System.Drawing.Imaging.ImageFormat]::Png)
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\android-app\app\src\main\res\mipmap-xxhdpi\ic_launcher.png' -width 144 -height 144 -format ([System.Drawing.Imaging.ImageFormat]::Png)
Save-ResizedImage -sourcePath $src -targetPath 'C:\Users\Sonu\Desktop\project\Sachin\android-app\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png' -width 192 -height 192 -format ([System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "All logo files generated and updated successfully!"
