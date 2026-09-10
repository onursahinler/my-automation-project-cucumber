# language: tr
@cart @regression
Özellik: Sepet Yönetimi ve Checkout
  Sepette ürün silme, tekrar ekleme ve ardından satın alma akışı.

  Geçmiş:
    Diyelim ki standart kullanıcı olarak giriş yaptım

  @severity:critical
  Senaryo: En pahalı 3 üründen biri silinip tekrar eklenerek satın alınır
    Eğer ki ürünleri fiyata göre pahalıdan ucuza sıralarım
    Ve en pahalı 3 üründen en ucuzunun adını hatırlarım
    Ve en pahalı 3 ürünü sepete eklerim
    O zaman sepet rozetinde "3" yazar
    Eğer ki sepete giderim
    O zaman sepette 3 ürün bulunur
    Eğer ki hatırladığım ürünü sepetten çıkarırım
    O zaman sepette 2 ürün bulunur
    Eğer ki alışverişe devam ederim
    Ve hatırladığım ürünü tekrar sepete eklerim
    O zaman sepet rozetinde "3" yazar
    Eğer ki sepete giderim
    O zaman sepette 3 ürün bulunur
    Eğer ki ödeme sürecini başlatırım
    Ve müşteri bilgilerini doldururum
    Ve siparişi tamamlarım
    O zaman sipariş başarı mesajını görürüm
