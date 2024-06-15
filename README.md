# ZK Transfer Bot

Bu proje, belirli bir zkSync cüzdanına gelen tokenları otomatik olarak başka bir cüzdana transfer eden bir bottur. Proje, ethers.js ve Node.js kullanılarak geliştirilmiştir ve Dockerize edilmiştir.

## Kurulum

### Gereksinimler

- [Node.js](https://nodejs.org/en/download/package-manager)
- [Docker (opsiyonel)](https://www.docker.com/products/docker-desktop/)

### Adımlar

1. Bu depoyu klonlayın:

```sh
   git clone https://github.com/codeesura/zk-transfer-bot.git
```

2. Proje dizinine gidin:

```sh
   cd zk-transfer-bot
```

3. Gerekli Node.js bağımlılıklarını yükleyin:

```sh
   npm install
```

## Yapılandırma

Projenin kök dizininde `config` klasörü altında iki yapılandırma dosyası bulunmaktadır: `tokens.json` ve `wallets.json`. Tokens.json zaten yapılandırılmış bir dosyadır.

### wallets.json

Bu dosya, cüzdan bilgilerini ve transfer edilecek adresleri içerir. Örneğin:

```json
{
  "providerUrl": "https://zksync-rpc.felinaprotocol.io/",
  "wallets": [
    {
      "privateKey": "YOUR_PRIVATE_KEY_1",
      "transferToAddress": "ADDRESS_TO_TRANSFER_TO_1"
    },
    {
      "privateKey": "YOUR_PRIVATE_KEY_2",
      "transferToAddress": "ADDRESS_TO_TRANSFER_TO_2"
    }
  ]
}
```

## Kullanım

### Node.js ile Çalıştırma

1. Projeyi başlatın:

```sh
   npm i && npm start
```

### Docker ile Çalıştırma

1. Docker imajını oluşturun:

```sh
   docker build -t my-node-app .
```

2. Docker konteynerini çalıştırın:

```sh
   docker run my-node-app
```

## Kod Açıklaması

### src/monitor.js

Bu dosya, token transferlerini izler ve transfer işlemlerini gerçekleştirir. `transferTokens` fonksiyonu, bir cüzdanın bakiyesini kontrol eder ve belirli bir adrese transfer eder. `monitorWallet` fonksiyonu ise belirli bir cüzdanı izler ve transfer olaylarını dinler.

### Retry Mekanizması

Kodda, ağ hataları durumunda işlemleri tekrar denemek için bir retry mekanizması bulunmaktadır. Bu mekanizma, belirli bir deneme sayısına kadar işlemleri tekrar dener ve her başarısız denemede belirli bir süre bekler.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için LICENSE dosyasına bakın.
