export type Item = {
    id: number;
    component: "ElementButton" | "ElementParagraph";
    props: {
        text: string;
        message?: string;
    };
};

export const isItem = (obj: any): obj is Item => {
    return (
        typeof obj.id === "number" &&
        (obj.component === "ElementButton" ||
            obj.component === "ElementParagraph") &&
        typeof obj.props === "object" &&
        typeof obj.props.text === "string" &&
        (typeof obj.props.message === "undefined" ||
            typeof obj.props.message === "string")
    );
};
