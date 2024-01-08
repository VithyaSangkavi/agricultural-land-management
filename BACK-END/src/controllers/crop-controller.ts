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


// exports.findCropIdByLandId = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const landId = parseInt(req.params.landId, 10); // Parse landId from the URL parameter

//     if (isNaN(landId)) {
//       return res.status(400).json({ error: 'Invalid landId parameter' });
//     }

//     const cropId = await cropService.findCropIdByLandId(landId);

//     if (cropId) {
//       res.json({ cropId });
//     } else {
//       res.status(404).json({ error: 'Crop not found for the given landId' });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

exports.findCropNameByLandId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const landId = parseInt(req.params.landId, 10); // Parse landId from the URL parameter

    if (isNaN(landId)) {
      return res.status(400).json({ error: 'Invalid landId parameter' });
    }

    const cropName = await cropService.findCropNameByLandId(landId);

    if (cropName) {
      res.json({ cropName });
    } else {
      res.status(404).json({ error: 'Crop not found for the given landId' });
    }
  } catch (error) {
    next(error);
  }
};