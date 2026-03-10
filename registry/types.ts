export type PropType = "slider" | "switch" | "input" | "number" | "select" | "color" | "links";

export interface ComponentProp {
    name: string;
    label: string;
    type: PropType;
    default: any;
    min?: number;
    max?: number;
    step?: number;
    options?: (string | number)[];
    description?: string;
}

export interface ComponentConfig {
    name: string;
    slug: string;
    category: string;
    description: string;
    props: ComponentProp[];
}
