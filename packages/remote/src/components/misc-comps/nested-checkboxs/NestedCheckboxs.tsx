import { nestedCheckBoxData } from "./nestedCheckBoxData";

const SingleCheckBox = () => {
  return <input type="checkbox" />;
};

const Tree = ({ box }) => {
  return (
    <div key={box.id} style={{ marginLeft: 20 }}>
      <input type="checkbox" />
      <span>{box.label}</span> {/* assuming your data has a label property */}
      {Array.isArray(box.children) && box.children.length > 0 && (
        <div style={{ marginLeft: 20 }}>
          {box.children.map((child) => (
            <Tree key={child.id} box={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const NestedCheckBox = () => {
  return (
    <div>
      <h1>Nested Check Box</h1>
      {nestedCheckBoxData.map((each) => (
        <Tree key={each.id} box={each} />
      ))}
    </div>
  );
};

export default NestedCheckBox;
