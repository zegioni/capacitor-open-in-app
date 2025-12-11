#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(OpenInAppPlugin, "OpenInAppPlugin",
    CAP_PLUGIN_METHOD(getItems, CAPPluginReturnPromise);
)