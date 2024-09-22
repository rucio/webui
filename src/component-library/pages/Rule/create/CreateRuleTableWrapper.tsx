import {ReactNode} from "react";

export const CreateRuleTableWrapper = ({ children }: { children: ReactNode }) => {
    return <div className="h-[450px] flex flex-col">{children}</div>;
};