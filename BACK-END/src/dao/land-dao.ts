import { LandDto } from "../dto/master/land-dto";
import { LandEntity } from "../entity/master/land-entity";

export interface LandDao {
    save(landDto: LandDto): Promise<LandEntity>;
    update(landDto: LandDto): Promise<LandEntity>;
    delete(landDto: LandDto): Promise<LandEntity>;
    findAll(landDto: LandDto): Promise<LandEntity[]>;
    findById(land_id: number): Promise<LandEntity>;
    findByName(landName: String): Promise<LandEntity>;
    findCount(departmentDto: LandDto): Promise<number>;
}