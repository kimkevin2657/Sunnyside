/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "RNSplashScreen.h"  // here

#import <Firebase.h>

#import <React/RCTLinkingManager.h>


@import UserNotifications;
@interface AppDelegate () <UNUserNotificationCenterDelegate>
@end
@implementation AppDelegate
NSString *const kGCMMessageIDKey = @"gcm.message_id";
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
                        options:(NSDictionary<NSString *,id> *)options {
  NSLog(@"some logic %@", url);
  
 usleep(50000);
 return [RCTLinkingManager application:application openURL:url options:options];
}
- (BOOL)application:(UIApplication *)application
      openURL:(NSURL *)url
 sourceApplication:(NSString *)sourceApplication
     annotation:(id)annotation
      options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
 NSLog(@"get link ?? some logic %@", url);
 
 usleep(50000);
 return [RCTLinkingManager application:application openURL:url options:options];
}
//- (BOOL)application:(UIApplication *)app
//      openURL:(NSURL *)url
//      options:(NSDictionary<NSString *, id> *)options {
// return [self application:app openURL:url sourceApplication:nil annotation:@{}];
//}
// legacy handle dynamic link
//- (BOOL)application:(UIApplication *)application
//continueUserActivity:(nonnull NSUserActivity *)userActivity
// restorationHandler:(nonnull void (^)(NSArray *_Nullable))restorationHandler {
//
// NSLog(@"userActivity.webpageURL ::: %@", userActivity.webpageURL);
// __weak AppDelegate *weakSelf = self;
//
// BOOL handle = [[FIRDynamicLinks dynamicLinks] handleUniversalLink:userActivity.webpageURL completion:^(FIRDynamicLink * _Nullable dynamicLink, NSError * _Nullable error) {
//
//  NSLog(@"link %@",dynamicLink.url);
//  AppDelegate *strongSelf = weakSelf;
//  [strongSelf handleReceivedLink:dynamicLink];
// }];
//
// if(!handle) {
//  return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
// }
//
// return handle;
//}
//
//-(void)handleReceivedLink:(FIRDynamicLink*)dynamicLink{
//
// // in control Obj-C
//    NSString* urlString = [NSString stringWithFormat:@"%@",dynamicLink.url];
//    NSLog(@"Extended URL : %@",urlString);
//
// NSString *linkURL = [NSString stringWithFormat:@"%@",dynamicLink.url];
// linkURL = [linkURL stringByRemovingPercentEncoding];
// NSLog(@"converted URL : %@",linkURL);
//}
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler{
 NSLog(@"ua :::: %@",userActivity);
 return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}
// [START receive_message]
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
 // If you are receiving a notification message while your app is in the background,
 // this callback will not be fired till the user taps on the notification launching the application.
 // TODO: Handle data of notification
 // With swizzling disabled you must let Messaging know about the message, for Analytics
  [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
 // Print message ID.
 if (userInfo[kGCMMessageIDKey]) {
  NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
 }
 // Print full message.
 NSLog(@"%@", userInfo);
// //testing here
// if (application.applicationState == UIApplicationStateActive ) {
//
//   UILocalNotification *localNotification = [[UILocalNotification alloc] init];
//   localNotification.userInfo = userInfo;
//   localNotification.soundName = UILocalNotificationDefaultSoundName;
//   localNotification.alertBody = [NSString stringWithFormat:@"Your App name received this notification while it was running:\n%@",[[userInfo objectForKey:@"aps"] objectForKey:@"alert"]];
//   localNotification.fireDate = [NSDate date];
//   [[UIApplication sharedApplication] scheduleLocalNotification:localNotification];
// }
//
//
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
  fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
 // If you are receiving a notification message while your app is in the background,
 // this callback will not be fired till the user taps on the notification launching the application.
 // TODO: Handle data of notification
 // With swizzling disabled you must let Messaging know about the message, for Analytics
  [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
 // Print message ID.
 if (userInfo[kGCMMessageIDKey]) {
  NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
 }
 // Print full message.
 NSLog(@"%@", userInfo);
 completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionAlert | UNAuthorizationOptionBadge);
}
// [END receive_message]
// [START ios_10_message_handling]
// Receive displayed notifications for iOS 10 devices.
// Handle incoming notification messages while app is in the foreground.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
    willPresentNotification:(UNNotification *)notification
     withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
 NSDictionary *userInfo = notification.request.content.userInfo;
 // With swizzling disabled you must let Messaging know about the message, for Analytics
  [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
 // Print message ID.
 if (userInfo[kGCMMessageIDKey]) {
  NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
 }
 // Print full message.
 NSLog(@"%@", userInfo);
 // Change this to your preferred presentation option
 completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionAlert | UNAuthorizationOptionBadge);
}
// Handle notification messages after display notification is tapped by the user.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
     withCompletionHandler:(void(^)(void))completionHandler {
 NSDictionary *userInfo = response.notification.request.content.userInfo;
 if (userInfo[kGCMMessageIDKey]) {
  NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
 }
 // With swizzling disabled you must let Messaging know about the message, for Analytics
  [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
 // Print full message.
 NSLog(@"%@", userInfo);
 completionHandler();
}
// [END ios_10_message_handling]
// [START refresh_token]
- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
  NSLog(@"FCM registration token: %@", fcmToken);
  // Notify about received token.
  NSDictionary *dataDict = [NSDictionary dictionaryWithObject:fcmToken forKey:@"token"];
  [[NSNotificationCenter defaultCenter] postNotificationName:
   @"FCMToken" object:nil userInfo:dataDict];
  // TODO: If necessary send token to application server.
  // Note: This callback is fired at each app startup and whenever a new token is generated.
}
// [END refresh_token]
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
 NSLog(@"Unable to register for remote notifications: %@", error);
}
// This function is added here only for debugging purposes, and can be removed if swizzling is enabled.
// If swizzling is disabled then this function must be implemented so that the APNs device token can be paired to
// the FCM registration token.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
 NSLog(@"APNs device token retrieved: %@", deviceToken);
 // With swizzling disabled you must set the APNs device token here.
  [FIRMessaging messaging].APNSToken = deviceToken;
}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
 [FIROptions defaultOptions].deepLinkURLScheme = @"goodch.page.link";
 // [START configure_firebase]
 [FIRApp configure];
 // [END configure_firebase]
 // [START set_messaging_delegate]
 [FIRMessaging messaging].delegate = self;
 // [END set_messaging_delegate]
 if ([UNUserNotificationCenter class] != nil) {
  // iOS 10 or later
  // For iOS 10 display notification (sent via APNS)
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
    UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
  [[UNUserNotificationCenter currentNotificationCenter]
    requestAuthorizationWithOptions:authOptions
    completionHandler:^(BOOL granted, NSError * _Nullable error) {
     // ...
    }];
 } else {
  // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
  UIUserNotificationType allNotificationTypes =
  (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
  UIUserNotificationSettings *settings =
  [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
  [application registerUserNotificationSettings:settings];
 }
 [application registerForRemoteNotifications];
 RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
 RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                          moduleName:@"dfianswallet"
                      initialProperties:nil];
 rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
 self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
 UIViewController *rootViewController = [UIViewController new];
 rootViewController.view = rootView;
 self.window.rootViewController = rootViewController;
 [self.window makeKeyAndVisible];
 [RNSplashScreen show];
 return YES;
}
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
 return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
 return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
@end
