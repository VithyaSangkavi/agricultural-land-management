import { getConnection, Like } from "typeorm";
import { DepartmentDto } from "../../dto/master/department-dto";
import { Status } from "../../enum/status";
import { DepartmentEntity } from "../../entity/master/department-entity";
import { DepartmentDao } from "../department-dao";

/**
 * department data access layer
 * contain crud method
 */
export class DepartmentDaoImpl implements DepartmentDao {
  async save(departmentDto: DepartmentDto): Promise<DepartmentEntity> {
    let departmentRepo = getConnection().getRepository(DepartmentEntity);
    let departmentModel = new DepartmentEntity();

    departmentModel.status = Status.Online;
    this.prepareDepartmentModel(departmentModel, departmentDto);
    let savedDept = await departmentRepo.save(departmentModel);
    return savedDept;
  }
  async update(departmentDto: DepartmentDto): Promise<DepartmentEntity> {
    let departmentRepo = getConnection().getRepository(DepartmentEntity);
    let departmentModel = await departmentRepo.findOne(departmentDto.getDepartmentId());
    if (departmentModel) {
      this.prepareDepartmentModel(departmentModel, departmentDto);
      let updatedModel = await departmentRepo.save(departmentModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async delete(departmentDto: DepartmentDto): Promise<DepartmentEntity> {
    let departmentRepo = getConnection().getRepository(DepartmentEntity);
    let departmentModel = await departmentRepo.findOne(departmentDto.getDepartmentId());
    if (departmentModel) {
      departmentModel.status = Status.Offline;
      let updatedModel = await departmentRepo.save(departmentModel);
      return updatedModel;
    } else {
      return null;
    }
  }
  async findAll(departmentDto: DepartmentDto): Promise<DepartmentEntity[]> {
    let departmentRepo = getConnection().getRepository(DepartmentEntity);
    let searchObject: any = this.prepareSearchObject(departmentDto);
    let departmentModel = await departmentRepo.find({
      where: searchObject,
      skip: departmentDto.getStartIndex(),
      take: departmentDto.getMaxResult(),
      order:{id:"DESC"}
    });
    return departmentModel;
  }
  async findCount(departmentDto: DepartmentDto): Promise<number> {
    let departmentRepo = getConnection().getRepository(DepartmentEntity);
    let searchObject: any = this.prepareSearchObject(departmentDto);
    let departmentModel = await departmentRepo.count({ where: searchObject });
    return departmentModel;
  }
  async findById(departmentId: number): Promise<DepartmentEntity> {
    let departmentRepo = getConnection().getRepository(DepartmentEntity);
    let departmentModel = await departmentRepo.findOne(departmentId);
    return departmentModel;
  }

  async findByName(name: String): Promise<DepartmentEntity> {
    let departmentRepo = getConnection().getRepository(DepartmentEntity);
    let departmentModel = await departmentRepo.findOne({ where: { name: name, status: Status.Online } });
    return departmentModel;
  }
  async prepareDepartmentModel(departmentModel: DepartmentEntity, departmentDto: DepartmentDto) {
    departmentModel.color = departmentDto.getColor();
    departmentModel.name = departmentDto.getName();
  }
  prepareSearchObject(departmentDto: DepartmentDto): any {
    let searchObject: any = {};
    if (departmentDto.getName()) {
      searchObject.name = Like("%" + departmentDto.getName() + "%");
    }
    if (departmentDto.getColor()) {
      searchObject.color = Like("%" + departmentDto.getColor() + "%");
    }
    searchObject.status = Status.Online;
    return searchObject;
  }
}
