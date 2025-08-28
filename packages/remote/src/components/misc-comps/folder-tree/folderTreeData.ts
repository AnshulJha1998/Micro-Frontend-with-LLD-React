export type STRUCTURE = {
  name: string;
  isFolder: boolean;
  id: string;
  children?: STRUCTURE[];
};

export const data: STRUCTURE[] = [
  {
    name: "Project-Name",
    isFolder: true,
    id: "1",
    children: [
      {
        name: "src",
        isFolder: true,
        id: "1.1",
        children: [
          {
            name: "assets",
            isFolder: true,
            id: "1.1.1",
          },
          {
            name: "comps",
            isFolder: true,
            id: "1.1.2",
            children: [
              {
                name: "input",
                isFolder: false,
                id: "1.1.2.1",
              },
              {
                name: "button",
                isFolder: false,
                id: "1.1.2.2",
              },
            ],
          },
        ],
      },
      {
        name: "public",
        isFolder: true,
        id: "1.2",
        children: [
          {
            name: "index.html",
            isFolder: false,
            id: "1.2.1",
          },
        ],
      },
      {
        name: "package.json",
        isFolder: false,
        id: "1.3",
      },
    ],
  },
  {
    name: "Project-Doc",
    isFolder: true,
    id: "2",
    children: [],
  },
];
