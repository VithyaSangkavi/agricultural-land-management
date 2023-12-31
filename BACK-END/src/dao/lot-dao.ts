import { LotDto } from "../dto/master/lot-dto";
import { LandEntity } from "../entity/master/land-entity";
import { LotEntity } from "../entity/master/lot-entity";

export interface LotDao {
    save(lotDto: LotDto, landModel: LandEntity): Promise<LotEntity>;
    update(lotDto: LotDto): Promise<LotEntity>;
    delete(lotDto: LotDto): Promise<LotEntity>;
    findAll(lotDto: LotDto): Promise<LotEntity[]>;
    findById(lot_id: number): Promise<LotEntity>;
    findByName(lotName: String): Promise<LotEntity>;
    findByLandId(land: string): Promise<LotEntity[]>;
    findCount(lotDto: LotDto): Promise<number>;
    findLotByLandId(landId: number): Promise<LotEntity | null>;
}