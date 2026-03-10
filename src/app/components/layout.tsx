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
                <main className="flex-1 md:pl-64 lg:pl-72">
                    {children}
                </main>
            </div>
        </PanelProvider>
    );
}
