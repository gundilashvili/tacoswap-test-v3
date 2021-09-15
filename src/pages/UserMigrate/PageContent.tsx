import { ReactElement } from "react";
import { TYPE } from "theme";

interface PageContent {
  title: string;
  subtitle: string;
  text?: (ReactElement | null)[];
}

const PageContent = ({ title, subtitle, text }: PageContent) => {
  return (
    <>
      <TYPE.brown fontSize={18} fontWeight={800} paddingBottom={22}>
        {title}
      </TYPE.brown>
      {subtitle && (
        <TYPE.brownOpacity paddingBottom={24} fontSize={18} lineHeight="28px">
          {subtitle}
        </TYPE.brownOpacity>
      )}
      <TYPE.brownOpacity paddingBottom={text ? 60 : 0}>{text}</TYPE.brownOpacity>
    </>
  );
};

export default PageContent;
