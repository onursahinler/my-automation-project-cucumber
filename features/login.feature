# language: tr
@login
Özellik: Giriş (Login)
  Sauce Demo kullanıcılarının kimlik doğrulaması.

  Geçerli kullanıcılar envanter sayfasına ulaşır; kilitli veya geçersiz
  kimlik bilgileri uygun hata mesajıyla reddedilir.

  @smoke @regression @severity:blocker
  Senaryo: Standart kullanıcı başarıyla giriş yapar
    Diyelim ki login sayfasındayım
    Eğer ki "standart" kullanıcısı ile giriş yaparım
    O zaman envanter sayfasına yönlendirilirim

  @regression @severity:critical
  Senaryo: Kilitli kullanıcı giriş yapamaz
    Diyelim ki login sayfasındayım
    Eğer ki "kilitli" kullanıcısı ile giriş yaparım
    O zaman kilitli kullanıcı hata mesajını görürüm

  @regression @severity:critical
  Senaryo: Geçersiz kimlik bilgisi reddedilir
    Diyelim ki login sayfasındayım
    Eğer ki geçersiz kimlik bilgileri ile giriş yaparım
    O zaman geçersiz kimlik bilgisi hata mesajını görürüm
