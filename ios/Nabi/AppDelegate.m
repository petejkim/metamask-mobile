#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import "RCCManager.h"
//#import <React/RCTRootView.h>
#import <WebKit/WebKit.h>
#import "NSURLProtocol+WKWebViewSupport.h"
#import "AppProtocol.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [NSURLProtocol wk_registerScheme:@"app"];
  [NSURLProtocol registerClass:[AppProtocol class]];

  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation];

  return YES;
}

@end
