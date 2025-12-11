package com.openinapp.plugin

import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "OpenInAppPlugin")
class OpenInAppPlugin : Plugin() {

    @PluginMethod
    fun getItems(call: PluginCall) {
        val items = SharedItemStore.consumeItems()
        val jsArray = JSArray()

        items.forEach { item ->
            jsArray.put(item.toJSObject())
        }

        val result = JSObject()
        result.put("items", jsArray)
        call.resolve(result)
    }
}