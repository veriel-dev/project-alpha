export const RootContainerComponent: React.FC<{
  id: string;
  children?: React.ReactNode;
}> = (props) => {
  return (
    <div id={props.id}>
      {props.children}
    </div>
  );
};