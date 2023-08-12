import { ReactNode } from "react";

export const MainTemplate: React.FC<{
  children?: ReactNode;
}> = ({
  children
}) => {
    return (
      <>
        <div className="flex h-screen bg-transparent">
          <aside className="bg-gray-200 w-80 rounded-xl">
            <div className="flex flex-col h-full pt-6 pb-6 pl-3 pr-3"> 
              {children}
            </div>
          </aside>
        </div>
        <div className="fixed bottom-0 left-0 w-80 h-2 flex mt-10">
          <div className="flex-1 bg-demoPrimary opacity-100">&nbsp;</div>
          <div className="flex-1 bg-demoSecondary opacity-100">&nbsp;</div>
          <div className="flex-1 bg-demoTertiary opacity-100">&nbsp;</div>
        </div>
      </>
    )
  }