import { Request, Response, NextFunction } from 'express';
import { WorkerDto } from '../dto/master/worker-dto';
import { WorkerServiceImpl } from '../services/master/impl/worker-service-impl';

let workerService = new WorkerServiceImpl(); 

exports.save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Reached the /workerSave endpoint');
    let workerDto = new WorkerDto();
    workerDto.filViaRequest(req.body);

    let cr = await workerService.save(workerDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};