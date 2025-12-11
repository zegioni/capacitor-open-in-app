# capacitor-open-in-app

A Capacitor plugin for receiving shared files (PDFs, images, text, URLs) from other apps on iOS and Android.

## Installation

```bash
npm install capacitor-open-in-app
npx cap sync
```

### Configuration

```typescript
import type { OpenInAppConfig } from 'capacitor-open-in-app';
import { configure } from 'capacitor-open-in-app';

const config: OpenInAppConfig = {
  allowedTypes: ['pdf', 'image'],
};

configure(config);
```

Configuration is applied in JavaScript helper functions (`getItemsByType`, `getPdfs`, `getImages`) and does not change the low-level `OpenInApp.getItems()` result.

## API

### `getItems()`

Returns all pending shared items and clears the internal queue on the native side (one-shot call).

```typescript
import { OpenInApp } from 'capacitor-open-in-app';

const { items } = await OpenInApp.getItems();
items.forEach(item => {
  console.log(item.type, item.path, item.fileName);
});
```

### Helper Functions

```typescript
import { configure, getItemsByType, getPdfs, getImages } from 'capacitor-open-in-app';

configure({ allowedTypes: ['pdf', 'image'] });

// Get all PDFs
const pdfs = await getPdfs();

// Get all images
const images = await getImages();

// Get items by type
const textItems = await getItemsByType('text');
```

### Types

```typescript
type SharedItemType = 'file' | 'image' | 'pdf' | 'text' | 'url' | 'unknown';

interface SharedItem {
  id: string;
  type: SharedItemType;
  mimeType?: string;
  fileName?: string;
  fileExtension?: string;
  path?: string;
  url?: string;
  size?: number;
  createdAt?: string;
}

interface OpenInAppConfig {
  allowedTypes?: SharedItemType[];
}
```

### Shared item type matrix

| type    | When it appears                                         | Guaranteed fields          |
|---------|---------------------------------------------------------|----------------------------|
| `pdf`   | PDF files detected by extension or `application/pdf`    | `id`, `type`, `path`       |
| `image` | Image files where MIME starts with `image/`             | `id`, `type`, `path`       |
| `text`  | Text-based content (MIME starts with `text/` or `.txt`) | `id`, `type`               |
| `url`   | Reserved for URL-only shares                            | `id`, `type`, `url`        |
| `file`  | Other files that are not mapped to a more specific type | `id`, `type`, `path`       |
| `unknown` | No reliable MIME or extension information             | `id`, `type`               |

## iOS Setup

### 1. Add Document Types to Info.plist

Register the file types that your app should be able to open from other apps. Example below shows a PDF configuration:

```xml
<key>CFBundleDocumentTypes</key>
<array>
  <dict>
    <key>CFBundleTypeName</key>
    <string>PDF Document</string>
    <key>LSHandlerRank</key>
    <string>Default</string>
    <key>LSItemContentTypes</key>
    <array>
      <string>com.adobe.pdf</string>
    </array>
  </dict>
</array>
```

You can add more `<dict>` entries or additional UTIs inside `LSItemContentTypes` for any other file types your app supports.

### 2. Forward URLs in AppDelegate.swift

In your existing `AppDelegate`, forward incoming file URLs to the plugin and then let Capacitor handle the rest:

```swift
import UIKit
import Capacitor
import OpenInAppPlugin

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        OpenInAppPlugin.handleIncomingURLs([url])
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }
}
```

If you use `CAPAppDelegate` as a base class, call `super.application` instead of `ApplicationDelegateProxy.shared.application`.

## Android Setup

### 1. Register the Plugin

In your `MainActivity.java` or `MainActivity.kt`:

```kotlin
import com.openinapp.plugin.OpenInAppPlugin

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(OpenInAppPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
```

### 2. Add Intent Filters (optional customization)

The plugin includes default intent filters for receiving shared files. To customize, modify your app's `AndroidManifest.xml`:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">
    
    <intent-filter>
        <action android:name="android.intent.action.SEND" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:mimeType="application/pdf" />
    </intent-filter>
    
</activity>
```

## Usage Example

```typescript
import { App } from '@capacitor/app';
import { getPdfs } from 'capacitor-open-in-app';

const checkSharedItems = async () => {
  const pdfs = await getPdfs();
  const pdf = pdfs[0];
  if (pdf?.path) {
    await handlePdfUpload(pdf.path);
  }
};

App.addListener('appUrlOpen', async () => {
  await checkSharedItems();
});

onMounted(() => {
  checkSharedItems();
});
```

## Troubleshooting iOS

- Make sure `CFBundleDocumentTypes` is set correctly in `Info.plist` for the file types you expect.
- Verify that `application(_:open:options:)` in `AppDelegate` forwards URLs to `OpenInAppPlugin.handleIncomingURLs`.
- If you change `Info.plist`, clean the build and reinstall the app on the device or simulator.

## Local development and testing

```bash
npm install
npm run lint
npm test
npm run build
```

To try the plugin in a Capacitor app locally:

```bash
cd capacitor-open-in-app
npm link

cd ../your-capacitor-app
npm link capacitor-open-in-app
npx cap sync
```

## Releasing

- Bump the version in `package.json`.
- Build the package:

```bash
npm run build
```

- Publish to npm (requires correct auth):

```bash
npm publish
```

## License

MIT