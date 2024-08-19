import express, { Request, Response } from 'express'
import { createClient } from 'redis';
import { getAllProducts } from './src/getAllProducts'
const app = express();
const client = createClient();

client.on('error', (error) => {
    console.error('houve um erro na conection REDIS: ', error)
})

app.get('/', async (req: Request, res: Response) => {
  const productsInCache = await client.get('getAllProducts')
  if(productsInCache){
    return res.send(JSON.parse(productsInCache));
  }
  const products = await getAllProducts();
  await client.set('getAllProducts', JSON.stringify(products))
  res.send(products)
}); 

const startUp = async () => { //função de start-server
  try{
    await client.connect();
    app.listen(3000, () => {
      console.log('server running...')
    })
  }catch(err){
    console.error('houve um erro na inicialização do servidor:', err)
  };
};
startUp();

export { app, client };