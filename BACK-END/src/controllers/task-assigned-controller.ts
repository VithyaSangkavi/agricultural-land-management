import { Request, Response, NextFunction } from 'express';
import { TaskAssignedDto } from '../dto/master/task-assigned-dto';
import { TaskAssignedServiceImpl } from '../services/master/impl/task-assigned-service-impl';

let taskAssignedService = new TaskAssignedServiceImpl();

exports.save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Reached the /task-assigned-save endpoint');
    let taskAssignedDto = new TaskAssignedDto();
    taskAssignedDto.filViaRequest(req.body);

    let cr = await taskAssignedService.save(taskAssignedDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let taskAssignedDto = new TaskAssignedDto();
    taskAssignedDto.filViaRequest(req.body);

    let cr = await taskAssignedService.update(taskAssignedDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let taskAssignedDto = new TaskAssignedDto();
    taskAssignedDto.filViaRequest(req.body);

    let cr = await taskAssignedService.delete(taskAssignedDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let taskAssignedDto = new TaskAssignedDto();
    taskAssignedDto.filViaRequest(req.body);

    let cr = await taskAssignedService.find(taskAssignedDto);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let taskAssignedId = parseInt(req.query.taskAssignedId as string);

    let cr = await taskAssignedService.findById(taskAssignedId);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.findByTaskId = async (req, res, next) => {
  try {
    let taskId = Number(req.query.taskId);
    console.log('Received taskId:', taskId);
    let cr = await taskAssignedService.findByTaskId(taskId);

    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.getOngoingTasksWithTaskNames = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cr = await taskAssignedService.getOngoingTasksWithTaskNames();
    res.send(cr);
  } catch (error) {
    next(error);
  }
};

exports.updateEndDate = async (req, res, next) => {
  try {
    const taskAssignedId = parseInt(req.params.taskAssignedId, 10);
    const endDate = req.body.endDate;
    const newStatus = req.body.newStatus;
    

    const result = await taskAssignedService.updateEndDate(taskAssignedId, endDate, newStatus);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

