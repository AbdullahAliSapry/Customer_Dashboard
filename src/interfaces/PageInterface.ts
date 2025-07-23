import { IComponent } from "./ComponentInterface";

export interface IPage {
    id: number;
    name: string;
    components: IComponent[];
    templatedataid: number;
}
