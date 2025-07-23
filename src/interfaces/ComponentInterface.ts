// 1. Define the base interface


export interface IComponentContent {
    id?: string;
    title?: string;
    subtitle?: string;
    paragraph?: string;
    subparagraph?: string;
    imageurl?: string;
    imagealt?: string;
    link?: string;
    linktext?: string;
    buttontext?: string[];
    icon?: string;
    rating?: number;
}


export interface IComponent {
    id: number;
    name: string;
    pageid: number;
    componentcontent: IComponentContent;
}

