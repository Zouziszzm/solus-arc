"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    type ReactNode,
} from "react";

interface PanelContextValue {
    readonly isMaximized: boolean;
    readonly toggleMaximize: () => void;
}

const PanelContext = createContext<PanelContextValue | undefined>(undefined);

export function PanelProvider({ children }: { children: ReactNode }) {
    const [isMaximized, setIsMaximized] = useState<boolean>(false);

    const toggleMaximize = useCallback(() => {
        setIsMaximized((prev) => !prev);
    }, []);

    const value = useMemo(
        () => ({
            isMaximized,
            toggleMaximize,
        }),
        [isMaximized, toggleMaximize]
    );

    return (
        <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
    );
}

export function usePanel() {
    const context = useContext(PanelContext);
    if (context === undefined) {
        throw new Error("usePanel must be used within a PanelProvider");
    }
    return context;
}
