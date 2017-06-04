#import "AppProtocol.h"

@implementation AppProtocol

+ (BOOL)canInitWithRequest:(NSURLRequest *)request {
  return [request.URL.scheme isEqualToString:@"app"];
}

+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *)request {
  return request;
}

- (instancetype)initWithRequest:(NSURLRequest *)request cachedResponse:(NSCachedURLResponse *)cachedResponse client:(id<NSURLProtocolClient>)client {
  self = [super initWithRequest:request cachedResponse:cachedResponse client:client];
  return self;
}

- (void)startLoading {
  NSURL *url = self.request.URL;
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    NSString *fileName = [NSString stringWithFormat:@"%@/web/%@%@", [[NSBundle mainBundle] bundlePath], url.host, url.path];
    NSLog(@"loading %@ --> %@", url.absoluteString, fileName);
    NSData *data = [NSData dataWithContentsOfFile:fileName];
    NSString *ext = fileName.pathExtension;

    NSURLResponse *response = [[NSURLResponse alloc] initWithURL:self.request.URL
                                                        MIMEType:[self determineMIMETypeByExtension:ext]
                                           expectedContentLength:data.length
                                                textEncodingName:[self isExtensionTextFile:ext] ? @"utf-8" : nil];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      [self.client URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageNotAllowed];
      [self.client URLProtocol:self didLoadData:data];
      [self.client URLProtocolDidFinishLoading:self];
    });
  });
}

- (void)stopLoading {
}

- (NSString *)determineMIMETypeByExtension:(NSString *)ext {
  if ([ext isEqualToString:@"css"]) {
    return @"text/css";
  } else if ([ext isEqualToString:@"gif"]) {
    return @"image/gif";
  } else if ([ext isEqualToString:@"html"] || [ext isEqualToString:@"htm"]) {
    return @"text/html";
  } else if ([ext isEqualToString:@"jpeg"] || [ext isEqualToString:@"jpg"]) {
    return @"image/jpeg";
  } else if ([ext isEqualToString:@"js"]) {
    return @"application/javascript";
  } else if ([ext isEqualToString:@"json"] || [ext isEqualToString:@"map"]) {
    return @"application/json";
  } else if ([ext isEqualToString:@"png"]) {
    return @"image/png";
  } else if ([ext isEqualToString:@"svg"]) {
    return @"image/svg+xml";
  } else if ([ext isEqualToString:@"text"] || [ext isEqualToString:@"txt"]) {
    return @"text/plain";
  } else if ([ext isEqualToString:@"ttf"]) {
    return @"application/font-sfnt";
  } else if ([ext isEqualToString:@"woff"]) {
    return @"application/font-woff";
  }
  return @"application/octet-stream";
}

- (BOOL)isExtensionTextFile:(NSString *)ext {
  NSArray *textExts = @[@"css", @"html", @"html", @"js", @"json", @"map", @"svg", @"text", @"txt"];
  return [textExts indexOfObject:ext] != NSNotFound;
}

@end
