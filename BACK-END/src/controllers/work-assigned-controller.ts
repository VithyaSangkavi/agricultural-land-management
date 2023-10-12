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
      let workAssignedDto = new WorkAssignedDto();
      workAssignedDto.filViaRequest(req.body);
  
      let cr = await workAssignedService.delete(workAssignedDto);
  
      res.send(cr);
    } catch (error) {
      next(error);
    }
  };
  
  exports.findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let workAssignedDto = new WorkAssignedDto();
      workAssignedDto.filViaRequest(req.body);
  
      let cr = await workAssignedService.find(workAssignedDto);
  
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
  