export abstract class CrudDto {
  private isNew: boolean;
  private isDelete: boolean;

  crudFillViaRequest(reqBody: any) {
    this.isNew = reqBody.isNew;
    this.isDelete = reqBody.isDelete;
  }

  public isIsNew(): boolean {
    return this.isNew;
  }

  public setIsNew(isNew: boolean): void {
    this.isNew = isNew;
  }

  public isIsDelete(): boolean {
    return this.isDelete;
  }

  public setIsDelete(isDelete: boolean): void {
    this.isDelete = isDelete;
  }
}
