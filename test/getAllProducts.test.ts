import request from "supertest";
import { app, client } from '../index'
import * as getAllProductsModule from "../src/getAllProducts";

interface Product {
    id: number;
    name: string;
  }

jest.mock('redis', () => {
  const mClient = {
    get: jest.fn(),
    set: jest.fn(),  
    on: jest.fn(),
    connect: jest.fn(),
    quit: jest.fn(),
  };
  return {
    createClient: jest.fn(() => mClient),
  };
});

jest.mock('../src/getAllProducts', () => ({
    getAllProducts: jest.fn(),
  }));

describe('GET /', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  afterAll( async () => {
    await client.quit();
  })

  it('should return products from cache if available', async () => {
    const mockProducts: Product[] = [{ id: 1, name: 'Product 1' }];
    
    (client.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockProducts));
    
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProducts);
    expect(client.get).toHaveBeenCalledWith('getAllProducts');
    expect(client.set).not.toHaveBeenCalled();
    expect(getAllProductsModule.getAllProducts).not.toHaveBeenCalled();
  })

  it('should return products from database and cache them if not in cache', async () => {
    const mockProducts: Product[] = [{ id: 2, name: 'Product 2' }]

    const { getAllProducts } = getAllProductsModule;
    (getAllProducts as jest.Mock).mockResolvedValueOnce(mockProducts);

    (client.get as jest.Mock).mockResolvedValueOnce(null)

    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProducts)
    expect(client.get).toHaveBeenCalledWith('getAllProducts');
    expect(client.set).toHaveBeenCalledWith('getAllProducts', JSON.stringify(mockProducts));
    expect(getAllProducts).toHaveBeenCalled();
  })
}) 