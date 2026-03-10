// export const NavigationCompass = dynamic(() => import("./navigation-compass").then(mod => mod.NavigationCompass));
// actually it's easier and better to just export them normally since they are client components anyway 
// and we want types to work properly in the workbench.

export { NavigationCompass } from "./navigation-compass";
