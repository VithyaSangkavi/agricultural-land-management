import { TaskAssignedEntity } from "../../entity/master/task-assigned-entity";

export class TaskAssignedResDto {
    private id: number;

    filViaDbObject(TaskAssignedModel: TaskAssignedEntity) {
        this.id = TaskAssignedModel.id;

    }

    public getTaskAssignedId(): number {
        return this.id;
    }

    public setTaskAssignedId(id: number): void {
        this.id = id;
    }

}
