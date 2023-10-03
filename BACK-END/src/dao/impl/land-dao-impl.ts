import { getConnection, Like } from "typeorm";
import { LandDto } from "../../dto/master/land-dto";
import { Status } from "../../enum/status";
import { uStatus } from "../../enum/uStatus";
import { LandEntity } from "../../entity/master/Land";
import { LandDao } from "../land-dao";

export class LandDaoImpl implements LandDao {
    async save(landDto: LandDto): Promise<LandEntity> {
        let landRepo = getConnection().getRepository(LandEntity);
        let landModel = new LandEntity();

        landModel.status = Status.Online;
        this.prepareLandModel(landModel, landDto);
        let savedLand = await landRepo.save(landModel);
        return savedLand;
    }
    async update(landDto: LandDto): Promise<LandEntity> {
        let landRepo = getConnection().getRepository(LandEntity);

        let landId = landDto.getLandId(); //changed this code, this is noy original structure
        let landModel = await landRepo.findOne({ where: { land_id: landId } });//changed this code, this is noy original structure
                
        if (landModel) {
            this.prepareLandModel(landModel, landDto);
            let updatedModel = await landRepo.save(landModel);
            return updatedModel;
        } else {
            return null;
        }
    }
    async delete(landDto: LandDto): Promise<LandEntity> {
        let landRepo = getConnection().getRepository(LandEntity);

        let landId = landDto.getLandId(); //changed this code, this is noy original structure
        let landModel = await landRepo.findOne({ where: { land_id: landId } });//changed this code, this is noy original structure

        if (landModel) {
            landModel.status = Status.Offline;
            let updatedModel = await landRepo.save(landModel);
            return updatedModel;
        } else {
            return null;
        }
    }
    async findAll(landDto: LandDto): Promise<LandEntity[]> {
        let landRepo = getConnection().getRepository(LandEntity);
        let searchObject: any = this.prepareSearchObject(landDto);
        let landModel = await landRepo.find({
            where: searchObject,
            skip: landDto.getStartIndex(),
            take: landDto.getMaxResult(),
            order: { land_id: "DESC" }
        });
        return landModel;
    }
    async findCount(landDto: LandDto): Promise<number> {
        let landRepo = getConnection().getRepository(LandEntity);
        let searchObject: any = this.prepareSearchObject(landDto);
        let landModel = await landRepo.count({ where: searchObject });
        return landModel;
    }
    async findById(land_id: number): Promise<LandEntity> {
        let landRepo = getConnection().getRepository(LandEntity);
        let landModel = await landRepo.findOne( { where: { land_id } });//changed this code, this is noy original structure
        return landModel;
    }
    async prepareLandModel(landModel: LandEntity, landDto: LandDto) {
        landModel.name = landDto.getName();
        landModel.area = landDto.getArea();
        landModel.city = landDto.getCity();
        landModel.uom = landDto.getUom();
        landModel.createdDate = landDto.getCreatedDate();
        landModel.updatedDate = landDto.getUpdatedDate();
        landModel.status = landDto.getStatus();
    }
    prepareSearchObject(landDto: LandDto): any {
        let searchObject: any = {};
        
        if (landDto.getName()) {
            searchObject.name = Like("%" + landDto.getName() + "%");
        }
        if (landDto.getArea()) {
            searchObject.area = Like("%" + landDto.getArea() + "%");
        }
        
        if (landDto.getCity()) {
            searchObject.city = Like("%" + landDto.getCity() + "%");
        }
        
        if (landDto.getUom()) {
            searchObject.uom = Like("%" + landDto.getUom() + "%");
        }
        
        if (landDto.getCreatedDate()) {
            searchObject.createdDate = Like("%" + landDto.getCreatedDate() + "%");
        }
    
        if (landDto.getUpdatedDate()) {
            searchObject.updatedDate = Like("%" + landDto.getUpdatedDate() + "%");
        }
    
        searchObject.status = Status.Online;

        return searchObject;
    }
}