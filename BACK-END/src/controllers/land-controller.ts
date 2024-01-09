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

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const landId = req.query.landId as number;

    if (!landId) {
      return res.status(400).json({ error: 'Land id is required as a query parameter' });
    }

    const response = await landService.findById(landId);

    res.json(response); 
  } catch (error) {
    next(error);
  }
};

exports.findCropIdByLandId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const landId = parseInt(req.params.landId, 10);

    if (isNaN(landId)) {
      return res.status(400).json({ error: 'Invalid landId parameter' });
    }

    const cropId = await landService.findCropIdByLandId(landId);

    if (cropId) {
      res.json({ cropId });
    } else {
      res.status(404).json({ error: 'Crop not found for the given landId' });
    }
  } catch (error) {
    next(error);
  }
};