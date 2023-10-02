import { NodeApplication } from "./decorators/custom-decorators";
import "reflect-metadata";

@NodeApplication
export class Application {
  public run(port: Number): void {
    console.log("Server Listen at : " + port);
  }
}
