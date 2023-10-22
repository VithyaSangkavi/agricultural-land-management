import { Request, Response, NextFunction } from 'express';
import { LandDto } from '../dto/master/land-dto';
import { LandServiceImpl } from '../services/master/impl/land-service-impl';

let landService = new LandServiceImpl(); 

exports.save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let landDto = new LandDto();
    landDto.filViaRequest(req.body);

    let cr = await landService.save(landDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let landDto = new LandDto();
    landDto.filViaRequest(req.body);

    let cr = await landService.find(landDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

export const findLandIdByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.query.name as string;

    if (!name) {
      return res.status(400).json({ error: 'Land name is required as a query parameter' });
    }

    const response = await landService.findLandIdByName(name);

    res.json(response); 
  } catch (error) {
    next(error);
  }
};
