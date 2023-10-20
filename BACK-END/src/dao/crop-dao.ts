import { CropDto } from "../dto/master/crop-dto";
import { CropEntity } from "../entity/master/crop-entity";
import { LandEntity } from "../entity/master/land-entity";

export interface CropDao {
    save(cropDto: CropDto, landModel: LandEntity): Promise<CropEntity>;
    update(cropDto: CropDto): Promise<CropEntity>;
    delete(cropDto: CropDto): Promise<CropEntity>;
    findAll(cropDto: CropDto): Promise<CropEntity[]>;
    findById(crop_id: number): Promise<CropEntity>;
    findByName(cropName: String): Promise<CropEntity>;
    findCount(departmentDto: CropDto): Promise<number>;
    findCropIdByLandId(landId: number): Promise<number>;
}