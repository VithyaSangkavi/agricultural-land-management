import { LotEntity } from "../../entity/master/lot-entity";
import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/Status";
import { areaUOM } from "../../enum/areaUOM";

export class LotDto extends PaginationDto {
    private id: number;
    private lotName: string;
    private area: number;
    private areaUOM: areaUOM;
    private createdDate: Date;
    private updatedDate: Date;
    private status: Status;
    private landId: number;

    filViaRequest(body) {

        if (body.id) {
            this.id = body.id;
        }
        this.lotName = body.lotName;
        this.area = body.area;
        this.areaUOM = body.areaUOM;
        this.createdDate = body.createdDate;
        this.updatedDate = body.updatedDate;
        this.status = body.status;
        this.landId = body.land.id;
        if (body.startIndex && body.maxResult) {
            this.setStartIndex(body.startIndex);
            this.setMaxResult(body.maxResult);
        }
    }

    filViaDbObject(LotModel: LotEntity) {
        this.id = LotModel.id;
        this.lotName = LotModel.lotName;
        this.area = LotModel.area;
        this.areaUOM = LotModel.areaUOM;
        this.createdDate = LotModel.createdDate;
        this.updatedDate = LotModel.updatedDate;
        this.status = LotModel.status
        this.landId = LotModel.land.id;
    }

    public getLotId(): number {
        return this.id;
    }

    public setLotId(id: number): void {
        this.id = id;
    }

    public getLotName(): string {
        return this.lotName;
    }

    public setLotName(lotName: string): void {
        this.lotName = lotName;
    }

    public getArea(): number {
        return this.area;
    }

    public setArea(area: number): void {
        this.area = area;
    }

    public getAreaUOM(): areaUOM {
        return this.areaUOM;
    }

    public setAreaUOM(areaUOM: areaUOM): void {
        this.areaUOM = areaUOM;
    }

    public getCreatedDate(): Date {
        return this.createdDate;
    }

    public setCreatedDate(createdDate: Date): void {
        this.createdDate = createdDate;
    }

    public getUpdatedDate(): Date {
        return this.updatedDate;
    }

    public setUpdatedDate(updatedDate: Date): void {
        this.updatedDate = updatedDate;
    }

    public getStatus(): Status {
        return this.status;
    }

    public setStatus(status: Status): void {
        this.status = status;
    }

    public getLandId(): number {
        return this.landId;
    }

    public setLandId(landId: number): void {
        this.landId = landId;
    }
}