import { ComponentConfig } from "../types";

export const navigationCompassConfig: ComponentConfig = {
    name: "Navigation Compass",
    slug: "navigation-compass",
    category: "Navigation",
    description: "A premium, interactive navigation compass with magnetic effects, panning, and active zone tracking.",
    sourceFile: "navigation-compass.tsx",
    props: [
        // Core Configuration
        {
            name: "links",
            label: "Links",
            type: "links",
            default: [],
            description: "Array of navigation links with angle, label, and href."
        },
        {
            name: "activeZoneAngle",
            label: "Active Zone Angle",
            type: "slider",
            default: 0,
            min: 0,
            max: 360,
            step: 1,
            description: "Angle (degrees, 0=top, CW) of the 'active zone' pointer."
        },
        {
            name: "size",
            label: "Size",
            type: "slider",
            default: 756,
            min: 200,
            max: 2000,
            step: 1,
            description: "SVG viewBox size in px (square). Component is always responsive."
        },
        // ... Visual Styling ...
        {
            name: "activeColor",
            label: "Active Color",
            type: "color",
            default: "#f97316",
            description: "Custom color for the active tick line and highlighted elements."
        },
        {
            name: "roseStyle",
            label: "Rose Style",
            type: "select",
            default: "solid",
            options: ["solid", "lines", "minimal", "cross"],
            description: "Which style of inner rose to display."
        },
        {
            name: "roseSize",
            label: "Rose Size",
            type: "slider",
            default: 0.9,
            min: 0.1,
            max: 1.5,
            step: 0.05,
            description: "Radius scale for the inner rose."
        },
        {
            name: "showMinorRoseArms",
            label: "Show Minor Arms",
            type: "switch",
            default: true,
            description: "Whether to show the secondary/minor arms of the compass rose."
        },
        {
            name: "highlightedPointerAngle",
            label: "Highlighted Angle",
            type: "select",
            default: 0,
            options: [0, 90, 180, 270],
            description: "Angle of the rose arm to highlight (0, 90, 180, 270)."
        },

        // Typography
        {
            name: "labelFontSize",
            label: "Label Font Size",
            type: "slider",
            default: 16,
            min: 8,
            max: 48,
            step: 1,
            description: "Font size for navigation links."
        },
        {
            name: "degreeFontSize",
            label: "Degree Font Size",
            type: "slider",
            default: 12,
            min: 8,
            max: 24,
            step: 1,
            description: "Font size for degree labels."
        },
        {
            name: "linksVisibility",
            label: "Links Visibility",
            type: "select",
            default: "always",
            options: ["always", "on-demand"],
            description: "Whether link labels are always visible or only show when active/hovered."
        },

        // Physics & Interaction
        {
            name: "magnetic",
            label: "Magnetic",
            type: "switch",
            default: false,
            description: "If true, the inner rose rotates to follow the user's cursor."
        },
        {
            name: "snapToTick",
            label: "Snap to Tick",
            type: "switch",
            default: false,
            description: "Snap rotation to the nearest tick mark."
        },
        {
            name: "panElement",
            label: "Pan Element",
            type: "select",
            default: "dial",
            options: ["dial", "rose"],
            description: "Should user pan rotate the outer Dial ring, or the inner Rose needle?"
        },
        {
            name: "followActiveZone",
            label: "Follow Active Zone",
            type: "switch",
            default: false,
            description: "Automatically rotate the inner rose so its highlighted arm points to the active zone."
        },
        {
            name: "activeZoneThreshold",
            label: "Active Zone Threshold",
            type: "slider",
            default: 15,
            min: 0,
            max: 90,
            step: 1,
            description: "Half-width of the active zone cone in degrees."
        },
        {
            name: "roseRotation",
            label: "Base Rose Rotation",
            type: "slider",
            default: 45,
            min: 0,
            max: 360,
            step: 1,
            description: "Initial rotation of the compass rose."
        },
        {
            name: "showDetails",
            label: "Show HUD",
            type: "switch",
            default: false,
            description: "Renders a draggable debug overlay with live info."
        },

        // Geometry/Radius
        {
            name: "numberRadiusMultiplier",
            label: "Number Radius",
            type: "slider",
            default: 0.45,
            min: 0.1,
            max: 1.0,
            step: 0.01,
            description: "Radius scale for the outer numbers."
        },
        {
            name: "linksRadiusMultiplier",
            label: "Links Radius Multiplier",
            type: "slider",
            default: 0.4762,
            min: 0.1,
            max: 1.0,
            step: 0.0001,
            description: "Positional radius multiplier for links."
        },
        {
            name: "activeTickExtension",
            label: "Active Tick Extension",
            type: "slider",
            default: 25,
            min: 0,
            max: 100,
            step: 1,
            description: "Length of the active tick mark extension."
        },
        {
            name: "linksRadius",
            label: "Links Radius Mode",
            type: "select",
            default: "outer",
            options: ["outer", "numbers"],
            description: "Radius mode where links are placed."
        }
    ]
};
