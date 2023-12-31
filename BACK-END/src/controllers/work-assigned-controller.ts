import { Request, Response, NextFunction } from 'express';
import { WorkAssignedDto } from '../dto/master/work-assigned-dto';
import { WorkAssignedServiceImpl } from '../services/master/impl/work-assigned-service-impl';

let workAssignedService = new WorkAssignedServiceImpl(); 

exports.save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Reached the /work-assigned-save endpoint');
    let workAssignedDto = new WorkAssignedDto();
    workAssignedDto.filViaRequest(req.body);

    let cr = await workAssignedService.save(workAssignedDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let workAssignedDto = new WorkAssignedDto();
      workAssignedDto.filViaRequest(req.body);
  
      let cr = await workAssignedService.update(workAssignedDto);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
  exports.delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let workAssignedId = req.params.workAssignedId
  
      let cr = await workAssignedService.delete(workAssignedId);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
  exports.findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const landID = req.query.landId;
  
      let cr = await workAssignedService.find(landID);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
  exports.findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let workAssignedId = parseInt(req.query.workAssignedId as string);
  
      let cr = await workAssignedService.findById(workAssignedId);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  


// exports.findByTaskAssignedId = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//       const workassigneddetail = await workAssignedService.findByTaskAssignedId(req.params.taskAssignedId);
//       res.json(workassigneddetail);
//   } catch (error) {
//       next(error);
//   }
// };

exports.getDetailsByTaskAssignedId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cr = await workAssignedService.getDetailsByTaskAssignedId(req.params.taskAssignedId);
    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.deleteByWorkerAndTaskCardId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workerId = req.params.workerId;
    const taskCardId = req.params.taskCardId; // Retrieve taskCardId from request parameters

    let cr = await workAssignedService.deleteByWorkerAndTaskCardId(workerId, taskCardId);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.saveWorkDates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let workAssignedDto = new WorkAssignedDto();
    workAssignedDto.filViaRequest(req.body);

    let cr = await workAssignedService.saveWorkDates(workAssignedDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};


