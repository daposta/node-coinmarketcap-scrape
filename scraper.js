const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');


async function getCryptoPriceFeed(){
  
  try{
      const siteUrl = 'https://coinmarketcap.com/';

      const {data} = await axios({method: 'GET', url: siteUrl});
      //console.log(data);
      const $ = cheerio.load(data)
      const elementSelector = '#__next > div.bywovg-1.sXmSU > div.main-content > div.sc-57oli2-0.dEqHl.cmc-body-wrapper > div > div:nth-child(1) > div.h7vnx2-1.bFzXgL > table > tbody > tr';
      const keys = [
      'rank',
      'name', 
      'price', 
      '24h', 
      '7d', 
      'marketCap',
      'volume',
      'circulatingSupply'
      ]

      coinArray = [];
      $(elementSelector).each( (parentIdx, parentElem) => {
        let keyIdx = 0
        const coinObj = {}
        
       if(parentIdx <= 9){
           $(parentElem).children().each((childIdx, childElem) =>{
            
            let tdValue = $(childElem).text();

            if(keyIdx === 1  || keyIdx === 6){
                tdValue = $('p:first-child', $(childElem).html()).text()
            }

            if(keyIdx ===5){
              tdValue = $('p:first-child', $(childElem).next().html()).text()
            }

            if(tdValue){
              
              coinObj[keys[keyIdx]] = tdValue;
              keyIdx++;
            }

        })
           
           coinArray.push(coinObj)
       }

      })

      return coinArray;
  }catch(err){
      console.error(err);
  }
}



const app = express()

app.get('/api/price-feed', async (req, res) => {
  try{
      const result = await getCryptoPriceFeed();
     
      return res.status(200).json({feed: result})
  }catch(err){
      return res.status(500).json({err : err.toString()})
  }
});


app.listen(3000,() => {
  console.log('Running at port 3000')
})
