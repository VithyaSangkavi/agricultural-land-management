import { getConnection, Like } from "typeorm";
import { TaskCardDto } from "../../dto/master/task-card-dto";
import { Status } from "../../enum/Status";
import { TaskCardStatus } from "../../enum/taskCardStatus";
import { TaskCardEntity } from "../../entity/master/task-card-entity";
import { TaskCardDao } from "../task-card-dao";
import { TaskAssignedEntity } from "../../entity/master/task-assigned-entity";

/**
 * department data access layer
 * contain crud method
 */
export class TaskCardDaoImpl implements TaskCardDao {
    async save(taskCardDto: TaskCardDto, taskAssignedModel: TaskAssignedEntity): Promise<TaskCardEntity> {
        let taskCardRepo = getConnection().getRepository(TaskCardEntity);
        let taskCardModel = new TaskCardEntity();

        taskCardModel.taskAssigned = taskAssignedModel;

        taskCardModel.status = Status.Online;
        this.preparetaskCardModel(taskCardModel, taskCardDto);
        let savedTaskCard = await taskCardRepo.save(taskCardModel);
        return savedTaskCard;
    }
    async update(taskCardDto: TaskCardDto, id: number): Promise<TaskCardEntity | null> {
        let taskCardRepo = getConnection().getRepository(TaskCardEntity);
        let taskCardModel = await taskCardRepo.findOne(id);

        if (taskCardModel) {
            this.preparetaskCardModel(taskCardModel, taskCardDto);
            let updatedModel = await taskCardRepo.save(taskCardModel);
            return updatedModel;
        } else {
            return null;
        }
    }

    async delete(TaskCardDto: TaskCardDto): Promise<TaskCardEntity> {
        let taskCardRepo = getConnection().getRepository(TaskCardEntity);
        let taskCardModel = await taskCardRepo.findOne(TaskCardDto.getTaskCardId());
        if (taskCardModel) {
            taskCardModel.status = Status.Offline;
            let updatedModel = await taskCardRepo.save(taskCardModel);
            return updatedModel;
        } else {
            return null;
        }
    }
    async findAll(TaskCardDto: TaskCardDto): Promise<TaskCardEntity[]> {
        let taskCardRepo = getConnection().getRepository(TaskCardEntity);
        let searchObject: any = this.prepareSearchObject(TaskCardDto);
        let taskCardModel = await taskCardRepo.find({
            where: searchObject,
            skip: TaskCardDto.getStartIndex(),
            take: TaskCardDto.getMaxResult(),
            order: { id: "DESC" }
        });
        return taskCardModel;
    }
    async findCount(TaskCardDto: TaskCardDto): Promise<number> {
        let taskCardRepo = getConnection().getRepository(TaskCardEntity);
        let searchObject: any = this.prepareSearchObject(TaskCardDto);
        let taskCardModel = await taskCardRepo.count({ where: searchObject });
        return taskCardModel;
    }
    async findById(taskCardId: number): Promise<TaskCardEntity> {
        let taskCardRepo = getConnection().getRepository(TaskCardEntity);
        let taskCardModel = await taskCardRepo.findOne(taskCardId);
        return taskCardModel;
    }

    async findByName(name: String): Promise<TaskCardEntity> {
        let taskCardRepo = getConnection().getRepository(TaskCardEntity);
        let taskCardModel = await taskCardRepo.findOne({ where: { name: name, status: Status.Online } });
        return taskCardModel;
    }

    async findTaskCardByTaskId(taskAssignedId: number): Promise<TaskCardEntity> {
        const taskAssignedRepo = getConnection().getRepository(TaskCardEntity);
        console.log("Searching for taskAssignedId:", taskAssignedId);
        const taskAssignedModel = await taskAssignedRepo.findOne({
            where: { taskAssigned: taskAssignedId },
        });
        console.log("Query result:", taskAssignedModel);
        return taskAssignedModel;
    }

    async updateStatus(taskCardId: number, newStatus: string): Promise<TaskCardEntity | null> {
        const incomeRepository = getConnection().getRepository(TaskCardEntity);

        try {
            const existingStatus = await incomeRepository.findOne(taskCardId);

            if (!existingStatus) {
                return null;
            }

            // Use type casting to assign newStatus to cardStatus
            existingStatus.cardStatus = newStatus as TaskCardStatus;
            existingStatus.updatedDate = new Date();

            const updatedStatus = await incomeRepository.save(existingStatus);

            return updatedStatus;
        } catch (error) {
            throw error;
        }
    }

    async preparetaskCardModel(taskCardModel: TaskCardEntity, TaskCardDto: TaskCardDto) {
        taskCardModel.taskAssignedDate = TaskCardDto.getTaskAssignedDate();
        taskCardModel.cardStatus = TaskCardStatus.Ongoing;
        taskCardModel.createdDate = new Date();
        taskCardModel.updatedDate = new Date();
        taskCardModel.status = Status.Online;
        taskCardModel.workDate = TaskCardDto.getWorkDate();
    }
    
    prepareSearchObject(TaskCardDto: TaskCardDto): any {
        let searchObject: any = {};
        if (TaskCardDto.getTaskAssignedDate()) {
            searchObject.taskAssignedDate = TaskCardDto.getTaskAssignedDate();
        }

        searchObject.cardStatus = TaskCardStatus.Ongoing;

        if (TaskCardDto.getCreatedDate()) {
            searchObject.createdDate = TaskCardDto.getCreatedDate();
        }
        if (TaskCardDto.getUpdatedDate()) {
            searchObject.updatedDate = TaskCardDto.getUpdatedDate();
        }

        searchObject.status = Status.Online;

        if (TaskCardDto.getTaskAssignedId()) {
            searchObject.taskAssignedId = TaskCardDto.getTaskAssignedId();
        }

        return searchObject;
    }

}
