import UIKit

class AppProtocol: URLProtocol {
  override class func canInit(with request: URLRequest) -> Bool {
    return request.url!.scheme == "app"
  }

  override class func canonicalRequest(for request: URLRequest) -> URLRequest {
    return request;
  }

  override func startLoading() {
    let url = self.request.url!
    DispatchQueue.global(qos: .userInitiated).async {
      let fileName = "\(Bundle.main.bundlePath)/web/\(url.host!)\(url.path)"
      print("loading \(url.absoluteString) --> \(fileName)")
      let fileURL = URL(fileURLWithPath: fileName)

      let data = try? Data(contentsOf: fileURL)
      let ext = fileURL.pathExtension

      let response = URLResponse.init(url: self.request.url!,
                                      mimeType: mimeType(ext: ext),
                                      expectedContentLength: data!.count,
                                      textEncodingName: isTextFile(ext: ext) ? "utf-8" : nil)

      DispatchQueue.main.async {
        let client = self.client!
        client.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        client.urlProtocol(self, didLoad: data!)
        client.urlProtocolDidFinishLoading(self)
      }
    }
  }

  override func stopLoading() {
  }
}

func mimeType(ext: String) -> String {
  switch ext {
  case "css":
    return "text/css"
  case "gif":
    return "image/gif"
  case "html", "htm":
    return "text/html"
  case "jpeg", "jpg":
    return "image/jpeg"
  case "js":
    return "application/javascript"
  case "json", "map":
    return "application/json"
  case "png":
    return "image/png"
  case "svg":
    return "image/svg+xml"
  case "text", "txt":
    return "text/plain"
  case "ttf":
    return "application/font-sfnt"
  case "woff":
    return "application/font-woff"
  default:
    return "application/octet-stream"
  }
}

func isTextFile(ext: String) -> Bool {
  return ["css", "html", "htm", "js", "json", "map", "svg", "text", "txt"].contains(ext)
}
