import clsx from "clsx";
import { FunctionComponent } from "react";

interface TextProps {
  html: string;
  className?: string;
}

const Prose: FunctionComponent<TextProps> = ({ html, className }) => {
  return (
    <div
      className={clsx(
        "prose mx-auto max-w-6xl text-base leading-7 text-white dark:text-white",
        "prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-wide",
        "prose-headings:text-white dark:prose-headings:text-white",
        "prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg",
        "prose-a:text-accent hover:prose-a:text-accent/80 prose-a:underline",
        "prose-strong:text-white dark:prose-strong:text-white",
        "prose-ol:mt-8 prose-ol:list-decimal prose-ol:pl-6",
        "prose-ul:mt-8 prose-ul:list-disc prose-ul:pl-6",
        "prose-p:text-white dark:prose-p:text-white",
        "prose-blockquote:text-white dark:prose-blockquote:text-white",
        "prose-figure:text-white dark:prose-figure:text-white",
        "prose-figcaption:text-white dark:prose-figcaption:text-white",
        "prose-code:text-white dark:prose-code:text-white",
        "prose-pre:text-white dark:prose-pre:text-white",
        "prose-em:text-white dark:prose-em:text-white",
        "prose-table:text-white dark:prose-table:text-white",
        "prose-tr:text-white dark:prose-tr:text-white",
        "prose-td:text-white dark:prose-td:text-white",
        "prose-img:rounded-2xl",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html as string }}
    />
  );
};

export default Prose;
