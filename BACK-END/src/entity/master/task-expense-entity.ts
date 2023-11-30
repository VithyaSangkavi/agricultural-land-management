import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Status } from "../../enum/Status";
import { TaskTypeEntity } from "./task-type-entity";
import { ExpensesEntity } from "./expense-entity";
import { TaskAssignedEntity } from "./task-assigned-entity";

@Entity({
  name: "task-expense",
})
export class TaskExpenseEntity {
  @PrimaryGeneratedColumn({ name: "taskExpenseId" })
  id: number;

  @Column()
  value: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ type: "enum", enum: Status, default: Status.Online })
  status: Status;

  @ManyToOne(() => TaskTypeEntity, (taskType) => taskType.taskExpense)
  @JoinColumn({ name: "taskId" })
  taskType: TaskTypeEntity;

  @ManyToOne(() => ExpensesEntity, (expense) => expense.taskExpense)
  @JoinColumn({ name: "expenseId" })
  expense: ExpensesEntity;

  @ManyToOne(() => TaskAssignedEntity, (taskAssigned) => taskAssigned.taskCard)
  @JoinColumn({ name: "taskAssignedId" })
  taskAssigned: TaskAssignedEntity;
}
