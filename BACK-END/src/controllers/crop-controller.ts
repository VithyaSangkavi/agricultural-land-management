import { Request, Response, NextFunction } from 'express';
import { CropDto } from '../dto/master/crop-dto';
import { CropServiceImpl } from '../services/master/impl/crop-service-impl';

let cropService = new CropServiceImpl(); 

exports.save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let cropDto = new CropDto();
    cropDto.filViaRequest(req.body);

    let cr = await cropService.save(cropDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};