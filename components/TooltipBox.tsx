interface Props {
  title?: string;
  message: string;
}

export const TooltipBox = ({ title = "i", message }: Props) => {
  return (
    <span
      // @ts-ignore
      type="button"
      className="custom-toolkit text-white ml-2 px-2 rounded bg-secondary"
      data-toggle="tooltip"
      data-placement="top"
      title={message}
    >
      {title}
    </span>
  );
};
