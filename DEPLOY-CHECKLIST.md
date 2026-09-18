# 🚀 Zaza Luxury — Deploy Öncesi/Sonrası Yapılacaklar

> Bu dosya canlıya çıkarken gereken HER ŞEYİN listesi.
> Yeni özellik ekledikçe güncellenir. Son güncelleme: 2026-07-22

## 1) Hesaplar / servisler (senin açman gerekenler)

| Servis | Ne için | Ne yapmalı |
|---|---|---|
| **Stripe** (dashboard.stripe.com) | Kart ödemeleri | Hesap aç → `STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY` al. Önce test anahtarlarıyla (sk_test_) dene, sonra live'a geç |
| **Resend** (resend.com) | Doğrulama e-postaları | Hesap aç → `zazaluxury.com` domainini doğrula (DNS'e SPF/DKIM kayıtları) → `RESEND_API_KEY` al |
| **Vercel** (vercel.com) | Mağaza hosting | GitHub repo bağla → deploy. Domain: `zazaluxury.com` |
| **VPS** (ör. Hetzner/DigitalOcean, ~$5/ay) | Panel hosting | Panel + JSON veriler + /uploads kalıcı disk ister; serverless olmaz |

## 2) Ortam değişkenleri (Vercel'e girilecek)

```
PANEL_ORIGIN=https://panel.zazaluxury.com
SITE_URL=https://zazaluxury.com
STORE_SECRET=<uzun rastgele — panel .env'indekiyle AYNI>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
MAIL_FROM=Zaza Luxury <noreply@zazaluxury.com>
STORE_DEV_MOCK_CHECKOUT=      ← BOŞ BIRAK / SİL! (mock ödeme sadece local)
```

⚠️ **STORE_SECRET'i değiştir** — şu an local placeholder (`zaza-store-local-secret-change-me`).
Uzun rastgele üret (`openssl rand -hex 32`) ve panel VPS'inin `.env`'ine de aynısını koy.

## 3) Stripe kurulumu

✅ TAMAMLANANLAR (local test):
- [x] Stripe sandbox hesabı açıldı ("Zaza Luxury sandbox")
- [x] Test anahtarları `.env.local`'e eklendi (`pk_test_` + `sk_test_`)
- [x] Ödeme akışı test edildi: sepet → checkout → checkout.stripe.com açılıyor ✓ (mock kapandı)

⏳ DEPLOY GÜNÜ YAPILACAK (kullanıcı: "webhook'u deploy günü halledelim"):
- [ ] **Webhook kurulumu** — local'de KURULMADI, bilinçli olarak deploy'a bırakıldı.
      Canlıda: Dashboard → Webhooks → endpoint ekle: `https://zazaluxury.com/api/webhook`
- [ ] Event: `checkout.session.completed`
- [ ] Webhook'un `whsec_...` sırrını `STRIPE_WEBHOOK_SECRET`'e koy (şu an BOŞ)
- [ ] Webhook kurulmadan: ödeme alınır AMA panele "Store satışı" otomatik DÜŞMEZ → webhook şart
- [ ] Test kartı: 4242 4242 4242 4242 · ileri tarih · herhangi CVC → panelde satış düştü mü kontrol et
- [ ] Live moda geçince webhook'u live için TEKRAR oluştur (test/live ayrı)
- [ ] `sk_test_`/`pk_test_` → `sk_live_`/`pk_live_` ile değiştir (Vercel env)

## 4) DNS (Porkbun)

- [ ] `zazaluxury.com` (kök) → Vercel (ALIAS/A kaydı — Vercel sana verir)
- [ ] `www` → Vercel (CNAME) — Vercel www→kök yönlendirmesini açar
- [ ] `panel` → VPS IP'si (A kaydı)
- [ ] Resend'in istediği SPF/DKIM TXT kayıtları (mail doğrulama)

## 5) Panel deploy — Railway + kalıcı volume (SEÇİLEN YOL)

Panel `railway.json` ile Railway'e hazır. Kalıcı depolama için **volume** şart
(Railway diski deploy'da silinir — volume silinmez).

✅ KOD HAZIRLIĞI TAMAM (2026):
- [x] `DATA_ROOT` env desteği eklendi → veri (`$DATA_ROOT/data`) + fotoğraflar
      (`$DATA_ROOT/uploads`) kalıcı volume'a yazılıyor (store.js, auth.js, index.js)
- [x] DATA_ROOT boşken local davranış aynı (server/data) — test edildi

⏳ RAILWAY'DE YAPILACAK (kullanıcı hesabı + ~$5/ay Hobby planı):
- [ ] Railway hesabı aç (railway.app) → Hobby plan ($5/ay, volume için gerekli)
- [ ] Proje oluştur → `zaza-collection` deploy et (Railway CLI `railway up` VEYA GitHub)
- [ ] **Volume ekle** → mount path: `/data`
- [ ] Env değişkenleri:
      `DATA_ROOT=/data`  ·  `JWT_SECRET=<uzun rastgele>`  ·  `STORE_SECRET=<mağazayla AYNI>`
- [ ] Domain: `panel.zazaluxury.com` (Railway custom domain + Porkbun A/CNAME)
- [ ] İlk açılışta: admin/host hesapları otomatik oluşur (admin@zaza.com / admin123 → ŞİFRE DEĞİŞTİR)
- [ ] Ürünler + fotoğraflar canlı panelden girilecek (volume'da kalıcı)
- [ ] (İleride) fotoğraf yedeği: volume snapshot veya Cloudflare R2'ye taşıma opsiyonu

## 6) MÜŞTERİ HESAPLARI — kritik mimari not ⚠️

Müşteri hesapları şu an `data/shoppers.json` dosyasında. **Vercel'de kalıcı disk YOK** —
her deploy'da silinir. Canlıya çıkmadan önce İKİ seçenekten biri:

- **Seçenek A (önerilen):** Küçük bir DB'ye taşı — Vercel Postgres, Turso veya Neon
  (hepsinin ücretsiz katmanı var). `lib/shoppers.js` tek dosya; sadece read/write fonksiyonları değişir.
- **Seçenek B:** Hesap sistemini panel VPS'ine taşı (panel zaten kalıcı diskli).

→ Deploy günü geldiğinde bana "hesapları DB'ye taşı" de, hallederim.

Aynı durum bülten aboneleri için de geçerli: `data/newsletter.json` → deploy öncesi
DB'ye veya Resend Audiences'a taşınmalı (hesaplarla birlikte hallederim).
Bülten gönderimi de Resend üzerinden yapılacak ("yeni ürün" duyuruları — istersen
panelde "publish" olunca otomatik duyuru maili özelliği ekleriz).

## 7) Son kontroller (go-live günü)

- [ ] `STORE_DEV_MOCK_CHECKOUT` Vercel'de YOK/boş (kritik — yoksa bedava "satış" olur)
- [ ] Panelde gerçek ürünler `published` + gerçek fotoğraflar yüklü
- [ ] Demo ürünleri sil: panelde arşivle veya `demo:true` olanları temizle
      (`node -e "...filter(p=>!p.demo)..."` — README'de komut var)
- [ ] Celine'in demo SVG fotoğraflarını gerçekleriyle değiştir
- [ ] Gerçek (küçük tutarlı) bir canlı ödeme testi → panelde Store satışı + kâr doğru mu
- [ ] `https://zazaluxury.com/sitemap.xml` açılıyor mu
- [ ] Google Search Console'a domain ekle + sitemap gönder (SEO)
- [ ] Mağazadan test kaydı oluştur → doğrulama maili GERÇEKTEN geliyor mu (spam'e düşüyor mu bak)

## 7b) Bekleyen fikirler (kullanıcı istedi, sonra)

- [ ] **Anasayfaya bilgilendirme yazısı** ekle (kullanıcı 2026 sürecinde istedi — içerik/konum
      netleşecek: ör. açılış duyurusu, "yeni parçalar ekleniyor" notu vb.)

## 8) İleride (opsiyonel, istersen)

- [ ] Google/Apple/Facebook ile giriş — OAuth anahtarları gerekir
      (Google Cloud Console / Apple Developer $99/yıl / Meta Developers). Şimdilik butonlar "coming soon"
- [ ] Sipariş geçmişi sayfası (hesabım → siparişlerim)
- [ ] Kargo takip e-postaları
- [ ] Rate limiter'ı Redis'e taşı (çok trafik olursa; şimdilik bellek-içi yeterli)

---
*Bu dosyayı silme — her yeni özellikte güncellenir.*
