# language: tr
@performance @regression
Özellik: Yavaş Ağ Kullanıcısı (performance_glitch_user)
  Yapay gecikmeli kullanıcının, Playwright'ın otomatik beklemeleri sayesinde
  satın alma akışını sabit bekleme olmadan tamamlayabilmesi.

  @severity:normal
  Senaryo: Yavaş kullanıcı giriş yapıp ürün satın alır
    Diyelim ki login sayfasındayım
    Eğer ki "yavaş" kullanıcısı ile giriş yaparım
    O zaman envanter sayfasına yönlendirilirim
    Eğer ki 1. sıradaki ürünü sepete eklerim
    O zaman sepet rozetinde "1" yazar
    Eğer ki sepete giderim
    Ve ödeme sürecini başlatırım
    Ve müşteri bilgilerini doldururum
    Ve siparişi tamamlarım
    O zaman sipariş başarı mesajını görürüm
