package com.openinapp.plugin

import android.content.ContentResolver
import android.net.Uri
import android.provider.OpenableColumns
import android.webkit.MimeTypeMap
import com.getcapacitor.JSObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

data class SharedItemModel(
    val id: String,
    val type: String,
    val mimeType: String?,
    val fileName: String?,
    val fileExtension: String?,
    val path: String?,
    val url: String?,
    val size: Long?,
    val createdAt: String
) {
    fun toJSObject(): JSObject {
        val obj = JSObject()
        obj.put("id", id)
        obj.put("type", type)
        mimeType?.let { obj.put("mimeType", it) }
        fileName?.let { obj.put("fileName", it) }
        fileExtension?.let { obj.put("fileExtension", it) }
        path?.let { obj.put("path", it) }
        url?.let { obj.put("url", it) }
        size?.let { obj.put("size", it) }
        obj.put("createdAt", createdAt)
        return obj
    }

    companion object {
        fun fromUri(contentResolver: ContentResolver, uri: Uri): SharedItemModel {
            val mimeType = contentResolver.getType(uri)
            var fileName: String? = null
            var size: Long? = null

            contentResolver.query(uri, null, null, null, null)?.use { cursor ->
                if (cursor.moveToFirst()) {
                    val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                    val sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE)

                    if (nameIndex >= 0) {
                        fileName = cursor.getString(nameIndex)
                    }
                    if (sizeIndex >= 0) {
                        size = cursor.getLong(sizeIndex)
                    }
                }
            }

            val fileExtension = fileName?.substringAfterLast('.', "")?.lowercase()
                ?: MimeTypeMap.getSingleton().getExtensionFromMimeType(mimeType)

            val itemType = getItemType(mimeType, fileExtension)

            val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)

            return SharedItemModel(
                id = UUID.randomUUID().toString(),
                type = itemType,
                mimeType = mimeType,
                fileName = fileName,
                fileExtension = fileExtension,
                path = uri.toString(),
                url = null,
                size = size,
                createdAt = dateFormat.format(Date())
            )
        }

        private fun getItemType(mimeType: String?, fileExtension: String?): String {
            if (fileExtension == "pdf" || mimeType == "application/pdf") {
                return "pdf"
            }

            if (mimeType?.startsWith("image/") == true) {
                return "image"
            }

            if (mimeType?.startsWith("text/") == true || fileExtension == "txt") {
                return "text"
            }

            if (fileExtension.isNullOrEmpty() && (mimeType.isNullOrEmpty() || mimeType == "application/octet-stream")) {
                return "unknown"
            }

            return "file"
        }
    }
}

object SharedItemStore {
    private val items = mutableListOf<SharedItemModel>()

    @Synchronized
    fun addItems(newItems: List<SharedItemModel>) {
        items.addAll(newItems)
    }

    @Synchronized
    fun consumeItems(): List<SharedItemModel> {
        val result = items.toList()
        items.clear()
        return result
    }
}