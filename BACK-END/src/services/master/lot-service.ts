import { CommonResponse } from "../../common/dto/common-response";
import { LotDto } from "../../dto/master/lot-dto";

export interface LotService {
    save(lotDto: LotDto): Promise<CommonResponse>;
    update(lotDto: LotDto): Promise<CommonResponse>;
    delete(lotDto: LotDto): Promise<CommonResponse>;
    find(lotDto: LotDto): Promise<CommonResponse>;
    findById(lot_id: number): Promise<CommonResponse>;
    findByLandId(land: string): Promise<CommonResponse>;
    findLotByLandId(landId: number): Promise<CommonResponse>;
}