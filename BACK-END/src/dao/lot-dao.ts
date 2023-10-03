import { LotDto } from "../dto/master/lot-dto";
import { LotEntity } from "../entity/master/Lot";

export interface LotDao {
    save(lotDto: LotDto): Promise<LotEntity>;
    update(lotDto: LotDto): Promise<LotEntity>;
    delete(lotDto: LotDto): Promise<LotEntity>;
    findAll(lotDto: LotDto): Promise<LotEntity[]>;
    findById(lot_id: number): Promise<LotEntity>;
}