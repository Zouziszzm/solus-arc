import { ComponentConfig } from "../types";

export const progressiveBlurConfig: ComponentConfig = {
    name: "Progressive Blur",
    slug: "progressive-blur",
    category: "Visuals",
    description: "Sometimes things are better left a bit blurry.",
    authorName: "Rohit Singh Rawat",
    authorLink: "https://rohitsinghrawat.com/",
    sourceFile: "progressive-blur.tsx",
    props: [
        {
            name: "side",
            label: "Side",
            type: "select",
            default: "vertical",
            options: ["top", "bottom", "left", "right", "vertical", "horizontal", "all"],
            description: "Which side(s) to apply the blur to."
        },
        {
            name: "blurSize",
            label: "Blur Size",
            type: "slider",
            default: 100,
            min: 0,
            max: 500,
            step: 1,
            description: "The height/width of the blur container in px."
        },
        {
            name: "maxBlur",
            label: "Max Blur",
            type: "slider",
            default: 24,
            min: 0,
            max: 100,
            step: 1,
            description: "The maximum blur intensity in px."
        },
        {
            name: "intensity",
            label: "Intensity (Layers)",
            type: "slider",
            default: 8,
            min: 1,
            max: 24,
            step: 1,
            description: "Number of layers used to calculate the progression. More layers = smoother."
        },
        {
            name: "inset",
            label: "Inset Mode",
            type: "switch",
            default: true,
            description: "If true, the blur overlays are absolute and stay inside the parent."
        },
        {
            name: "maxHeight",
            label: "Max Height",
            type: "input",
            default: "400px",
            description: "Maximum height of the scrollable container (include units like px, %, vh)."
        },
        {
            name: "debug",
            label: "Debug Mode",
            type: "switch",
            default: false,
            description: "Show red outlines for the blur areas."
        }
    ]
};
