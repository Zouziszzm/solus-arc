import { PanelProvider } from "@/components/workbench/panel-context";
import { SidebarNav } from "@/components/workbench/SidebarNav";

export default function ComponentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PanelProvider>
            <div className="flex w-full">
                <SidebarNav />
                <main className="flex-1 lg:pl-72 pt-32 lg:pt-0">
                    {children}
                </main>
            </div>
        </PanelProvider>
    );
}
