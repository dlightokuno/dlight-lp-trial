import Foundation
import Vision
import CoreImage

// 写真から人物だけを切り抜いて、背景を透明にしたPNGを書き出す。
// macOS標準のVision（被写体抽出）を使うので、追加のインストールは要らない。
let a = CommandLine.arguments
guard a.count >= 3 else { FileHandle.standardError.write("usage: cutout <in> <out.png>\n".data(using:.utf8)!); exit(2) }
let inURL = URL(fileURLWithPath: a[1]), outURL = URL(fileURLWithPath: a[2])

do {
  let handler = VNImageRequestHandler(url: inURL, options: [:])
  let req = VNGenerateForegroundInstanceMaskRequest()
  try handler.perform([req])
  guard let r = req.results?.first else {
    FileHandle.standardError.write("被写体を検出できませんでした\n".data(using:.utf8)!); exit(3)
  }
  let buf = try r.generateMaskedImage(ofInstances: r.allInstances, from: handler, croppedToInstancesExtent: false)
  let ci = CIImage(cvPixelBuffer: buf)
  let ctx = CIContext()
  try ctx.writePNGRepresentation(of: ci, to: outURL, format: .RGBA8,
                                 colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
  print("検出インスタンス数: \(r.allInstances.count)")
} catch {
  FileHandle.standardError.write("失敗: \(error)\n".data(using:.utf8)!); exit(1)
}
