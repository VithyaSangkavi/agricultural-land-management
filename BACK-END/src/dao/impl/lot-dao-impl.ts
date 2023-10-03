import { getConnection, Like } from "typeorm";
import { LotDto } from "../../dto/master/lot-dto";
import { Status } from "../../enum/status";
import { LotEntity } from "../../entity/master/Lot";
import { LotDao } from "../lot-dao";

export class LotDaoImpl implements LotDao {
    async save(lotDto: LotDto): Promise<LotEntity> {
        let lotRepo = getConnection().getRepository(LotEntity);
        let lotModel = new LotEntity();

        lotModel.status = Status.Online;
        this.prepareLotModel(lotModel, lotDto);
        let savedLot = await lotRepo.save(lotModel);
        return savedLot;
    }
    async update(lotDto: LotDto): Promise<LotEntity> {
        let lotRepo = getConnection().getRepository(LotEntity);

        let lotId = lotDto.getLotId();//changed this code, this is noy original structure
        let lotModel =  await lotRepo.findOne({ where: { lot_id: lotId } });//changed this code, this is noy original structure
                
        if (lotModel) {
            this.prepareLotModel(lotModel, lotDto);
            let updatedModel = await lotRepo.save(lotModel);
            return updatedModel;
        } else {
            return null;
        }
    }
    async delete(lotDto: LotDto): Promise<LotEntity> {
        let lotRepo = getConnection().getRepository(LotEntity);

        let lotId = lotDto.getLotId();//changed this code, this is noy original structure
        let lotModel =  await lotRepo.findOne({ where: { lot_id: lotId } });//changed this code, this is noy original structure
        
        if (lotModel) {
            lotModel.status = Status.Offline;
            let updatedModel = await lotRepo.save(lotModel);
            return updatedModel;
        } else {
            return null;
        }
    }
    async findAll(lotDto: LotDto): Promise<LotEntity[]> {
        let lotRepo = getConnection().getRepository(LotEntity);
        let searchObject: any = this.prepareSearchObject(lotDto);
        let lotModel = await lotRepo.find({
            where: searchObject,
            skip: lotDto.getStartIndex(),
            take: lotDto.getMaxResult(),
            order: { lot_id: "DESC" }
        });
        return lotModel;
    }
    async findCount(lotDto: LotDto): Promise<number> {
        let lotRepo = getConnection().getRepository(LotEntity);
        let searchObject: any = this.prepareSearchObject(lotDto);
        let lotModel = await lotRepo.count({ where: searchObject });
        return lotModel;
    }
    async findById(lot_id: number): Promise<LotEntity> {
        let lotRepo = getConnection().getRepository(LotEntity);
        let lotModel = await lotRepo.findOne({ where: { lot_id } });
        return lotModel;
    }

    async prepareLotModel(lotModel: LotEntity, lotDto: LotDto) {
        lotModel.name = lotDto.getName();
        lotModel.area = lotDto.getArea();
        lotModel.uom = lotDto.getUom();
        lotModel.createdDate = lotDto.getCreatedDate();
        lotModel.updatedDate = lotDto.getUpdatedDate();
        lotModel.status = lotDto.getStatus();
    }
    prepareSearchObject(lotDto: LotDto): any {
        let searchObject: any = {};
        if (lotDto.getName()) {
            searchObject.name = Like("%" + lotDto.getName() + "%");
        }
        if (lotDto.getArea()) {
            searchObject.area = Like("%" + lotDto.getArea() + "%");
        }

        if (lotDto.getUom()) {
            searchObject.uom = Like("%" + lotDto.getUom() + "%");
        }

        if (lotDto.getCreatedDate()) {
            searchObject.createdDate = Like("%" + lotDto.getCreatedDate() + "%");
        }

        if (lotDto.getUpdatedDate()) {
            searchObject.updatedDate = Like("%" + lotDto.getUpdatedDate() + "%");
        }

        searchObject.status = Status.Online;

        return searchObject;

    }
}