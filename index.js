const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const movies = [
  "https://www.imdb.com/title/tt0242519/?ref_=nv_sr_srsg_3",
  "https://www.imdb.com/title/tt10651790/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=bc7330fc-dcea-4771-9ac8-70734a4f068f&pf_rd_r=ZGM47Q1QTDWWEE181C3S&pf_rd_s=center-8&pf_rd_t=15021&pf_rd_i=tt0242519&ref_=tt_tp_i_1",
  "https://www.imdb.com/title/tt9680440/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=bc7330fc-dcea-4771-9ac8-70734a4f068f&pf_rd_r=DPQBQ2QZV5AQ22NXT40Y&pf_rd_s=center-8&pf_rd_t=15021&pf_rd_i=tt10651790&ref_=tt_tp_i_2",
];

(async () => {
  let imdbData = [];

  for (let movie of movies) {
    const response = await request({
      uri: movie,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      },
      gzip: true,
    });

    let $ = cheerio.load(response);
    let title = $('div[class="title_wrapper"] >  h1').text().trim();
    let rating = $('div[class="ratingValue"] >  strong >span').text();
    let summary = $('div[class="summary_text"]').text().trim();
    let releaseDate = $('a[title="See more release dates"]').text().trim();

    imdbData.push({
      title,
      rating,
      summary,
      releaseDate,
    });
  }
  const j2cp = new json2csv();
  const csv = j2cp.parse(imdbData);

  fs.writeFileSync("./imdb.csv", csv, "utf-8");
})();
