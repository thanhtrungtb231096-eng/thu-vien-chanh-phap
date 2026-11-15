require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'ChanhPhapEngine'
  s.version = package['version']
  s.summary = package['description']
  s.license = 'MIT'
  s.homepage = 'https://thuvienchanhphap.duckdns.org'
  s.author = 'Thư Viện Chánh Pháp'
  s.source = { :git => 'https://github.com/thanhtrungtb231096-eng/thu-vien-chanh-phap.git', :tag => s.version.to_s }
  s.source_files = 'ios/Sources/**/*.{swift,h,m,c,cc,mm,cpp}'
  s.public_header_files = 'ios/Sources/**/*.h'
  s.ios.deployment_target = '15.0'
  s.static_framework = true
  s.dependency 'Capacitor'
  s.dependency 'onnxruntime-c', '1.19.2'
  s.libraries = 'sqlite3', 'z', 'c++'
  s.frameworks = 'AVFoundation', 'MediaPlayer', 'UserNotifications', 'Accelerate'
  s.swift_version = '5.9'
end
