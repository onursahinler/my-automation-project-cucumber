# language: tr
@checkout @e2e
Özellik: Uçtan Uca Alışveriş
  Standart kullanıcının ürün seçip ödeme akışını baştan sona tamamlaması.

  Geçmiş:
    Diyelim ki standart kullanıcı olarak giriş yaptım

  @smoke @regression @severity:blocker
  Senaryo: En pahalı iki ürün satın alınır
    Eğer ki ürünleri fiyata göre pahalıdan ucuza sıralarım
    Ve en pahalı 2 ürünü sepete eklerim
    O zaman sepet rozetinde "2" yazar
    Eğer ki sepete giderim
    Ve ödeme sürecini başlatırım
    Ve müşteri bilgilerini doldururum
    Ve siparişi tamamlarım
    O zaman sipariş başarı mesajını görürüm
