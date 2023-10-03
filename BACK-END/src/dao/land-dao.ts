import { LandDto } from "../dto/master/land-dto";
import { LandEntity } from "../entity/master/Land";

export interface LandDao {
    save(landDto: LandDto): Promise<LandEntity>;
    update(landDto: LandDto): Promise<LandEntity>;
    delete(landDto: LandDto): Promise<LandEntity>;
    findAll(landDto: LandDto): Promise<LandEntity[]>;
    findById(land_id: number): Promise<LandEntity>;
}