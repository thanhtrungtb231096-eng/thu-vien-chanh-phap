require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'ChanhPhapEngine'
  s.version = package['version']
  s.summary = package['description']
  s.license = 'MIT'
  s.homepage = 'https://thuvienchanhphap.duckdns.org'
  s.author = 'Thư Viện Chánh Pháp'
  s.source = { :git => 'https://github.com/chanhphap/thuvien.git', :tag => s.version.to_s }
  s.source_files = 'ios/Sources/**/*.{swift,h,m,c,cc,mm,cpp}'
  s.ios.deployment_target = '15.0'
  s.dependency 'Capacitor'
  s.dependency 'onnxruntime-objc', '~> 1.19.2'
  s.libraries = 'sqlite3', 'z'
  s.frameworks = 'AVFoundation', 'MediaPlayer', 'UserNotifications', 'Accelerate'
  s.swift_version = '5.9'
end

