const getRandomInt = (n: number) => Math.floor(Math.random() * Math.floor(n));

export class GauGan {
  static addresses = [
    "54.191.227.231:443",
    // todo: figure what these //were// used for...
    // "34.221.84.127:443",
    // "34.216.59.35:443",
  ];

  address: string;
  id: string;

  constructor() {
    const randomNumber = getRandomInt(1000000000);
    const idDateString = new Date().toLocaleDateString();
    const idTime = new Date().getTime();
    const id = idDateString + "," + idTime + "-" + randomNumber;

    const guagan = (this.constructor as typeof GauGan);

    this.address = guagan.addresses[randomNumber % guagan.addresses.length];
    this.id = idDateString + "," + idTime + "-" + randomNumber;
  }

  uploadImage(imageBase64: string) {
    return fetch(`http://${this.address}/nvidia_gaugan_submit_map`, {
      method: "POST",
      mode: "cors",
      body: new URLSearchParams({
        imageBase64: imageBase64,
        name: this.id,
      }),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Host": this.address,
        "Origin": "http://34.216.122.111",
        "Referer": "http://34.216.122.111/gaugan/",
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(
          `Error while uploading image: ${res.status}: ${res.statusText}`,
        );
      }
      return res;
    });
  }

  fetchResult() {
    const data = new FormData();
    data.append("name", this.id);
    data.append("style_name", "random");

    return fetch(`http://${this.address}/nvidia_gaugan_receive_image`, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      body: data,
      "headers": {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Host": this.address,
        "Origin": "http://34.216.122.111",
        "Referer": "http://34.216.122.111/gaugan/",
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(
          `Error while fetching image: ${res.status}: ${res.statusText}`,
        );
      }
      return res;
    });
  }

  async transformImage(imageBase64: string) {
    await this.uploadImage(imageBase64);
    return this.fetchResult();
  }
}