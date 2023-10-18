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

exports.update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let workerDto = new WorkerDto();
      workerDto.filViaRequest(req.body);
  
      let cr = await workerService.update(workerDto);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
  exports.delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let workerDto = new WorkerDto();
      workerDto.filViaRequest(req.body);
  
      let cr = await workerService.delete(workerDto);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
  exports.findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Reached the /workerFindAll endpoint');
      let workerDto = new WorkerDto();
      workerDto.filViaRequest(req.body);
  
      let cr = await workerService.find(workerDto);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
  exports.findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let workerId = parseInt(req.query.workerId as string);
  
      let cr = await workerService.findById(workerId);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };

  exports.findByLandId = async(req: Request, res: Response) => {
    try {
      const landId = Number(req.query.landId); // Extract the landId from the request query parameters
      console.log('Received landId:', landId);
      const result = await workerService.findByLandId(landId);
      res.json(result);
    } catch (error) {
      // Handle errors and send an error response if needed
      res.status(500).json({ error: 'An error occurred' });
    }
  }
  
