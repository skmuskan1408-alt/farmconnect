import { Request, Response } from 'express';
import { generateDemandForecast } from '../services/forecastService.js';

export const getForecast = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const forecast = await generateDemandForecast(productId);
    res.json({ forecast });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to generate demand forecast' });
  }
};
