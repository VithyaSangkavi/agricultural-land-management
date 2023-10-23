import { Request, Response, NextFunction } from 'express';
import { LotDto } from '../dto/master/lot-dto';
import { LotServiceImpl } from '../services/master/impl/lot-service-impl';

let lotService = new LotServiceImpl(); 

exports.save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let lotDto = new LotDto();
    lotDto.filViaRequest(req.body);

    let cr = await lotService.save(lotDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let lotDto = new LotDto();
    lotDto.filViaRequest(req.body);

    let cr = await lotService.find(lotDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.findByLandId = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const lots = await lotService.findByLandId(req.params.landId);
      res.json(lots);
  } catch (error) {
      next(error);
  }
};