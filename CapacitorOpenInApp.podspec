Pod::Spec.new do |s|
  s.name         = 'CapacitorOpenInApp'
  s.version      = '0.2.0'
  s.summary      = 'Capacitor plugin for receiving shared files from other apps'
  s.license      = 'MIT'
  s.homepage     = 'https://github.com/zegioni/capacitor-open-in-app'
  s.author       = 'Mykyta'
  s.source       = { :git => 'https://github.com/zegioni/capacitor-open-in-app.git', :tag => s.version.to_s }
  s.source_files = 'ios/Plugin/**/*.{swift,h,m}'
  s.ios.deployment_target = '15.0'
  s.swift_version = '5.5'
  s.dependency 'Capacitor'
end
