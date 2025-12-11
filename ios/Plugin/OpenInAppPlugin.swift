import Foundation
import Capacitor
import UniformTypeIdentifiers

@objc(OpenInAppPlugin)
public class OpenInAppPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "OpenInAppPlugin"
    public let jsName = "OpenInAppPlugin"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getItems", returnType: CAPPluginReturnPromise)
    ]

    private static var pendingItems: [[String: Any]] = []

    @objc func getItems(_ call: CAPPluginCall) {
        let items = OpenInAppPlugin.pendingItems
        OpenInAppPlugin.pendingItems.removeAll()
        call.resolve(["items": items])
    }

    @objc public static func handleIncomingURLs(_ urls: [URL]) {
        let items = urls.map { url -> [String: Any] in
            let id = UUID().uuidString
            let path = url.absoluteString
            let fileName = url.lastPathComponent
            let fileExtension = url.pathExtension.lowercased()
            let mimeType = getMimeType(for: fileExtension)
            let itemType = getItemType(mimeType: mimeType, fileExtension: fileExtension)

            var item: [String: Any] = [
                "id": id,
                "type": itemType,
                "path": path,
                "fileName": fileName,
                "fileExtension": fileExtension,
                "createdAt": ISO8601DateFormatter().string(from: Date())
            ]

            if !mimeType.isEmpty {
                item["mimeType"] = mimeType
            }

            if let attrs = try? FileManager.default.attributesOfItem(atPath: url.path),
               let size = attrs[.size] as? Int {
                item["size"] = size
            }

            return item
        }

        pendingItems.append(contentsOf: items)
    }

    private static func getMimeType(for ext: String) -> String {
        if #available(iOS 14.0, *) {
            if let utType = UTType(filenameExtension: ext) {
                return utType.preferredMIMEType ?? ""
            }
        }

        let mimeTypes: [String: String] = [
            "pdf": "application/pdf",
            "png": "image/png",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "gif": "image/gif",
            "webp": "image/webp",
            "heic": "image/heic",
            "txt": "text/plain",
            "json": "application/json",
            "xml": "application/xml",
            "html": "text/html",
            "csv": "text/csv"
        ]

        return mimeTypes[ext] ?? ""
    }

    private static func getItemType(mimeType: String, fileExtension: String) -> String {
        if fileExtension == "pdf" || mimeType == "application/pdf" {
            return "pdf"
        }

        if mimeType.hasPrefix("image/") {
            return "image"
        }

        if mimeType.hasPrefix("text/") || fileExtension == "txt" {
            return "text"
        }

        if fileExtension.isEmpty && (mimeType.isEmpty || mimeType == "application/octet-stream") {
            return "unknown"
        }

        return "file"
    }
}