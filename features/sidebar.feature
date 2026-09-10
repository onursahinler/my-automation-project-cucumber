# language: tr
@navigation @regression
Özellik: Yan Menü ve Header Navigasyonu
  Giriş yapmış kullanıcının yan menü (burger) ve header üzerinden
  gezinebilmesi ve oturumu sonlandırabilmesi.

  Geçmiş:
    Diyelim ki standart kullanıcı olarak giriş yaptım

  @severity:normal
  Senaryo: Sepetten "All Items" ile envantere dönülür
    Eğer ki sepete giderim
    Ve yan menüden "All Items" seçeneğine tıklarım
    O zaman envanter sayfasına yönlendirilirim

  @severity:minor
  Senaryo: Yan menü açılıp kapatılabilir
    Eğer ki yan menüyü açarım
    O zaman yan menü görünür
    Eğer ki yan menüyü kapatırım
    O zaman yan menü görünmez

  @smoke @regression @severity:critical
  Senaryo: Logout ile oturum sonlandırılır
    Eğer ki çıkış yaparım
    O zaman login sayfasına yönlendirilirim
