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