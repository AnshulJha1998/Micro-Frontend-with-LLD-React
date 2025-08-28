import { data, type STRUCTURE } from "./folderTreeData";

const Folder = ({ folder }: { folder: STRUCTURE }) => {
  return (
    <div style={{ marginLeft: 20, marginTop: 10 }}>
      <h3>Folder : {folder.name}</h3>
      <Tree propData={folder?.children ?? []} />
    </div>
  );
};

const File = ({ file }: { file: STRUCTURE }) => {
  return (
    <div style={{ marginLeft: 20, marginTop: 10 }}>File Name : {file.name}</div>
  );
};

const Tree = ({ propData }: { propData: STRUCTURE[] }) => {
  if (!propData || propData.length === 0) return null;
  return (
    <>
      {propData.map((each) => {
        return (
          <div key={each.id}>
            {each.isFolder ? <Folder folder={each} /> : <File file={each} />}
          </div>
        );
      })}
    </>
  );
};
const FolderTree = () => {
  return (
    <div>
      <h1>Tree</h1>
      <Tree propData={data} />
    </div>
  );
};

export default FolderTree;
