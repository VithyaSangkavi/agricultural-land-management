import { LotEntity } from "../../entity/master/lot-entity";
import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/status";
import { uStatus } from "../../enum/areaUOM";
import { Double } from "typeorm";

export class LotDto extends PaginationDto {
    private lot_id: number;
    private name: string;
    private area: Double;
    private uom: uStatus;
    private createdDate: Date;
    private updatedDate: Date;
    private status: Status;

    filViaRequest(body) {

        if (body.lot_id) {
            this.lot_id = body.lot_id;
        }
        this.name = body.name;
        this.area = body.area;
        this.uom = body.uom;
        this.createdDate = body.createdDate;
        this.updatedDate = body.updatedDate;
        this.status = body.status;
        if (body.startIndex && body.maxResult) {
            this.setStartIndex(body.startIndex);
            this.setMaxResult(body.maxResult);
        }
    }

    filViaDbObject(LotModel: LotEntity) {
        this.lot_id = LotModel.lot_id;
        this.name = LotModel.name;
        this.area = LotModel.area;
        this.uom = LotModel.uom;
        this.createdDate = LotModel.createdDate;
        this.updatedDate = LotModel.updatedDate;
        this.status = LotModel.status
    }

    public getLotId(): number {
        return this.lot_id;
    }

    public setLotId(land_id: number): void {
        this.lot_id = land_id;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getArea(): Double {
        return this.area;
    }

    public setArea(area: Double): void {
        this.area = area;
    }

    public getUom(): uStatus {
        return this.uom;
    }

    public setUom(uom: uStatus): void {
        this.uom = uom;
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
}